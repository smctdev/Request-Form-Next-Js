import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useExcelUpload from "../_mutation/useExcelUpload";
import { FiFileText } from "react-icons/fi";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { formatFileSize } from "@/utils/formatFileSize";
import { api } from "@/lib/api";
import Swal from "sweetalert2";
import { BiLoader } from "react-icons/bi";

export default function BulkUpload({
  setModalIsOpen,
  setIsBulkUpload,
  refreshData,
  onCancel,
}: {
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsBulkUpload: Dispatch<SetStateAction<boolean>>;
  refreshData: any;
  onCancel: () => void;
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
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (abortRef.current) {
        abortRef.current.abort();
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleClickDiv = () => {
    fileRef.current?.click();
  };

  const handleUploadUsers = async () => {
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await api.post(
        "/bulk-upload-users",
        {
          data,
        },
        {
          signal: controller.signal,
        }
      );

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
      abortRef.current = null;
    }
  };

  return (
    <div className="grid w-full h-full place-content-center space-y-5">
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
          <div
            className={`flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-md ${
              loading && "animate-pulse"
            }`}
          >
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

            {fileData && !loading && (
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
            {loading ? (
              <span className="flex gap-1 items-center">
                <BiLoader className="animate-spin" /> <span>Uploading...</span>
              </span>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      )}
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
