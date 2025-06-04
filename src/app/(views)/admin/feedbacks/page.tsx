"use client";

import adminPage from "@/lib/adminPage";
import { FeedbackType } from "../_types/Feedback";
import TableData from "../_components/feedbacks/TableData";
import TableLoader from "../_components/loaders/TableLoader";
import useFetch from "../_hooks/useFetch";
import Pagination from "../_components/ui/Pagination";

function Feedbacks() {
  const {
    data: feedbacks,
    isLoading,
    pagination,
    setPagination,
  } = useFetch({ url: "/feedbacks" });

  const tableHead = [
    "ID/Code",
    "Name",
    "Email",
    "Phone",
    "Department",
    "Opinion",
    "Message",
    "Date Submitted",
  ];

  return (
    <div className="bg-graybg min-h-screen pt-8 px-6 pb-20">
      <h2 className="!text-4xl font-bold text-blue-400 mb-6">Feedbacks</h2>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              {tableHead.map((item: string, index: number) => (
                <th key={index} className="px-6 py-4">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <TableLoader colSpan={8} />
            ) : feedbacks.length > 0 ? (
              feedbacks?.map((item: FeedbackType, index: number) => (
                <TableData key={index} item={item} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-5 font-bold">
                  No feedbacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default adminPage(Feedbacks);
