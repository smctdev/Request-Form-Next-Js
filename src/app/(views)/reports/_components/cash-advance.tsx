import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Avatar from "@/assets/avatar.png";
import Image from "next/image";
import { Approver } from "@/types/approverTypes";
import { useAuth } from "@/context/AuthContext";
import formattedDate from "@/utils/formattedDate";
import formattedAmount from "@/utils/formattedAmount";
import Storage from "@/utils/storage";
import ZoomableImage from "@/components/ZoomableImage";
import ApprovedAttachments from "@/components/ApprovedAttachments";
import ApproverComments from "@/components/ApproverComments";
import RequestedByDetail from "@/components/requested-by-details";

type Props = {
  closeModal: () => void;
  record: any;
};

type Record = {
  id: number;
  request_code: string;
  created_at: Date;
  status: string;
  approvers_id: number;
  form_data: FormData[];
  supplier?: string;
  address?: string;
  branch: string;
  date: string;
  user_id: number;
  approval_process: any;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    signature: string;
    status: string;
    branch_code: {
      branch_code: string;
    };
  };
  attachment: string;
  branch_code?: {
    branch_code: string;
  };
  noted_bies: {
    id: number;
    firstName: string;
    lastName: string;
    comment: string;
    position: string;
    signature: string;
    status: string;
  }[];
  approved_bies: {
    id: number;
    firstName: string;
    lastName: string;
    comment: string;
    position: string;
    signature: string;
    status: string;
  }[];
};

type FormData = {
  approvers_id: number;
  attachment: string;
  purpose: string;
  reason: string;
  liquidationDate: string;
  items: Item[];
  branch: string;
  date: string;
  grand_total: string;
  supplier: string;
  address: string;
  totalBoatFare: string;
  totalContingency: string;
  totalFare: string;
  totalHotel: string;
  totalperDiem: string;
  totalExpense: string;
  short: string;
};

// Define the Item type
type Item = {
  cashDate: string;
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
  day: string;
  from: string;
  to: string;
  activity: string;
  hotel: string;
  rate: string;
  amount: string;
  perDiem: string;
};

