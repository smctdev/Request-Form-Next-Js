import React, { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BeatLoader from "react-spinners/BeatLoader";
import Avatar from "@/assets/avatar.png";
import SMCTLogo from "@/assets/SMCT.png";
import DSMLogo from "@/assets/DSM.jpg";
import DAPLogo from "@/assets/DAP.jpg";
import HDILogo from "@/assets/HDI.jpg";
import ApproveSuccessModal from "../ui/ApproveSuccessModal";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import PrintLiquidation from "../prints/PrintLiquidation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
import { formatFileSize } from "@/utils/formatFileSize";
import ZoomableImage from "@/components/ZoomableImage";
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
  request_code: string;
  employeeID: string;
  created_at: Date;
  id: number;
  status: string;
  approvers_id: number;
  form_data: FormData[];
  supplier?: string;
  address?: string;
  branch: string;
  date: string;
  user_id: number;
  destination: string;
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
  employeeID: string;
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
};

type Item = {
  liquidationDate: string;
  from: string;
  to: string;
  destination: string;
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

const tableStyle = "border-2 border-black py-2 text-base";
const inputStyle = "border-2 border-black rounded-[12px] text-base";
const input2Style = "border-2 border-black rounded-[12px]";
const inputStyles = "border-2 border-black rounded-[12px] text-end font-bold";
const tableCellStyle = `${inputStyle} px-2 text-center`;

const ApproverLiquidation: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const [approveLoading, setApprovedLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [comments, setComments] = useState("");
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newCashAdvance, setNewCashAdvance] = useState("");
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [avpstaff, setAvpstaff] = useState<Approver[]>([]);
  const [isFetchingApprovers, setisFetchingApprovers] = useState(false);
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [modalStatus, setModalStatus] = useState<"approved" | "disapproved">(
    "approved"
  );
  const [file, setFile] = useState<File[]>([]);
  const [attachment, setAttachment] = useState<any>([]);
  let logo;
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
    setEditableRecord(record);
    setNewCashAdvance(record.form_data[0].cashAdvance);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and set it
      setFile(Array.from(e.target.files));
    }
  };
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
      console.error("Error approving request form:", errorMessage);
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const formatDate2 = (dateString: Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePrint = () => {
    // Construct the data object to be passed
    const data = {
      id: record,
      approvedBy: approvedBy,
      notedBy: notedBy,
      user: user,
      requested_branch: record?.branch,
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
      <div className="relative z-10 w-full p-4 px-10 overflow-scroll bg-base-100 border-black rounded-t-lg shadow-lg md:mx-0 md:w-1/2 lg:w-2/3 space-y-auto h-4/5">
        <div className="sticky flex justify-end cursor-pointer top-2">
          <XMarkIcon
            className="w-8 h-8 p-1   bg-base-100 rounded-full "
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
              <PrintLiquidation
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
            Liquidation of Actual Expense
          </h1>
          <div className="flex flex-col justify-center ">
            <p className="underline ">{record?.branch}</p>
            <p className="text-center">Branch</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start w-full space-y-2">
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

          <div className="w-full pt-3 overflow-x-auto">
            <div className="w-full">
              <table className="w-full border-2 border-collapse border-black">
                <thead>
                  <tr>
                    <th className={`${tableStyle} bg-[#8EC7F7]`}></th>
                    <th colSpan={4} className={`${tableStyle} bg-[#8EC7F7]`}>
                      TRANSPORTATION
                    </th>
                    <th colSpan={3} className={`${tableStyle} bg-[#8EC7F7]`}>
                      HOTEL
                    </th>
                    <th colSpan={3} className={`${tableStyle} bg-[#8EC7F7]`}>
                      PER DIEM OTHER RELATED EXPENSES
                    </th>
                    <th className={`${tableStyle} bg-[#8EC7F7]`}></th>
                  </tr>
                  <tr>
                    <th
                      className={`${tableStyle} whitespace-normal break-words`}
                    >
                      Date
                    </th>
                    <th className={`${tableStyle} whitespace-normal`}>From</th>
                    <th className={`${tableStyle} whitespace-normal`}>To</th>
                    <th
                      className={`${tableStyle} whitespace-nowrap  text-[9px]`}
                    >
                      Type of Transportation
                    </th>
                    <th className={`${tableStyle} whitespace-normal`}>
                      Amount
                    </th>
                    <th className={`${tableStyle} whitespace-normal`}>Name</th>
                    <th className={`${tableStyle} whitespace-normal`}>Place</th>
                    <th className={`${tableStyle} whitespace-normal`}>
                      Amount
                    </th>
                    <th className={`${tableStyle} whitespace-normal`}>
                      Per Diem
                    </th>
                    <th className={`${tableStyle} whitespace-normal`}>
                      Particulars
                    </th>
                    <th className={`${tableStyle} whitespace-normal`}>
                      Amount
                    </th>
                    <th className={`${tableStyle} whitespace-normal`}>
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody className={`${tableCellStyle}`}>
                  {editableRecord.form_data[0].items.map((item, index) => (
                    <tr key={index}>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {formatDate(item.liquidationDate)}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {item.from}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {item.to}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {item.transportation}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {Number(item.transportationAmount).toFixed(2)}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {item.hotel}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {item.hotelAddress}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {Number(item.hotelAmount).toFixed(2)}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {Number(item.perDiem).toFixed(2)}
                      </td>
                      <td
                        className={`${tableCellStyle} whitespace-normal break-words`}
                      >
                        {item.particulars}
                      </td>
                      <td
                        className={`${tableCellStyle}whitespace-normal break-words`}
                      >
                        {Number(item.particularsAmount).toFixed(2)}
                      </td>
                      <td className={`${tableCellStyle}whitespace-nowrap`}>
                        {item.grandTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-2">
            <div>
              <table className="w-full mt-10 border border-black">
                <tbody>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="pl-2 pr-20 font-semibold ">TOTAL EXPENSE</p>
                    </td>
                    <td className={`${inputStyles} font-bold`}>
                      {isEditing
                        ? calculateTotalExpense()
                        : parseFloat(
                            editableRecord.form_data[0].totalExpense
                          ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="pl-2 pr-20 font-semibold ">CASH ADVANCE</p>
                    </td>
                    <td className={`${tableStyle} font-bold`}>
                      <p className="text-right">
                        {parseFloat(
                          editableRecord.form_data[0].cashAdvance
                        ).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="pl-2 font-semibold ">SHORT</p>
                    </td>
                    <td className={`${inputStyles} font-bold`}>
                      ₱
                      {isEditing
                        ? calculateShort(
                            parseFloat(
                              editableRecord.form_data[0].totalExpense
                            ),
                            parseFloat(newCashAdvance)
                          )
                        : parseFloat(editableRecord.form_data[0].short).toFixed(
                            2
                          )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full mt-10 border border-black">
                <tbody>
                  <tr>
                    <td className={`${input2Style} `}>
                      <p className="pl-2 pr-20 font-semibold ">
                        NAME OF EMPLOYEE
                      </p>
                    </td>
                    <td className={`${tableStyle} `}>
                      <p className="text-[16px] font-bold">
                        {" "}
                        {record.form_data[0].name}{" "}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className={`${input2Style} `}>
                      <p className="pl-2 font-semibold ">SIGNATURE</p>
                    </td>
                    {/* <td className={`${tableStyle}`}>
                    <Image src={record.form_data[0].signature} />
                  </td> */}
                    <td className={`${tableStyle} h-10`}>
                      <div className="flex items-center justify-center overflow-hidden">
                        <div className="relative">
                          <Image
                            width={100}
                            height={100}
                            src={Storage(record?.form_data[0]?.signature || "")}
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
                    <td className={`${inputStyles} `}>
                      <p className="font-semibold text-left ">EMPLOYEE NO.</p>
                    </td>
                    <td className={`${tableStyle}`}>
                      <p className="text-lg">
                        {record.form_data[0].employeeID}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                          <div className="absolute -top-15">
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
                              <div className="absolute -top-15">
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
                            <div className="absolute -top-15">
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
                    className="relative w-24 p-2 bg-base-100 rounded-lg shadow-md"
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
                  className="w-full h-auto p-1 mt-2 bg-base-100 border border-black rounded-md"
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
                    .map((userAvp, index) => (
                      <>
                        {(userAvp.id === user?.data?.id ||
                          user?.data?.position === "AVP - Finance") && (
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
                                  {userAvp.firstName} {userAvp.lastName} -{" "}
                                  {userAvp.position}
                                </h3>
                                <p>{userAvp.comment}</p>
                              </li>
                            </div>
                          </div>
                        )}
                      </>
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
                  className="relative w-24 p-2 bg-base-100 rounded-lg shadow-md"
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
        </div>
      </div>
      {showSuccessModal && (
        <ApproveSuccessModal
          closeModal={() => setShowSuccessModal(false)}
          closeParentModal={closeModal} // Pass the closeModal function as closeParentModal prop
          status={modalStatus}
        />
      )}
    </div>
  );
};

export default ApproverLiquidation;
