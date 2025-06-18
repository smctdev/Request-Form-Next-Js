"use client";

import adminPage from "@/lib/adminPage";
import { useEffect } from "react";
import TableLoader from "../_components/loaders/TableLoader";
import echo from "@/hooks/echo";
import { useAuth } from "@/context/AuthContext";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import useFetch from "../_hooks/useFetch";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { api } from "@/lib/api";
import { formatDate } from "date-fns";
import { timeFormat } from "../_utils/timeFormat";
import { FaCheck } from "react-icons/fa";
import { paginationRowsPerPageOptions } from "@/constants/paginationRowsPerPageOptions";

function RequestAccess() {
  const { user } = useAuth();
  const {
    data: requestAccess,
    setData: setRequestAccess,
    isLoading,
    searchTerm,
    handleSearch,
    setIsRefresh,
    pagination,
    setPagination,
  } = useFetch({ url: "/employee-request-access" });

  useEffect(() => {
    if (!user.id || !echo) return;

    const channel = echo
      .private(`request-access.${user.id}`)
      .listen("RequestAccessEvent", (event: any) => {
        if (searchTerm) return;
        const { requestAccess, is_delete } = event;

        if (is_delete) {
          setRequestAccess((prevRequestAccess: any) => [
            ...prevRequestAccess.filter(
              (item: any) => item.id !== requestAccess.id
            ),
          ]);
          return;
        }
        setRequestAccess((prevRequestAccess: any) => [
          requestAccess,
          ...prevRequestAccess,
        ]);
      });

    return () => {
      channel.stopListening("RequestAccessEvent");
    };
  }, [echo, user.id, searchTerm]);

  const tableHeads = [
    "ID/Code",
    "Type",
    "Employee Name",
    "Message",
    "Status",
    "Date Submitted",
    "Action",
  ];

  const tableData = [
    {
      name: "ID/CODE",
      cell: (row: any) => (
        <span className="max-w-[180px] break-words font-bold text-gray-600">
          {row.id}/{row.request_access_code}
        </span>
      ),
      width: "150px",
    },
    {
      name: "TYPE",
      cell: (row: any) => (
        <span className="capitalize">
          {row.request_access_type.replace("_", " ")}
        </span>
      ),
    },
    {
      name: "EMPLOYEE NAME",
      cell: (row: any) => (
        <span className="p-2 break-words font-bold text-gray-600">
          {row.user?.firstName} {row.user?.lastName}
        </span>
      ),
    },
    {
      name: "MESSAGE",
      cell: (row: any) => (
        <span className="whitespace-pre-wrap">{row.message}</span>
      ),
    },
    {
      name: "STATUS",
      cell: (row: any) => (
        <span
          className={`${
            row.status === "pending"
              ? "bg-yellow-500"
              : row.status === "approved"
              ? "bg-green-500"
              : "bg-red-500"
          } px-2 rounded-4xl text-white uppercase font-bold !text-sm`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "DATE SUBMITTED",
      cell: (row: any) => (
        <div>
          <p>{formatDate(row.created_at, "MMM dd, yyyy h:mm a")}</p>
          <p className="text-gray-500 !text-sm">{timeFormat(row.created_at)}</p>
        </div>
      ),
    },
    {
      name: "ACTION",
      cell: (row: any) =>
        row.status !== "pending" ? (
          <>-</>
        ) : (
          <span className="flex gap-1">
            <button
              type="button"
              onClick={handleUpdate("approved", row.id)}
              className="p-2 bg-green-500 hover:bg-green-400 text-white rounded-full"
            >
              <FaCheck />
            </button>
            <button
              type="button"
              onClick={handleUpdate("declined", row.id)}
              className="p-2 bg-red-500 hover:bg-red-400 text-white rounded-full"
            >
              <FaX />
            </button>
          </span>
        ),
      width: "150px",
    },
  ];

  const handleUpdate = (title: string, id: number) => () => {
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
          const response = await api.patch(`/request-access/${id}/update`, {
            status: title,
          });
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

  const handlePage = (page: number) => {
    setPagination({
      ...pagination,
      current_page: page,
    });
  };

  const handlePerpage = (perPage: number) => {
    setPagination({
      ...pagination,
      per_page: perPage,
    });
  };

  return (
    <div className="bg-graybg min-h-screen pt-8 px-6 pb-20">
      <h2 className="!text-4xl font-bold text-blue-400 mb-6">Request Access</h2>

      <div className="my-4 relative">
        <input
          type="search"
          placeholder="Search..."
          onChange={handleSearch()}
          className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:outline-none focus:border-blue-500 block w-1/6 py-2.5 pr-2.5 pl-10"
        />
        <FaMagnifyingGlass className="absolute top-0 left-0 mt-3.5 ml-3 text-gray-400" />
      </div>
      <div className="bg-white rounded-xl shadow-md">
        <DataTable
          columns={tableData}
          data={requestAccess}
          pagination
          paginationServer
          onChangePage={handlePage}
          onChangeRowsPerPage={handlePerpage}
          paginationTotalRows={pagination.total}
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          paginationPerPage={pagination.per_page}
          progressPending={isLoading}
          progressComponent={
            <TableLoader colSpan={7} tableHeads={tableHeads} />
          }
        />
      </div>
    </div>
  );
}

export default adminPage(RequestAccess);
