"use client";

import adminPage from "@/lib/adminPage";
import { useEffect } from "react";
import TableData from "../_components/request-access/TableData";
import TableLoader from "../_components/loaders/TableLoader";
import echo from "@/hooks/echo";
import { useAuth } from "@/context/AuthContext";
import { FaMagnifyingGlass } from "react-icons/fa6";
import useFetch from "../_hooks/useFetch";
import Pagination from "../_components/ui/Pagination";

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
      echo.leaveChannel(`private-request-access.${user.id}`);
    };
  }, [echo, user.id, searchTerm]);

  const tableHead = [
    "ID/Code",
    "Type",
    "Employee Name",
    "Message",
    "Status",
    "Date Submitted",
    "Action",
  ];

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
              <TableLoader colSpan={7} />
            ) : requestAccess.length > 0 ? (
              requestAccess?.map((item: any, index: number) => (
                <TableData
                  key={index}
                  item={item}
                  setIsRefresh={setIsRefresh}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-5 font-bold">
                  No request access found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}

export default adminPage(RequestAccess);
