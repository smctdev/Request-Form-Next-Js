import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BeatLoader from "react-spinners/BeatLoader";
import Avatar from "@/assets/avatar.png";
import SMCTLogo from "@/assets/SMCT.png";
import DSMLogo from "@/assets/DSM.jpg";
import DAPLogo from "@/assets/DAP.jpg";
import HDILogo from "@/assets/HDI.jpg";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import PrintPurchase from "../prints/PrintPurchase";
import ApproveSuccessModal from "../ui/ApproveSuccessModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
import { formatFileSize } from "@/utils/formatFileSize";
import ZoomableImage from "@/components/ZoomableImage";
import formattedAmount from "@/utils/formattedAmount";
import Storage from "@/utils/storage";

type Props = {
  closeModal: () => void;
  record: Record;
  refreshData: () => void;
};

interface Approver {
  id: number;
  firstname: string;
  lastname: string;
  firstName: string;
  lastName: string;
  name: string;
  comment: string;
  position: string;
  signature: string;
  status: string;
  branch: string;
}

type Record = {
  created_at: Date;
  request_code: string;
  id: number;
  status: string;
  approvers_id: number;
  form_data: FormData[];
  supplier?: string;
  address?: string;
  branch: string;
  date: string;
  user_id: number;
  grand_total: string;
  attachment: string;
  noted_by: Approver[];
  approved_by: Approver[];
  avp_staff: Approver[];
  approved_attachment: string;
  requested_by: string;
  requested_signature: string;
  requested_position: string;
  completed_status: string;
};

type FormData = {
  approvers_id: number;
  approvers: {
    noted_by: { firstName: string; lastName: string }[];
    approved_by: { firstName: string; lastName: string }[];
  };
  purpose: string;
  items: Item[];
  branch: string;
  date: string;
  grand_total: string;
  supplier: string;
  address: string;
};

type Item = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
};

const inputStyle = "border border-black bg text-[12px] font-bold p-2 h-14";
const tableCellStyle = `${inputStyle} w-20 text-end`;

