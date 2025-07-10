import { useState } from "react";
import * as XLSX from "xlsx";
import { FileType } from "../_types/fileType";
import { FILE_TYPE } from "../_constants/fileType";
import Swal from "sweetalert2";

export default function useExcelUpload() {
  const [data, setData] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileData, setFileData] = useState<FileType>(FILE_TYPE);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    setFileData({
      name: file.name,
      size: file.size,
    });

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setData(jsonData.slice(1));
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid file format. Please upload an Excel file.",
        });
      }
    };

    reader.readAsBinaryString(file);
    setIsDragging(false);
  };

  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileData({
      name: file.name,
      size: file.size,
    });

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setData(jsonData.slice(1));
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid file format. Please upload an Excel file.",
        });
      }
    };

    reader.readAsBinaryString(file);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveUpload = () => {
    setData([]);
    setIsDragging(false);
  };
  
  return {
    data,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    isDragging,
    setIsDragging,
    handleOnDrop,
    fileData,
    handleRemoveUpload,
    setData,
  };
}
