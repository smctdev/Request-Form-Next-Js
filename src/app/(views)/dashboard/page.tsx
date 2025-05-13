"use client";

import React, { useState, useEffect } from "react";
import Man from "../../../../public/assets/manComputer.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faRotate,
  faFileLines,
  faFileCircleXmark,
  faFileCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Request } from "@/types/dashboardTypes";
import { api } from "@/lib/api";
import Image from "next/image";
import authenticatedPage from "@/lib/authenticatedPage";

const boxWhite =
  "bg-white w-full h-[190px] rounded-[15px] drop-shadow-lg relative";
const boxPink = "w-full h-[150px] rounded-t-[12px] relative";
const outerLogo =
  "lg:w-[120px] lg:h-[125px] w-[80px] h-[90px] right-0 mr-[56px] lg:mt-[26px] mt-[56px] absolute !text-[120px]";
const innerBox =
  "lg:w-[82px] lg:h-[84px] w-[57px] h-[58px] bg-white absolute right-0 mr-[29px] lg:mt-[37px] md:mt-[47px] mt-[47px] rounded-[12px] flex justify-center items-center";
const innerLogo =
  "lg:w-[48px] lg:h-[51px] w-[40px] h-[45px] flex justify-center items-center !text-[50px]";

const Dashboard: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRequestsSent, setTotalRequestsSent] = useState<number | null>(
    null
  );
  const [totalOngoingRequests, setTotalOngoingRequests] = useState<
    number | null
  >(null);
  const [totalCompletedRequests, setTotalCompletedRequests] = useState<
    number | null
  >(null);
  const [totalPendingRequests, setTotalPendingRequests] = useState<
    number | null
  >(null);
  const [totalDisapprovedRequests, setTotalDisapprovedRequests] = useState<
    number | null
  >(null);

  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchMap, setBranchMap] = useState<Map<number, string>>(new Map());
  const [dataLoading, setDataLoading] = useState(true);
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await api.get("/view-branch");
        const branches = response.data.data;

        // Create a mapping of id to branch_code
        const branchMapping = new Map<number, string>(
          branches.map((branch: { id: number; branch_code: string }) => [
            branch.id,
            branch.branch_code,
          ])
        );

        setBranchList(branches);
        setBranchMap(branchMapping);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    fetchBranchData();
  }, []);

  const NoDataComponent = () => (
    <div className="flex items-center justify-center h-64 overflow-hidden text-gray-500">
      <p className="text-lg">No records found</p>
    </div>
  );
  const LoadingSpinner = () => (
    <table className="table" style={{ background: "white" }}>
      <thead>
        <tr>
          <th className="py-6" style={{ color: "black", fontWeight: "bold" }}>
            Request ID
          </th>
          <th style={{ color: "black", fontWeight: "bold" }}>Request Type</th>
          <th style={{ color: "black", fontWeight: "bold" }}>Date</th>
          <th style={{ color: "black", fontWeight: "bold" }}>Branch</th>
          <th style={{ color: "black", fontWeight: "bold" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, index) => (
          <tr key={index}>
            <td className="w-full border border-gray-200" colSpan={5}>
              <div className="flex justify-center">
                <div className="flex flex-col w-full gap-4">
                  <div className="w-full h-12 skeleton bg-slate-300"></div>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  useEffect(() => {
    if (user.id) {
      setLoading(true);
      // Fetch requests data
      api
        .get("/view-request")
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            setRequests(response.data.data);
            setLoading(false);
          } else {
            console.error("Unexpected data format:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching requests data:", error);
          setLoading(false);
        })
        .finally(() => {
          setDataLoading(false);
        });

      // Fetch total requests sent

      api
        .get(`/total-request-sent/${user.id}`)
        .then((response) => {
          setTotalRequestsSent(response.data.totalRequestSent);
          setTotalCompletedRequests(response.data.totalCompletedRequest);
          setTotalPendingRequests(response.data.totalPendingRequest);
          setTotalOngoingRequests(response.data.totalOngoingRequest);
          setTotalDisapprovedRequests(response.data.totalDisapprovedRequest);
        })
        .catch((error) => {
          console.error("Error fetching total requests sent:", error);
        })
        .finally(() => {
          setDataLoading(false);
        });
    }
  }, [user.id]);

  const sortedRequests = requests.sort((a, b) => b.id - a.id);

  // Take the first 5 requests
  const latestRequests = sortedRequests.slice(0, 5);

  const columns = [
    {
      name: "Request ID",
      selector: (row: Request) => row.request_code,
      width: "160px",
      sortable: true,
    },

    {
      name: "Request Type",
      selector: (row: Request) => row.form_type,
      width: "300px",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Request) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row: Request) => {
        // Ensure form_data exists and has at least one item with a branch field
        if (
          row.form_data &&
          row.form_data.length > 0 &&
          row.form_data[0].branch
        ) {
          const branchId = parseInt(row.form_data[0].branch, 10);
          return branchMap.get(branchId) || "Unknown";
        }
        return "Unknown"; // Return "Unknown" if branch is unavailable
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Request) => row.status.trim(),
      sortable: true,
      cell: (row: Request) => (
        <div
          className={`${
            row.status.trim() === "Pending"
              ? "bg-yellow-400"
              : row.status.trim() === "Approved"
              ? "bg-green-400"
              : row.status.trim() === "Disapproved"
              ? "bg-pink-400"
              : row.status.trim() === "Ongoing"
              ? "bg-primary"
              : "bg-blue-700"
          } rounded-lg py-1 w-full md:w-full xl:w-3/4 2xl:w-2/4 text-center text-white`}
        >
          {row.status.trim()}
        </div>
      ),
    },
  ];
  return (
    <div className="bg-gray-100 h-screen pt-[26px] px-[35px]">
      <div className="bg-primary w-full sm:w-full h-[210px] rounded-[12px] pl-[30px] flex flex-row justify-between items-center">
        <div>
          <p className="!text-[15px] lg:!text-[20px] !font-bold">
            Hi, {isLoading ? "Loading..." : user.firstName} 👋
          </p>
          <p className="!text-[15px] lg:!text-[20px] text-white font-semibold">
            Welcome to Request
          </p>
          <p className="!text-[15px] hidden sm:block text-white mb-4">
            Request products and services
          </p>
          {isAdmin ||
            (!isLoading && (
              <div>
                <Link href="/create-request/stock-requisition">
                  <button className="bg-[#FF947D] !text-[15px] w-full lg:h-[57px] h-[40px] rounded-[12px] font-semibold cursor-pointer">
                    Create a Request
                  </button>
                </Link>
              </div>
            ))}
        </div>
        <div className="ml-4 mr-[29px]">
          <Image alt="man" src={Man} width={320} height={176} />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-8 mt-4 space-y-2 sm:w-full md:grid-cols-2 lg:grid-cols-5 md:space-y-0">
        <div className={`${boxWhite} hover:-translate-y-1`}>
          <div className={`${boxPink} bg-primary`}>
            <FontAwesomeIcon
              icon={faFileLines}
              className={`${outerLogo} text-[#298DDE] max-h-[78%]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faFileLines}
                className={`${innerLogo} text-primary`}
              />
            </div>
            <p className="!text-[16px] font-semibold mt-[10px] ml-[17px] absolute">
              Total Requests
            </p>
            <p className="!text-[40px] font-bold bottom-6 mx-5 absolute">
              {dataLoading ? (
                <span className="my-4 custom-loader bottom-6"></span>
              ) : (
                totalRequestsSent
              )}
            </p>
          </div>
        </div>
        <div className={`${boxWhite} hover:-translate-y-1`}>
          <div className={`${boxPink} bg-[#4abffd]`}>
            <FontAwesomeIcon
              icon={faFileCircleCheck}
              className={`${outerLogo} text-[#2a8bbf]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faFileCircleCheck}
                className={`${innerLogo} text-[#2ea7e8]`}
              />
            </div>
            <p className="!text-[16px] font-semibold mt-[10px] ml-[17px] absolute">
              Completed Requests
            </p>
            <p className="!text-[40px] font-bold bottom-6 mx-5 absolute">
              {dataLoading ? (
                <span className="my-4 custom-loader bottom-6"></span>
              ) : (
                totalCompletedRequests
              )}
            </p>
          </div>
        </div>
        <div className={`${boxWhite} hover:-translate-y-1`}>
          <div className={`${boxPink} bg-[#32bfd5]`}>
            <FontAwesomeIcon
              icon={faRotate}
              className={`${outerLogo} text-[#368a96]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faRotate}
                className={`${innerLogo} text-[#2da6b9]`}
              />
            </div>
            <p className="!text-[16px] font-semibold mt-[10px] ml-[17px] absolute">
              Ongoing Requests
            </p>
            <p className="!text-[40px] font-bold bottom-6 mx-5 absolute">
              {dataLoading ? (
                <span className="my-4 custom-loader bottom-6"></span>
              ) : (
                totalOngoingRequests
              )}
            </p>
          </div>
        </div>
        <div className={`${boxWhite} hover:-translate-y-1`}>
          <div className={`${boxPink} bg-secondary`}>
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className={`${outerLogo} text-[#D88A1B]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                className={`${innerLogo} text-secondary`}
              />
            </div>
            <p className="!text-[16px] font-semibold mt-[10px] ml-[17px] absolute">
              Pending Requests
            </p>
            <p className="!text-[40px] font-bold bottom-6 mx-5 absolute">
              {dataLoading ? (
                <span className="my-4 custom-loader bottom-6"></span>
              ) : (
                totalPendingRequests
              )}
            </p>
          </div>
        </div>
        <div className={`${boxWhite} hover:-translate-y-1`}>
          <div className={`${boxPink} bg-accent`}>
            <FontAwesomeIcon
              icon={faFileCircleXmark}
              className={`${outerLogo} text-[#C22158]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faFileCircleXmark}
                className={`${innerLogo} text-accent`}
              />
            </div>
            <p className="!text-[16px] font-semibold mt-[10px] ml-[17px] absolute">
              Unsuccessful Requests
            </p>
            <p className="!text-[40px] font-bold bottom-6 mx-5 absolute">
              {dataLoading ? (
                <span className="my-4 custom-loader bottom-6"></span>
              ) : (
                totalDisapprovedRequests
              )}
            </p>
          </div>
        </div>
      </div>
      <div
        className={`mt-[20px] mb-10 bg-white w-full h-full data-table-container drop-shadow-lg rounded-[12px] relative sm:w-full ${
          latestRequests.length === 0 ? "overflow-hidden" : "overflow-x-auto"
        }`}
      >
        <h1 className="py-[16px] px-[25px] font-bold !text-[20px]">
          Recent requests
        </h1>
        <p className="flex justify-end px-[25px] -mt-10 mb-1">
          <button type="button" className="cursor-pointer" onClick={() => router.push("/request")}>
            <span className="bg-primary px-3 py-1 rounded-[12px] text-white">
              See all
            </span>
          </button>
        </p>
        <div>
          <DataTable
            className="data-table"
            columns={columns}
            data={latestRequests}
            noDataComponent={<NoDataComponent />}
            progressPending={loading}
            progressComponent={<LoadingSpinner />}
            pagination
          />
        </div>
      </div>
    </div>
  );
};

export default authenticatedPage(Dashboard);