const ApproverPurchase: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [editedApprovers, setEditedApprovers] = useState<number>(
    record.approvers_id
  );
  const [attachment, setAttachment] = useState<any>([]);
  const [file, setFile] = useState<File[]>([]);
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [comments, setComments] = useState("");
  const [avpstaff, setAvpstaff] = useState<Approver[]>([]);
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [approveLoading, setApprovedLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFetchingApprovers, setisFetchingApprovers] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [modalStatus, setModalStatus] = useState<"approved" | "disapproved">(
    "approved"
  );
  const [commentMessage, setCommentMessage] = useState("");
  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchMap, setBranchMap] = useState<Map<number, string>>(new Map());
  const hasDisapprovedInNotedBy = notedBy.some(
    (user) => user.status === "Disapproved"
  );
  const hasDisapprovedInApprovedBy = approvedBy.some(
    (user) => user.status === "Disapproved"
  );
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [positionImg, setPositionImg] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const longPressTimeout = useRef<number | null>(null);
  const { user } = useAuth();
  const { setIsRefresh } = useNotification();
  let logo;
  if (user?.data?.branch === "Strong Motocentrum, Inc.") {
    logo = <Image width={100} height={100} src={SMCTLogo} alt="SMCT Logo" />;
  } else if (user?.data?.branch === "Des Strong Motors, Inc.") {
    logo = <Image width={100} height={100} src={DSMLogo} alt="DSM Logo" />;
  } else if (user?.data?.branch === "Des Appliance Plaza, Inc.") {
    logo = <Image width={100} height={100} src={DAPLogo} alt="DAP Logo" />;
  } else if (user?.data?.branch === "Honda Des, Inc.") {
    logo = <Image width={100} height={100} src={HDILogo} alt="HDI Logo" />;
  } else {
    logo = null; // Handle the case where branch does not match any of the above
  }

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await api.get(`/view-branch`);
        const branches = response.data.data;

        // Create a mapping of id to branch_name
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

  useEffect(() => {
    setNotedBy(record.noted_by);
    setApprovedBy(record.approved_by);
    setAvpstaff(record.avp_staff);
    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);
    setNewAddress(record.form_data[0].address);
    setNewSupplier(record.form_data[0].supplier);
    setEditedApprovers(record.approvers_id);

    try {
      // If record.attachment is a JSON string, parse it
      if (typeof record.attachment === "string") {
        const parsedAttachment = JSON.parse(record.attachment);
        // Handle the parsed attachment
        const fileUrls = parsedAttachment.map(
          (filePath: string) =>
            `${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${filePath.replace(
              /\\/g,
              "/"
            )}`
        );
        setAttachmentUrl(fileUrls);
      } else {
        // Handle case where record.attachment is already an object
        console.warn("Attachment is not a JSON string:", record.attachment);
        // Optionally handle this case if needed
      }
      if (
        Array.isArray(record.approved_attachment) &&
        record.approved_attachment.length > 0
      ) {
        const approvedAttachmentString = record.approved_attachment[0]; // Access the first element
        const parsedApprovedAttachment = JSON.parse(approvedAttachmentString); // Parse the string to get the actual array

        if (
          Array.isArray(parsedApprovedAttachment) &&
          parsedApprovedAttachment.length > 0
        ) {
          // Access the first element of the array
          const formattedAttachment = parsedApprovedAttachment;
          setAttachment(formattedAttachment); // Set the state with the string
        } else {
          console.warn(
            "Parsed approved attachment is not an array or is empty:",
            parsedApprovedAttachment
          );
        }
      } else {
        console.warn(
          "Approved attachment is not an array or is empty:",
          record.approved_attachment
        );
      }
    } catch (error) {
      console.error("Error parsing attachment:", error);
    }
  }, [record]);

  const formatDate2 = (dateString: Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (!record) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and set it
      setFile(Array.from(e.target.files));
    }
  };
  const handleApprove = async () => {
    setIsRefresh(true);
    const requestData = new FormData();

    // Only append attachments if the file array is not empty
    if (file && file.length > 0) {
      file.forEach((file) => {
        requestData.append("attachment[]", file);
      });
    }

    requestData.append("user_id", parseInt(user.id).toString());
    requestData.append("action", "approve");
    requestData.append("comment", comments);

    // Log the contents of requestData for debugging

    try {
      setApprovedLoading(true);

      const response = await api.post(
        `/request-forms/${record.id}/process`,
        requestData
      );

      setApprovedLoading(false);
      setModalStatus("approved");
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setApprovedLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error approving request form:", error);
      if (error.response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          confirmButtonText: "Close",
          confirmButtonColor: "#007bff",
        }).then(() => {
          closeModal();
          refreshData();
        });
      } else {
        setCommentMessage(errorMessage);
      }
    } finally {
      setIsRefresh(false);
    }
  };
  const handleDisapprove = async () => {
    setLoading(true);
    setIsRefresh(true);
    try {
      const requestData = new FormData();

      // Only append attachments if the file array is not empty
      if (file && file.length > 0) {
        file.forEach((file) => {
          requestData.append("attachment[]", file);
        });
      }

      requestData.append("user_id", parseInt(user.id).toString());
      requestData.append("action", "disapprove");
      requestData.append("comment", comments);

      // Log the contents of requestData for debugging

      const response = await api.post(
        `/request-forms/${record.id}/process`,
        requestData
      );

      setLoading(false);
      setModalStatus("disapproved"); // Set modal status to 'disapproved'
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error disapproving request form:", errorMessage);
      if (error.response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          confirmButtonText: "Close",
          confirmButtonColor: "#007bff",
        }).then(() => {
          closeModal();
          refreshData();
        });
      } else {
        setCommentMessage(errorMessage);
      }
    } finally {
      setIsRefresh(false);
    }
  };
  const handlePrint = () => {
    // Construct the data object to be passed
    const data = {
      id: record,
      approvedBy: approvedBy,
      notedBy: notedBy,
      user: user,
      requested_branch: record?.branch,
      newSupplier: newSupplier,
      newAddress: newAddress,
    };

    localStorage.setItem("printData", JSON.stringify(data));

    // Open a new window with PrintRefund component
    const newWindow = window.open(`/print/purchase`, "_blank");

    // Optional: Focus the new window
    if (newWindow) {
      newWindow.focus();
    }
  };

  const isImageFile = (fileUrl: any) => {
    const imageExtensions = [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "bmp",
      "svg",
      "webp",
      "ico",
    ];
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

  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3));
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.2, 1));
  const resetZoom = () => {
    setZoom(1);
    setPositionImg({ x: 0, y: 0 });
  };

  const handleLongPressStart = (e: any) => {
    if (zoom > 1) {
      const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      setStartPosition({
        x: startX - positionImg.x,
        y: startY - positionImg.y,
      });

      longPressTimeout.current = window.setTimeout(() => {
        setDragging(true);
      }, 500) as unknown as number;
    }
  };

  const handleLongPressEnd = () => {
    if (longPressTimeout.current !== null) {
      clearTimeout(longPressTimeout.current);
    }
    setDragging(false);
  };

  const handleMouseMove = (e: any) => {
    if (dragging) {
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      setPositionImg({
        x: clientX - startPosition.x,
        y: clientY - startPosition.y,
      });
    }
  };

  const handleRemoveImage = (imageName: string) => {
    setFile((prevImages) =>
      prevImages.filter((image) => image.name !== imageName)
    );
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
        {!fetchingApprovers && !isFetchingApprovers && (
          <>
            <button
              type="button"
              className="p-1 px-2 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-400"
              onClick={handlePrint}
            >
              Print
            </button>
            {printWindow && (
              <PrintPurchase
                data={{
                  id: record,
                  approvedBy: approvedBy,
                  notedBy: notedBy,
                  user: user,
                }}
              />
            )}
          </>
        )}
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center w-1/2">{logo}</div>
          <h1 className="font-bold text-[18px] uppercase ">
            Purchase Order Requisition Slip
          </h1>
          <div className="flex flex-col justify-center ">
            <p className="underline ">{record?.branch}</p>
            <p className="text-center">Branch</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start w-full space-y-4">
          <div className="flex items-center justify-between w-full">
            <p className="font-medium text-[14px]">
              Request ID: {record.request_code}
            </p>
            <div className="flex w-auto ">
              <p>Date: </p>
              <p className="pl-2 font-bold">{formatDate2(record.created_at)}</p>
            </div>
          </div>
          {record.completed_status !== "Completed" && (
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
                    : "bg-pink-400"
                } rounded-lg  py-1 w-1/3 font-medium text-[14px] text-center ml-2 text-white`}
              >
                {" "}
                {record.status}
              </p>
            </div>
          )}

          <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
            <div className="w-full">
              <h1>Supplier</h1>
              <input
                type="text"
                className="w-full p-1 mt-2 bg-white border border-black rounded-md"
                value={editableRecord.form_data[0].supplier}
                readOnly
              />
            </div>
            <div className="w-full">
              <h1>Address</h1>
              <input
                type="text"
                className="w-full p-1 mt-2 bg-white border border-black rounded-md"
                value={editableRecord.form_data[0].address}
                readOnly
              />
            </div>
          </div>
          <div className="w-full mt-4 overflow-x-auto">
            <div className="w-full border-collapse">
              <div className="table-container">
                <table className="w-full border space-x-auto">
                  <thead className="border border-black h-14 bg-[#8EC7F7]">
                    <tr className="border">
                      <th className={`${inputStyle}`}>QTY</th>
                      <th className={`${inputStyle}`}>DESCRIPTION</th>
                      <th className={`${inputStyle}`}>UNIT COST</th>
                      <th className={`${inputStyle}`}>TOTAL AMOUNT</th>
                      <th className={`${inputStyle}`}>USAGE/REMARKS</th>
                    </tr>
                  </thead>
                  <tbody className={`${tableCellStyle}`}>
                    {editableRecord.form_data[0].items.map((item, index) => (
                      <tr key={index}>
                        <td className={tableCellStyle}>{item.quantity}</td>
                        <td className={tableCellStyle}>{item.description}</td>
                        <td className={tableCellStyle}>
                          {formattedAmount(item.unitCost)}
                        </td>
                        <td className={tableCellStyle}>
                          {formattedAmount(item.totalAmount)}
                        </td>
                        <td className={tableCellStyle}>{item.remarks}</td>
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
              className="w-full p-1 mt-2 font-bold bg-white border border-black rounded-md"
              value={formattedAmount(record.form_data[0].grand_total)}
              readOnly
            />
          </div>
          <div className="flex-col items-center justify-center w-full">
            {isFetchingApprovers ? (
              <div className="flex items-center justify-center w-full h-40">
                <h1>Fetching..</h1>
              </div>
            ) : (
              <div className="flex flex-wrap">
                <div className="mb-4 ml-5">
                  <h3 className="mb-3 font-bold">Requested By:</h3>
                  <ul className="flex flex-wrap gap-6">
                    <li className="relative flex flex-col items-center justify-center w-auto text-center">
                      <div className="relative flex flex-col items-center justify-center">
                        {/* Signature */}
                        {record?.requested_signature && (
                          <div className="absolute -top-7">
                            <Image
                              src={Storage(record?.requested_signature) || ""}
                              width={120}
                              height={120}
                              className="relative z-20 pointer-events-none"
                              alt="signature"
                              draggable="false"
                              onContextMenu={(e) => e.preventDefault()}
                              style={{ filter: "blur(1px)" }}
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
                              <div className="absolute -top-7">
                                <Image
                                  src={Storage(user.signature || "")}
                                  alt="avatar"
                                  width={120}
                                  height={120}
                                  className="relative z-20 pointer-events-none"
                                  draggable="false"
                                  onContextMenu={(e) => e.preventDefault()}
                                  style={{ filter: "blur(1px)" }}
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
                                    : user.status === "Pending"
                                    ? "text-yellow-400"
                                    : ""
                                }`}
                              >
                                {user.status}
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
                            <div className="absolute -top-7">
                              <Image
                                src={Storage(user.signature || "")}
                                alt="avatar"
                                width={120}
                                height={120}
                                className="relative z-20 pointer-events-none"
                                draggable="false"
                                onContextMenu={(e) => e.preventDefault()}
                                style={{ filter: "blur(1px)" }}
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
                                  : user.status === "Pending"
                                  ? "text-yellow-400"
                                  : ""
                              }`}
                            >
                              {user.status}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="w-full">
            <h1 className="font-bold">Attachments:</h1>
            <div className="max-w-[500px] overflow-x-auto pb-3">
              <div className="flex gap-1">
                {attachmentUrl.map((fileItem) => (
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
            {/* <div>
              {attachmentUrl
                .filter((_, index) => !removedAttachments.includes(index))
                .map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {url.split("/").pop()}
                    </a>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

              {attachmentUrl.filter(
                (_, index) => !removedAttachments.includes(index)
              ).length === 0 && (
                <p className="text-gray-500">No attachments available.</p>
              )}
            </div> */}
          </div>
          <div className="w-full">
            <h2 className="mb-2 text-lg font-bold">Comments:</h2>

            {record.status === "Pending" && (
              <div>
                <textarea
                  className="w-full h-auto p-1 mt-2 bg-white border border-black rounded-md"
                  placeholder="Enter your comments here.."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            )}
            {commentMessage && <p className="text-red-500">{commentMessage}</p>}

            {/* Comments Section */}
            <ul className="flex flex-col w-full mb-4 space-y-4">
              {notedBy.filter((user) => user.comment).length > 0 ||
              approvedBy.filter((user) => user.comment).length > 0 ||
              avpstaff.filter((user) => user.comment).length > 0 ? (
                <>
                  {notedBy
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex">
                        <div>
                          <Image
                            alt="logo"
                            className="hidden cursor-pointer sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ filter: "blur(1px)" }}
                          />
                        </div>
                        <div className="flex flex-row w-full" key={index}>
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="text-lg font-bold">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}

                  {approvedBy
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex">
                        <div>
                          <Image
                            alt="logo"
                            className="hidden cursor-pointer sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ filter: "blur(1px)" }}
                          />
                        </div>
                        <div className="flex flex-row w-full" key={index}>
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="text-lg font-bold">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}
                  {avpstaff
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex">
                        <div>
                          <Image
                            alt="logo"
                            className="hidden cursor-pointer sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                          />
                        </div>
                        <div className="flex flex-row w-full" key={index}>
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="text-lg font-bold">
                              {user.firstName} {user.lastName} - {user.position}
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <p className="text-gray-500">No comments yet</p>
              )}
            </ul>
          </div>
          <div className="w-full max-w-full ">
            <p className="font-semibold">Approved Attachment:</p>

            {record.approved_attachment.length === 0 &&
            user.position === "Vice President" &&
            record.status === "Pending" ? (
              <>
                <input
                  id="file"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full mt-2"
                  hidden
                />
                <button
                  type="button"
                  className="px-2 py-1 text-white bg-primary hover:bg-blue-400 rounded"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  Upload
                </button>
              </>
            ) : record.approved_attachment.length > 0 && attachment ? (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {attachment.map((attachmentItem: any) => (
                  <div className="relative group">
                    <Image
                      width={100}
                      height={100}
                      src={`${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${attachmentItem}`}
                      alt="Approved Attachment"
                      className="w-56 h-auto max-w-full rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black/70 opacity-0 group-hover:opacity-100">
                      <div className="flex items-center justify-center gap-10">
                        <a
                          className="tooltip tooltip-info tooltip-top"
                          data-tip="Download"
                          href={`${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${attachmentItem}`}
                          download
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon
                            icon={faDownload}
                            className="text-white w-7 h-7"
                          />
                        </a>

                        <button
                          onClick={() =>
                            handleViewImage(
                              `${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${attachmentItem}`
                            )
                          }
                          className="focus:outline-none tooltip tooltip-info tooltip-top"
                          data-tip="View"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-white w-7 h-7"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No approved attachment available.</p>
            )}
          </div>
          {file.length > 1 && (
            <div className="mt-4">
              <p className="mb-3 font-semibold">Attachments:</p>
              <button
                onClick={() => setFile([])}
                className="px-3 py-1 text-xs text-white bg-red-700 rounded-lg hover:bg-red-500"
              >
                Remove All
              </button>
            </div>
          )}
          <div className="max-w-[500px] overflow-x-auto pb-3 ">
            <div className="flex gap-1">
              {file.map((fileItem) => (
                <div
                  key={fileItem.name}
                  className="relative w-24 p-2 bg-white rounded-lg shadow-md"
                >
                  <div className="relative">
                    {fileItem.type.startsWith("image/") ? (
                      // Display image preview if file is an image
                      <Image
                        width={100}
                        height={100}
                        src={URL.createObjectURL(fileItem)}
                        alt={fileItem.name}
                        className="object-cover w-full h-20 rounded-md"
                      />
                    ) : (
                      // Display document icon if file is not an image
                      <div className="flex items-center justify-center w-full h-20 bg-gray-100 rounded-md">
                        <Image
                          width={100}
                          height={100}
                          src="https://cdn-icons-png.flaticon.com/512/3396/3396255.png"
                          alt=""
                        />
                      </div>
                    )}

                    {/* Display File Name and Size */}
                    <div className="mt-2">
                      <p className="text-sm font-semibold truncate">
                        {fileItem.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileItem.size)}
                      </p>
                      <p key={fileItem.name} className="text-center">
                        <button
                          onClick={() => handleRemoveImage(fileItem.name)}
                          className="px-3 py-1 text-xs text-white bg-red-500 rounded-lg"
                        >
                          Remove
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {record.status === "Pending" && (
            <div className="flex items-center justify-between w-full space-x-2">
              <button
                type="button"
                className="items-center w-1/2 h-10 p-2 text-white bg-primary rounded-xl cursor-pointer hover:bg-blue-600"
                onClick={handleApprove}
              >
                {approveLoading ? (
                  <BeatLoader color="white" size={10} />
                ) : (
                  "Approve"
                )}
              </button>
              <button
                type="button"
                className="w-1/2 p-2 text-white bg-red-600 rounded-xl cursor-pointer hover:bg-red-800"
                onClick={handleDisapprove}
              >
                {loading ? (
                  <BeatLoader color="white" size={10} />
                ) : (
                  "Disapprove"
                )}
              </button>
            </div>
          )}

          {showSuccessModal && (
            <ApproveSuccessModal
              closeModal={() => setShowSuccessModal(false)}
              closeParentModal={closeModal} // Pass the closeModal function as closeParentModal prop
              status={modalStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproverPurchase;
