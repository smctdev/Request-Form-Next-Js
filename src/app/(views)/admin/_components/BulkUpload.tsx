import { Dispatch, SetStateAction, useRef, useState } from "react";
import useExcelUpload from "../_mutation/useExcelUpload";
import { FiFileText } from "react-icons/fi";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { formatFileSize } from "@/utils/formatFileSize";
import { api } from "@/lib/api";
import Swal from "sweetalert2";

export default function BulkUpload({
  setModalIsOpen,
  setIsBulkUpload,
  refreshData,
}: {
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsBulkUpload: Dispatch<SetStateAction<boolean>>;
  refreshData: any;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    data,
    handleFileUpload,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleOnDrop,
    fileData,
    handleRemoveUpload,
    setData,
    setIsDragging,
  } = useExcelUpload();

  const handleClickDiv = () => {
    fileRef.current?.click();
  };

  const handleUploadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.post("/bulk-upload-users", {
        data,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
          confirmButtonText: "Close",
          confirmButtonColor: "#007bff",
        }).then(() => {
          setModalIsOpen(false);
          setIsBulkUpload(false);
        });
      }
      setData([]);
      setIsDragging(false);
      refreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full h-full place-content-center">
      {data?.length === 0 ? (
        <div
          className={`border-2 h-96 w-96 rounded border-blue-300 border-dotted grid place-content-center hover:bg-blue-100 !cursor-pointer ${
            isDragging ? "bg-blue-100" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleOnDrop}
          onClick={handleClickDiv}
        >
          <p className="text-center text-blue-500 !text-lg">
            Drag and drop file here
          </p>
          <span className="flex gap-2 items-center">
            <span className="border-b w-full text-gray-300"></span>
            <span className="text-center text-blue-500 !text-md">or</span>
            <span className="border-b w-full text-gray-300"></span>
          </span>
          <p className="text-center text-blue-500 !text-lg">Upload file</p>
          <input
            type="file"
            hidden
            ref={fileRef}
            onChange={handleFileUpload}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FiFileText className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileData?.name || "No file selected"}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(fileData?.size || 0)}
              </p>
            </div>

            {fileData && (
              <button
                onClick={handleRemoveUpload}
                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                aria-label="Remove file"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleUploadUsers}
            className="w-full bg-blue-500 hover:bg-blue-600 px-10 py-2 rounded-md text-white"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
