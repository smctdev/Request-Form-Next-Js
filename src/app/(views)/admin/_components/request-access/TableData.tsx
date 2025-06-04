import { api } from "@/lib/api";
import { formatDate } from "date-fns";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import Swal from "sweetalert2";
import { timeFormat } from "../../_utils/timeFormat";

export default function TableData({ item, setIsRefresh }: any) {
  const handleUpdate = (title: string) => () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to update this request access to ${title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Loading...",
          text: "Updating employee request access...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        setIsRefresh(true);
        try {
          const response = await api.patch(
            `/request-access/${item.id}/update`,
            {
              status: title,
            }
          );
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: response.data,
              confirmButtonText: "Close",
              confirmButtonColor: "#007bff",
            });
          }
        } catch (error: any) {
          console.error(error);
          if (error.response.status === 403) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data,
              confirmButtonText: "Close",
              confirmButtonColor: "#007bff",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An unexpected error occurred. Please try again later.",
              confirmButtonText: "Close",
              confirmButtonColor: "#007bff",
            });
          }
        } finally {
          setIsRefresh(false);
        }
      }
    });
  };

  return (
    <tr>
      <td className="px-6 py-4 max-w-[180px] break-words font-bold text-gray-600">
        {item.id}/{item.request_access_code}
      </td>
      <td className="px-6 py-4 capitalize">
        {item.request_access_type.replace("_", " ")}
      </td>
      <td className="px-6 py-4">
        {item.user?.firstName} {item.user?.lastName}
      </td>
      <td className="px-6 py-4 whitespace-pre-wrap">{item.message}</td>
      <td className="px-6 py-4">
        <span
          className={`${
            item.status === "pending"
              ? "bg-yellow-500"
              : item.status === "approved"
              ? "bg-green-500"
              : "bg-red-500"
          } px-2 rounded-4xl text-white uppercase font-bold !text-sm`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <p>{formatDate(item.created_at, "MMM dd, yyyy h:mm a")}</p>
        <p className="text-gray-500 !text-sm">{timeFormat(item.created_at)}</p>
      </td>
      <td className="px-6 py-4">
        {item.status !== "pending" ? (
          <>-</>
        ) : (
          <span className="flex gap-1">
            <button
              type="button"
              onClick={handleUpdate("approved")}
              className="p-2 bg-green-500 hover:bg-green-400 text-white rounded-full"
            >
              <FaCheck />
            </button>
            <button
              type="button"
              onClick={handleUpdate("declined")}
              className="p-2 bg-red-500 hover:bg-red-400 text-white rounded-full"
            >
              <FaX />
            </button>
          </span>
        )}
      </td>
    </tr>
  );
}
