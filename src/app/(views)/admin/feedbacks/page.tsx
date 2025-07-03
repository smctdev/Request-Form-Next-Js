"use client";

import adminPage from "@/lib/adminPage";
import { FeedbackType } from "../_types/Feedback";
import TableLoader from "../_components/loaders/TableLoader";
import useFetch from "../_hooks/useFetch";
import DataTable from "react-data-table-component";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { paginationRowsPerPageOptions } from "@/constants/paginationRowsPerPageOptions";

function Feedbacks() {
  const {
    data: feedbacks,
    isLoading,
    pagination,
    setPagination,
  } = useFetch({ url: "/feedbacks" });

  const tableHeads = [
    "ID/Code",
    "Name",
    "Email",
    "Phone",
    "Department",
    "Opinion",
    "Message",
    "Date Submitted",
  ];

  const tableData = [
    {
      name: "ID/CODE",
      cell: (row: FeedbackType) => (
        <span className="p-2 break-words font-bold text-gray-600">
          {row.id}/{row.feedback_code}
        </span>
      ),
      width: "150px",
    },
    {
      name: "NAME",
      selector: (row: FeedbackType) => row.name,
    },
    {
      name: "EMAIL",
      selector: (row: FeedbackType) => row.email,
    },
    {
      name: "PHONE",
      selector: (row: FeedbackType) => row.phone,
    },
    {
      name: "DEPARTMENT",
      selector: (row: FeedbackType) => row.department,
    },
    {
      name: "OPINION",
      selector: (row: FeedbackType) =>
        row.opinion === "other" ? row.other_opinion : row.opinion,
    },
    {
      name: "MESSAGE",
      cell: (row: FeedbackType) => (
        <span className="whitespace-pre-wrap">{row.message}</span>
      ),
    },
    {
      name: "DATE SUBMITTED",
      cell: (row: FeedbackType) => (
        <div>
          <p>{formatDate(row.created_at, "MMM dd, yyyy h:mm a")}</p>
          <p className="text-gray-500 !text-sm">
            {formatDistanceToNowStrict(row.created_at, { addSuffix: true })}
          </p>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      current_page: page,
    });
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setPagination({
      ...pagination,
      per_page: perPage,
    });
  };

  return (
    <div className="bg-graybg min-h-screen pt-8 px-6 pb-20">
      <h2 className="!text-4xl font-bold text-blue-400 mb-6">Feedbacks</h2>

      <div className="bg-white rounded-xl shadow-md">
        <DataTable
          columns={tableData}
          data={feedbacks}
          pagination
          paginationServer
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          paginationTotalRows={pagination.total}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          progressComponent={
            <div className="w-full">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="w-full border border-gray-200 p-2">
                    <div className="flex justify-center">
                      <div className="flex flex-col w-full gap-4">
                        <div className="w-full h-12 skeleton bg-slate-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          progressPending={isLoading}
          persistTableHead
        />
      </div>
    </div>
  );
}

export default adminPage(Feedbacks);
