import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Avatar from "@/assets/avatar.png";
import { Approver } from "@/types/approverTypes";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Storage from "@/utils/storage";
import ZoomableImage from "@/components/ZoomableImage";
import ApprovedAttachments from "@/components/ApprovedAttachments";
import formattedAmount from "@/utils/formattedAmount";

type Props = {
  closeModal: () => void;
  record: Record;
};

type Record = {
  created_at: Date;
  id: number;
  request_code: string;
  status: string;
  approvers_id: number;
  form_data: FormData[];
  branch: string;
  date: string;
  user_id: number;
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
  branch_code?: {
    branch_code: string;
  };
  requested_by: string;
  requested_signature: string;
  requested_position: string;
  completed_status: string;
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
};

type Item = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
};

const inputStyle = "border border-black text-[12px] font-bold p-2";
const tableCellStyle = `${inputStyle} w-20 text-end`;
const RefundRequestDetails: React.FC<Props> = ({ closeModal, record }) => {
  const [editableRecord, setEditableRecord] = useState(record);
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
    };

    localStorage.setItem("printData", JSON.stringify(data));
    // Open a new window with PrintRefund component
    const newWindow = window.open(`/print/refund`, "_blank");

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
      <div className="relative z-10 w-full p-4 mx-10 overflow-scroll bg-white border-black rounded-t-lg shadow-lg md:mx-0 md:w-1/2 space-y-auto h-3/4">
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
              <h1 className="font-semibold text-[18px]">Refund Request</h1>
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
          <div className="w-full mt-4 overflow-x-auto">
            <div className="w-full border-collapse">
              <div className="table-container">
                <table className="w-full border table-auto lg:table-fixed">
                  <thead className="border border-black h-14 bg-[#8EC7F7]">
                    <tr className="border text-[10px]">
                      <th className={`${inputStyle}`}>QTY</th>
                      <th
                        className={`${inputStyle} break-words whitespace-normal`}
                      >
                        DESCRIPTION
                      </th>
                      <th className={`${inputStyle}whitespace-nowrap`}>
                        UNIT COST
                      </th>
                      <th className={`${inputStyle}whitespace-nowrap`}>
                        TOTAL AMOUNT
                      </th>
                      <th
                        className={`${inputStyle}break-words whitespace-nowrap `}
                      >
                        USAGE/REMARKS
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${tableCellStyle}`}>
                    {editableRecord.form_data[0].items.map((item, index) => (
                      <tr key={index}>
                        <td className={`${tableCellStyle} text-center`}>
                          {item.quantity}
                        </td>
                        <td
                          className={`${tableCellStyle} break-words whitespace-normal`}
                        >
                          {item.description}
                        </td>
                        <td className={`${tableCellStyle} text-center`}>
                          {formattedAmount(item.unitCost)}
                        </td>
                        <td className={`${tableCellStyle} text-center`}>
                          {formattedAmount(item.totalAmount)}
                        </td>
                        <td
                          className={`${tableCellStyle} break-words whitespace-normal`}
                        >
                          {item.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-full">
            <h1>Grand Total</h1>
            <input
              type="text"
              className="w-full p-1 mt-2 font-bold bg-white border border-black rounded-md "
              value={formattedAmount(editableRecord.form_data[0].grand_total)}
              readOnly
            />
          </div>
          <div className="flex-col items-center justify-center w-full">
            <div className="flex flex-wrap">
              <div className="mb-4 ml-5">
                <h3 className="mb-3 font-bold">Requested By:</h3>
                <ul className="flex flex-wrap gap-6">
                  <li className="relative flex flex-col items-center justify-center w-auto text-center">
                    <div className="relative flex flex-col items-center justify-center">
                      {/* Signature */}
                      {record?.requested_signature && (
                        <div className="absolute -top-4">
                          <Image
                            src={Storage(record?.requested_signature || "")}
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
                          {record?.requested_by}
                        </span>
                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                      </p>
                      {/* Position */}
                      <p className="font-bold text-[12px] text-center mt-1">
                        {record?.requested_position}
                      </p>
                      {/* Status, if needed */}
                      {user.status && (
                        <p
                          className={`font-bold text-[12px] text-center mt-1 ${
                            user.status === "Approved"
                              ? "text-green-400"
                              : user.status === "Pending"
                              ? "text-yellow-400"
                              : user.status === "Rejected"
                              ? "text-red"
                              : ""
                          }`}
                        >
                          {user.status}
                        </p>
                      )}
                    </div>
                  </li>
                </ul>
              </div>

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

          <div className="w-full">
            <h2 className="mb-2 text-lg font-bold">Comments:</h2>

            {/* Check if there are no comments in both notedBy and approvedBy */}
            {notedBy.filter((user) => user.comment).length === 0 &&
            approvedBy.filter((user) => user.comment).length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              <>
                {/* Render Noted By comments */}
                <ul className="flex flex-col w-full mb-4 space-y-4">
                  {notedBy
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex" key={index}>
                        <div>
                          <Image
                            alt="avatar"
                            className="hidden cursor-pointer sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ filter: "blur(1px)" }} // Optional: Apply a blur
                          />
                        </div>
                        <div className="flex flex-row w-full">
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="text-lg font-bold">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}
                </ul>

                {/* Render Approved By comments */}
                <ul className="flex flex-col w-full mb-4 space-y-4">
                  {approvedBy
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex" key={index}>
                        <div>
                          <Image
                            alt="avatar"
                            className="hidden cursor-pointer sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ filter: "blur(1px)" }} // Optional: Apply a blur
                          />
                        </div>
                        <div className="flex flex-row w-full">
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="text-lg font-bold">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}
                </ul>
              </>
            )}
          </div>

          <ApprovedAttachments
            record={record}
            handleViewImage={handleViewImage}
          />
        </div>
      </div>
    </div>
  );
};

export default RefundRequestDetails;
