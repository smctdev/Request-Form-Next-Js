"use client";

import adminPage from "@/lib/adminPage";
import { useEffect, useState } from "react";
import { FeedbackType } from "../_types/Feedback";
import { feedbacksData } from "../_constants/feedback";
import { api } from "@/lib/api";
import TableData from "../_components/feedbacks/table-data";
import TableLoader from "../_components/loaders/table-loader";
import { PaginationType } from "../_types/pagination";
import { paginationData } from "../_constants/pagination";

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>(feedbacksData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationType>(paginationData);

  useEffect(() => {
    setPagination((pagination) => ({
      ...pagination,
      loading: true,
    }));
    const fetchAllFeedbacks = async () => {
      try {
        const response = await api.get("/feedbacks", {
          params: {
            page: pagination?.current_page,
            per_page: pagination?.per_page,
          },
        });
        setFeedbacks(response.data.data);
        setPagination((pagination) => ({
          ...pagination,
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setPagination((pagination) => ({
          ...pagination,
          loading: false,
        }));
      }
    };
    fetchAllFeedbacks();
  }, [pagination?.current_page, pagination?.per_page]);

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

  const isFirstPage = pagination?.current_page === 1;
  const isLastPage = pagination?.current_page === pagination?.last_page;
  const isPaginationShown = !isFirstPage || !isLastPage;

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
              <TableLoader />
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
        <div className={`flex justify-between ${isLoading && "hidden"}`}>
          <div className="p-2 flex gap-1 items-center">
            <span className="text-gray-600 font-bold">Show: </span>
            <select
              className="select select-bordered w-full max-w-xs bg-gray-200"
              value={pagination?.per_page}
              onChange={(e) =>
                setPagination((pagination) => ({
                  ...pagination,
                  per_page: parseInt(e.target.value),
                }))
              }
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
              <option value="250">250</option>
              <option value="500">500</option>
            </select>
          </div>
          <div
            className={`join !bg-transparent !my-2 p-2 ${
              (isLoading || !isPaginationShown) && "hidden"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (pagination?.loading) return null;
                setPagination((pagination) => ({
                  ...pagination,
                  current_page: pagination?.current_page - 1,
                }));
              }}
              className="join-item btn !bg-gray-200 !border !border-gray-300"
              disabled={isFirstPage}
            >
              «
            </button>
            <button className="join-item btn !bg-gray-200 !border !border-gray-300">
              Page {pagination?.current_page} of {pagination?.last_page}
            </button>
            <button
              type="button"
              onClick={() => {
                if (pagination?.loading) return null;
                setPagination((pagination) => ({
                  ...pagination,
                  current_page: pagination?.current_page + 1,
                }));
              }}
              className="join-item btn !bg-gray-200 !border !border-gray-300"
              disabled={isLastPage}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default adminPage(Feedbacks);
