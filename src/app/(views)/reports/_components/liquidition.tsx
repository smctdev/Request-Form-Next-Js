import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Avatar from "@/assets/avatar.png";
import Image from "next/image";
import { Approver } from "@/types/approverTypes";
import { useAuth } from "@/context/AuthContext";
import Storage from "@/utils/storage";
import ZoomableImage from "@/components/ZoomableImage";
import ApprovedAttachments from "@/components/ApprovedAttachments";
import ApproverComments from "@/components/ApproverComments";
import RequestedByDetail from "@/components/requested-by-details";

type Props = {
  closeModal: () => void;
  record: Record;
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
  destination: string;
  branch_code?: {
    branch_code: string;
  };
  attachment: string;
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
  approvers: {
    noted_bies: { firstName: string; lastName: string }[];
    approved_bies: { firstName: string; lastName: string }[];
  };
  purpose: string;
  items: Item[];
  branch: string;
  date: string;
  grand_total: string;
  supplier: string;
  address: string;
  totalExpense: string;
  cashAdvance: string;
  short: string;
  name: string;
  signature: string;
  employeeID: string;
};

type Item = {
  liquidationDate: string;
  from: string;
  to: string;
  transportation: string;
  transportationAmount: string;
  hotel: string;
  hotelAddress: string;
  hotelAmount: string;
  perDiem: string;
  particulars: string;
  particularsAmount: string;
  grandTotal: string;
};
const tableStyle = "border-2 border-black p-2 ";
const inputStyle = "  border-2 border-black rounded-[12px] text-sm";
const input2Style = "  border-2 border-black rounded-[12px] text-sm";
const inputStyles =
  "  border-2 border-black rounded-[12px] text-end font-bold text-sm";
