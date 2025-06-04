import { api } from "@/lib/api";
import { format, formatDistanceToNowStrict } from "date-fns";
import Swal from "sweetalert2";

export default function RequestAccessCard({
  requestAccess,
  handleRequestAgain,
  updateProfile,
}: any) {
  const status = requestAccess.status;

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Loading...",
          text: "Deleting your request access...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await api.delete(
            `/request-access/${requestAccess.id}/delete`
          );
          if (response.status === 204) {
            handleRequestAgain();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Your request access has been deleted.",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Close",
            });
          }
        } catch (error: any) {
          console.error(error);
          if (error.response.status === 403) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An error occurred while deleting your request access.",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Close",
            });
          }
        } finally {
          updateProfile();
        }
      }
    });
  };

  return (
    <>
      <div className="max-w-lg shadow rounded-lg">
        <div className="p-5 bg-blue-500 rounded-t-lg">
          <p className="text-center text-white font-bold !text-2xl">
            Your latest request for access. Please wait until the administrator
            approves your request.
          </p>
        </div>
        <hr className="border-gray-300 border-t" />

        <div className="space-y-5 p-5">
          <p className="text-center flex flex-col">
            <span className="text-gray-600 !text-md font-semibold">
              Request Access Type:
            </span>{" "}
            <span className="text-blue-400 font-bold underline !text-lg capitalize">
              {requestAccess.request_access_type.replace("_", " ")}
            </span>
          </p>
          <p className="text-center flex flex-col">
            <span className="text-gray-600 !text-md font-semibold">
              Request Access Code:
            </span>{" "}
            <span className="text-blue-400 font-bold underline !text-lg">
              {requestAccess.request_access_code}
            </span>
          </p>
          <p className="text-center flex flex-col">
            <span className="text-gray-600 !text-md font-semibold">
              Submitted Request Access:
            </span>{" "}
            <span className="text-blue-400 font-bold underline !text-lg">
              {format(requestAccess.created_at, "MMMM dd, yyyy")} -{" "}
              <span className="!text-sm italic text-gray-400 font-normal">
                (
                {formatDistanceToNowStrict(requestAccess.created_at, {
                  addSuffix: true,
                })}
                )
              </span>
            </span>
          </p>
          <p className="text-center flex flex-col">
            <span className="text-gray-600 !text-md font-semibold">
              Request <span className="capitalize">{status}</span> At:
            </span>{" "}
            <span className="text-blue-400 font-bold underline !text-lg">
              {format(requestAccess.updated_at, "MMMM dd, yyyy")} -{" "}
              <span className="!text-sm italic text-gray-400 font-normal">
                (
                {formatDistanceToNowStrict(requestAccess.updated_at, {
                  addSuffix: true,
                })}
                )
              </span>
            </span>
          </p>
          <div className="flex justify-center items-center">
            <p
              className={`w-fit text-white !text-2xl uppercase font-bold p-3 rounded-2xl ${
                status === "pending"
                  ? "bg-yellow-500"
                  : status === "approved"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {status}
            </p>
          </div>

          <hr className="border-gray-300 border-t" />
          {status === "pending" ? (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-400"
            >
              Cancel Request
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRequestAgain}
              className="w-full p-3 rounded-md bg-blue-500 text-white hover:bg-blue-400"
            >
              Request Again
            </button>
          )}
        </div>
      </div>
    </>
  );
}