const headerStyle = "border border-black bg-[#8EC7F7] w-2/12 text-sm p-2";
const inputStyle = "border border-black text-[12px] font-bold text-end";
const tableStyle = "border border-black px-1";
const tableCellStyle = `${inputStyle} py-2 px-1 w-10 wrap-text  break-words`;
const CashAdvanceDetails: React.FC<Props> = ({ closeModal, record }) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
  const [newTotalBoatFare, setNewTotalBoatFare] = useState("");
  const [newTotalFare, setNewTotalFare] = useState("");
  const [newTotalContingency, setNewTotalContingency] = useState("");
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const hasDisapprovedInNotedBy = notedBy.some(
    (user) => user.status === "Disapproved"
  );
  const hasDisapprovedInApprovedBy = approvedBy.some(
    (user) => user.status === "Disapproved"
  );
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setNotedBy(editableRecord.noted_bies);
    setApprovedBy(editableRecord.approved_bies);
    setNewData(record.form_data[0].items.map((item: any) => ({ ...item })));
    setEditableRecord(record);
    setNewTotalBoatFare(record.form_data[0].totalBoatFare);
    setNewTotalFare(record.form_data[0].totalFare);
    setNewTotalContingency(record.form_data[0].totalContingency);
    try {
      if (typeof record.attachment === "string") {
        // Parse the JSON string if it contains the file path
        const parsedAttachment: string[] = JSON.parse(record.attachment);

        if (parsedAttachment.length > 0) {
          // Construct file URLs
          const fileUrls = parsedAttachment.map(
            (filePath) =>
              `${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${filePath.replace(
                /\\/g,
                "/"
              )}`
          );
          setAttachmentUrl(fileUrls);
        }
      }
    } catch (error) {
      console.error("Error parsing attachment:", error);
    }
  }, [record]);

  const calculateGrandTotal = () => {
    let total = 0;
    total += parseFloat(newTotalBoatFare);
    // total += parseFloat(newTotalHotel);
    total += newData.reduce(
      (totalHotelRate, item) => totalHotelRate + Number(item.rate),
      0
    );
    total += parseFloat(newTotalFare);
    total += parseFloat(newTotalContingency);
    total += newData.reduce(
      (totalPerDiem, item) => totalPerDiem + Number(item.perDiem),
      0
    );
    return parseFloat(total.toString()).toFixed(2);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (!record) return null;

  const handlePrint = () => {
    // Construct the data object to be passed
    const data = {
      id: record,
      approvedBy: approvedBy,
      notedBy: notedBy,
      user: user,
      department: record?.form_data[0]?.department,
      reason: record?.form_data[0]?.reason,
      position: record?.requested_position,
      liquidationDate: record?.form_data[0]?.liquidationDate,
    };

    localStorage.setItem("printData", JSON.stringify(data));
    // Open a new window with PrintRefund component
    const newWindow = window.open(`/print/cash`, "_blank");

    // Optional: Focus the new window
    if (newWindow) {
      newWindow.focus();
    }
  };

  const isImageFile = (fileUrl: any) => {
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"];
    const extension = fileUrl.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  const handleViewImage = (imageUrl: any) => {
    setCurrentImage(imageUrl);
    setIsImgModalOpen(true);
  };

  const closeImgModal = () => {
    setIsImgModalOpen(false);
    setCurrentImage(null);
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
      <div className="relative z-10 w-full p-4 mx-10 overflow-scroll bg-white border-black shadow-lg md:mx-0 md:w-11/12 lg:w-11/12 space-y-auto h-4/5">
        <div className="sticky flex justify-end cursor-pointer top-2">
          <XMarkIcon
            className="w-8 h-8 p-1 text-black bg-white rounded-full "
            onClick={closeModal}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full space-y-4">
          <button
            type="button"
            className="p-1 px-2 text-white bg-blue-600 rounded-md cursor-pointer"
            onClick={handlePrint}
          >
            Print
          </button>
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="font-semibold text-[18px]">
                Application for Cash Advance
              </h1>
            </div>
            <div className="flex w-auto ">
              <p>Date: </p>
              <p className="pl-1 font-bold">
                {formatDate(editableRecord.created_at)}
              </p>
            </div>
          </div>

          <p className="font-medium text-[14px]">
            Request ID: {record.request_code}
          </p>
          <div className="flex items-center w-full md:w-1/2">
            <p>Status:</p>
            <p
              className={`${
                record.status.trim() === "Pending"
                  ? "bg-yellow-400"
                  : record.status.trim() === "Approved"
                  ? "bg-green-400"
                  : record.status.trim() === "Disapproved"
                  ? "bg-pink-400"
                  : record.status.trim() === "Ongoing"
                  ? "bg-primary"
                  : "bg-blue-700"
              } rounded-lg  py-1 w-1/3
             font-medium text-[14px] text-center ml-2 text-white`}
            >
              {" "}
              {record.status}
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
            <div className="flex w-1/2 ">
              <h1 className="flex items-center">Branch: </h1>
              <p className="w-full pl-1 font-bold bg-white rounded-md ">
                {record?.branch_code?.branch_code}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-sm font-medium">Reason for Cash Advance:</h1>
            <span className="pl-1 font-bold bg-white rounded-md">
              {record?.form_data[0]?.reason}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-sm font-medium">Liquidation Date:</h1>
            <span className="pl-1 font-bold bg-white rounded-md">
              {record?.form_data[0]?.liquidationDate}
            </span>
          </div>

          <div className="flex">
            <div className="mr-5 w-10/12">
              <div className="w-full overflow-x-auto">
                <div className="w-full border-collapse">
                  <table className="w-full border border-collapse border-black lg:overflow-auto xl:table-fixed">
                    <thead>
                      <tr>
                        <th className="border border-black bg-[#8EC7F7]"></th>
                        <th className="border border-black bg-[#8EC7F7]"></th>
                        <th
                          colSpan={2}
                          className="text-center text-sm bg-[#8EC7F7]"
                        >
                          Itinerary
                        </th>
                        <th className="border border-black bg-[#8EC7F7]"></th>
                        <th
                          colSpan={2}
                          className="text-center text-sm bg-[#8EC7F7]"
                        >
                          Hotel
                        </th>
                        <th className="border border-black bg-[#8EC7F7]"></th>
                        <th className="border border-black bg-[#8EC7F7]"></th>
                      </tr>
                      <tr>
                        <th className={`${headerStyle}`}>Date</th>
                        <th className={`${headerStyle}`}>Day</th>
                        <th className={`${headerStyle}`}>From</th>
                        <th className={`${headerStyle}`}>To</th>
                        <th className={`${headerStyle}`}>Activity</th>
                        <th className={`${headerStyle}`}>Name</th>
                        <th className={`${headerStyle}`}>Rate</th>
                        <th className={`${headerStyle}`}>Per Diem</th>
                        <th className={`${headerStyle}`}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableRecord.form_data[0].items.map(
                        (item: any, index: any) => (
                          <tr key={index}>
                            <td className={tableCellStyle}>
                              {formattedDate(item.cashDate)}
                            </td>
                            <td className={tableCellStyle}>{item.day}</td>
                            <td className={tableCellStyle}>{item.from}</td>
                            <td className={tableCellStyle}>{item.to}</td>
                            <td className={tableCellStyle}>{item.activity}</td>
                            <td className={tableCellStyle}>{item.hotel}</td>
                            <td className={tableCellStyle}>
                              {formattedAmount(item.rate)}
                            </td>
                            <td className={tableCellStyle}>
                              {formattedAmount(item.perDiem)}
                            </td>
                            <td className={tableCellStyle}>{item.remarks}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-block w-full">
                <table className="border border-black h-fit">
                  <thead>
                    <tr>
                      <th colSpan={2} className="bg-[#8EC7F7]">
                        <p className="font-semibold text-[12px]">
                          SUMMARY OF EXPENSES TO BE INCURRED (for C/A)
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`${tableStyle}`}>
                        <p className="text-sm font-semibold">BOAT FARE</p>
                      </td>
                      <td className={`${inputStyle}`}>
                        {formattedAmount(
                          editableRecord.form_data[0].totalBoatFare
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className={`${tableStyle}`}>
                        <p className="text-sm font-semibold">HOTEL</p>
                      </td>
                      <td className={`${inputStyle}`}>
                        {formattedAmount(
                          newData.reduce(
                            (totalHotelRate, item) =>
                              totalHotelRate + Number(item.rate),
                            0
                          )
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className={`${tableStyle} `}>
                        <p className="text-sm font-semibold">PER DIEM</p>
                      </td>
                      <td className={`${inputStyle}`}>
                        {/* Display calculated total per diem */}
                        {formattedAmount(
                          newData.reduce(
                            (totalPerDiem, item) =>
                              totalPerDiem + Number(item.perDiem),
                            0
                          )
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className={`${tableStyle}`}>
                        <p className="text-sm font-semibold">FARE</p>
                      </td>
                      <td className={`${inputStyle}`}>
                        {formattedAmount(editableRecord.form_data[0].totalFare)}
                      </td>
                    </tr>
                    <tr>
                      <td className={`${tableStyle}`}>
                        <p className="text-sm font-semibold">CONTINGENCY</p>
                      </td>
                      <td className={`${inputStyle}`}>
                        {formattedAmount(
                          editableRecord.form_data[0].totalContingency
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className={`${tableStyle} py-1`}></td>
                      <td className={`${tableStyle}`}></td>
                    </tr>
                    <tr>
                      <td className={`${tableStyle} font-bold text-sm`}>
                        TOTAL
                      </td>
                      <td
                        className={`${tableStyle} whitespace-nowrap text-end font-bold`}
                      >
                        {formattedAmount(
                          editableRecord.form_data[0].grand_total
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex-col items-center justify-center w-full">
            {
              <div className="flex flex-wrap">
                <RequestedByDetail record={record} />
                {notedBy.length > 0 && (
                  <div className="mb-4 ml-5">
                    <h3 className="mb-3 font-bold">Noted By:</h3>
                    <ul className="flex flex-wrap gap-6">
                      {notedBy.map((user, index) => (
                        <li
                          className="relative flex flex-col items-center justify-center text-center"
                          key={index}
                        >
                          <div className="relative flex flex-col items-center justify-center text-center">
                            {/* Signature */}
                            {(user.status === "Approved" ||
                              (typeof user.status === "string" &&
                                user.status.split(" ")[0] === "Rejected")) && (
                              <div className="absolute -top-4">
                                <Image
                                  src={Storage(user?.signature || "")}
                                  alt="avatar"
                                  width={120}
                                  height={120}
                                  className="relative z-20 pointer-events-none"
                                  draggable="false"
                                  onContextMenu={(e) => e.preventDefault()}
                                  style={{ filter: "blur(1px)" }} // Optional: Apply a blur
                                />
                              </div>
                            )}
                            {/* Name */}
                            <p className="relative z-10 inline-block mt-4 font-medium text-center uppercase">
                              <span className="relative z-10">
                                {user.firstName} {user.lastName}
                              </span>
                              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                            </p>
                            {/* Position */}
                            <p className="font-bold text-[12px] text-center mt-1">
                              {user.position}
                            </p>
                            {/* Status */}
                            {hasDisapprovedInApprovedBy ||
                            hasDisapprovedInNotedBy ? (
                              user.status === "Disapproved" ? (
                                <p className="font-bold text-[12px] text-center text-red-500 mt-1">
                                  {user.status}
                                </p>
                              ) : null
                            ) : (
                              <p
                                className={`font-bold text-[12px] text-center mt-1 ${
                                  user.status === "Approved"
                                    ? "text-green-400"
                                    : user.status === "Pending" || !user.status
                                    ? "text-yellow-400"
                                    : ""
                                }`}
                              >
                                {user.status ? user.status : "Pending"}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-4 ml-5">
                  <h3 className="mb-3 font-bold">Approved By:</h3>
                  <ul className="flex flex-wrap gap-6">
                    {approvedBy.map((user, index) => (
                      <li
                        className="relative flex flex-col items-center justify-center text-center"
                        key={index}
                      >
                        <div className="relative flex flex-col items-center justify-center text-center">
                          {/* Signature */}
                          {(user.status === "Approved" ||
                            (typeof user.status === "string" &&
                              user.status.split(" ")[0] === "Rejected")) && (
                            <div className="absolute -top-4">
                              <Image
                                src={Storage(user.signature || "")}
                                alt="avatar"
                                width={120}
                                height={120}
                                className="relative z-20 pointer-events-none"
                                draggable="false"
                                onContextMenu={(e) => e.preventDefault()}
                                style={{ filter: "blur(1px)" }} // Optional: Apply a blur
                              />
                            </div>
                          )}
                          {/* Name */}
                          <p className="relative z-10 inline-block mt-4 font-medium text-center uppercase">
                            <span className="relative z-10">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                          </p>
                          {/* Position */}
                          <p className="font-bold text-[12px] text-center mt-1">
                            {user.position}
                          </p>
                          {/* Status */}
                          {hasDisapprovedInApprovedBy ||
                          hasDisapprovedInNotedBy ? (
                            user.status === "Disapproved" ? (
                              <p className="font-bold text-[12px] text-center text-red-500 mt-1">
                                {user.status}
                              </p>
                            ) : null
                          ) : (
                            <p
                              className={`font-bold text-[12px] text-center mt-1 ${
                                user.status === "Approved"
                                  ? "text-green-400"
                                  : user.status === "Pending" || !user.status
                                  ? "text-yellow-400"
                                  : ""
                              }`}
                            >
                              {user.status ? user.status : "Pending"}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            }
          </div>
          <div className="w-full">
            <div className="max-w-[500px] overflow-x-auto pb-3">
              <div className="flex gap-1">
                {attachmentUrl.map((fileItem, index) => (
                  <div
                    key={fileItem}
                    className="relative w-24 p-2 bg-white rounded-lg shadow-md"
                  >
                    <div className="relative w-20">
                      {isImageFile(fileItem) ? (
                        // Display image preview if file is an image
                        <>
                          <Image
                            width={100}
                            height={100}
                            src={fileItem}
                            alt="attachment"
                            className="object-cover w-full h-20 rounded-md"
                          />

                          <button
                            type="button"
                            onClick={() => handleViewImage(fileItem)}
                            className="px-3 py-1 mt-2 text-xs text-center w-full text-white rounded-lg bg-primary cursor-pointer"
                          >
                            View
                          </button>
                        </>
                      ) : (
                        // Display document icon if file is not an image
                        <>
                          <div className="flex items-center justify-center w-full h-20 bg-gray-100 rounded-md">
                            <Image
                              width={100}
                              height={100}
                              src="https://cdn-icons-png.flaticon.com/512/3396/3396255.png"
                              alt=""
                            />
                          </div>
                          <div className="mt-2">
                            <a
                              href={fileItem}
                              download
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1 text-xs text-white rounded-lg bg-primary"
                            >
                              Download
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {isImgModalOpen && (
                <ZoomableImage
                  closeImgModal={closeImgModal}
                  currentImage={currentImage}
                />
              )}
            </div>
          </div>

          <ApproverComments record={record} />
          <ApprovedAttachments
            record={record}
            handleViewImage={handleViewImage}
          />
        </div>
      </div>
    </div>
  );
};

export default CashAdvanceDetails;