const tableCellStyle = "border-2 border-black  text-center p-2 text-sm";
const LiquiditionDetails: React.FC<Props> = ({ closeModal, record }) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
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
  // Get branch ID from record

  useEffect(() => {
    setNotedBy(editableRecord.noted_bies);
    setApprovedBy(editableRecord.approved_bies);
    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);
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

  const calculateTotalExpense = () => {
    return newData
      .reduce((total, item) => {
        return total + parseFloat(item.grandTotal || "0");
      }, 0)
      .toFixed(2);
  };

  const calculateShort = (totalExpense: number, cashAdvance: number) => {
    const short = cashAdvance - totalExpense;
    return short.toFixed(2);
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

  const formatDate2 = (dateString: string) => {
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
    };

    localStorage.setItem("printData", JSON.stringify(data));
    // Open a new window with PrintRefund component
    const newWindow = window.open(`/print/liquidation`, "_blank");

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
      <div className="relative z-10 w-full p-4 px-10 overflow-scroll bg-white border-black rounded-t-lg shadow-lg md:mx-0 md:w-1/2 lg:w-2/3 space-y-auto h-4/5">
        <div className="sticky flex justify-end cursor-pointer top-2">
          <XMarkIcon
            className="w-8 h-8 p-1 text-black bg-white rounded-full "
            onClick={closeModal}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full space-y-2">
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
                Liquidation of Actual Expense
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
          <div className="w-full mt-6 overflow-x-auto ">
            <div className="w-full border-collapse ">
              <div className="table-container">
                <table className="w-full border-2 border-black ">
                  <thead className="">
                    <tr>
                      <th className="border-2 border-black bg-[#8EC7F7]"></th>
                      <th
                        colSpan={4}
                        className="border-2 border-black bg-[#8EC7F7] py-2 text-center"
                      >
                        TRANSPORTATION
                      </th>
                      <th
                        colSpan={3}
                        className="border-2 border-black bg-[#8EC7F7] text-center"
                      >
                        HOTEL
                      </th>
                      <th
                        colSpan={3}
                        className="border-2 border-black bg-[#8EC7F7] whitespace-nowrap px-2 text-center"
                      >
                        PER DIEM OTHER RELATED EXPENSES
                      </th>
                      <th className="bg-[#8EC7F7]"></th>
                    </tr>
                    <tr>
                      <th>Date</th>

                      <th className={`${tableStyle}`}>From</th>
                      <th className={`${tableStyle}`}>To</th>
                      <th className={`${tableStyle}whitespace-nowrap`}>
                        Type of Transportation
                      </th>
                      <th className={`${tableStyle}`}>Amount</th>
                      <th className={`${tableStyle}`}>Name</th>
                      <th className={`${tableStyle}`}>Place</th>
                      <th className={`${tableStyle}`}>Amount</th>
                      <th className={`${tableStyle}whitespace-nowrap`}>
                        Per Diem
                      </th>
                      <th className={`${tableStyle}`}>Particulars</th>
                      <th className={`${tableStyle}`}>Amount</th>
                      <th className={`${tableStyle}whitespace-nowrap`}>
                        Grand Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${tableCellStyle}`}>
                    {editableRecord.form_data[0].items.map((item, index) => (
                      <tr key={index}>
                        <td className={tableCellStyle}>
                          {formatDate2(item.liquidationDate)}
                        </td>
                        <td className={tableCellStyle}>{item.from}</td>
                        <td className={`${tableCellStyle}`}>{item.to}</td>
                        <td className={tableCellStyle}>
                          {item.transportation}
                        </td>
                        <td className={tableCellStyle}>
                          {item.transportationAmount
                            ? parseFloat(item.transportationAmount).toFixed(2)
                            : ""}
                        </td>
                        <td className={tableCellStyle}>{item.hotel}</td>
                        <td className={tableCellStyle}>{item.hotelAddress}</td>
                        <td className={tableCellStyle}>
                          {item.hotelAmount &&
                          !isNaN(parseFloat(item.hotelAmount))
                            ? parseFloat(item.hotelAmount).toFixed(2)
                            : ""}
                        </td>
                        <td className={tableCellStyle}>
                          {item.perDiem && !isNaN(parseFloat(item.perDiem))
                            ? parseFloat(item.perDiem).toFixed(2)
                            : ""}
                        </td>
                        <td className={tableCellStyle}>
                          {item.particulars &&
                          !isNaN(parseFloat(item.particulars))
                            ? parseFloat(item.particulars).toFixed(2)
                            : ""}
                        </td>
                        <td className={tableCellStyle}>
                          {item.particularsAmount &&
                          !isNaN(parseFloat(item.particularsAmount))
                            ? parseFloat(item.particularsAmount).toFixed(2)
                            : ""}
                        </td>
                        <td className={tableCellStyle}>
                          {item.grandTotal &&
                          !isNaN(parseFloat(item.grandTotal))
                            ? parseFloat(item.grandTotal).toFixed(2)
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 lg:grid-cols-2 md:gap-2">
            <div>
              <table className="w-full mt-10 border border-black">
                <tbody>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="pl-2 pr-20 font-semibold ">TOTAL EXPENSE</p>
                    </td>
                    <td className={`${inputStyles} font-bold`}>
                      {parseFloat(
                        editableRecord.form_data[0].totalExpense
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="pl-2 pr-20 font-semibold ">CASH ADVANCE</p>
                    </td>
                    <td className={`${inputStyle} font-bold text-right`}>
                      {parseFloat(
                        editableRecord.form_data[0].cashAdvance
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="pl-2 font-semibold ">SHORT</p>
                    </td>
                    <td className={`${inputStyles} font-bold`}>
                      ₱
                      {parseFloat(editableRecord.form_data[0].short).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full mt-10 mb-10 border border-black">
                <tbody>
                  <tr>
                    <td className={`${input2Style} `}>
                      <p className="pl-2 pr-20 font-semibold ">
                        NAME OF EMPLOYEE
                      </p>
                    </td>
                    <td className={`${tableStyle} font-bold`}>
                      {record.form_data[0].name}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${input2Style} h-20 `}>
                      <p className="pl-2 font-semibold ">SIGNATURE</p>
                    </td>
                    <td className={`${tableStyle} h-10`}>
                      <div className="flex items-center justify-center overflow-hidden">
                        <div className="relative">
                          <Image
                            width={100}
                            height={100}
                            src={Storage(record.form_data[0].signature)}
                            alt="signature"
                            draggable="false"
                            className="h-24"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ filter: "blur(1px)" }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                              className="text-gray-950 opacity-30"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 255, 255, 0.3) 20px, rgba(255, 255, 255, 0.3) 100px)",
                                backgroundSize: "400px 400px",
                                width: "100%",
                                height: "100%",
                                fontSize: "1.2em",
                                transform: "rotate(-12deg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              SMCT Group of Companies SMCT Group of Companies{" "}
                              <br />
                              SMCT Group of Companies SMCT Group of Companies{" "}
                              <br />
                              SMCT Group of Companies SMCT Group of Companies{" "}
                              <br />
                              SMCT Group of Companies SMCT Group of Companies{" "}
                              <br />
                              SMCT Group of Companies SMCT Group of Companies{" "}
                              <br /> SMCT Group of Companies SMCT Group of
                              Companies
                              <br />
                              SMCT Group of Companies SMCT Group of Companies
                              <br /> SMCT Group of Companies SMCT Group of
                              Companies
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className={`${input2Style} `}>
                      <p className="pl-2 font-semibold">EMPLOYEE NO.</p>
                    </td>
                    <td className={`${tableStyle}`}>
                      {record.form_data[0].employeeID}
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default LiquiditionDetails;
