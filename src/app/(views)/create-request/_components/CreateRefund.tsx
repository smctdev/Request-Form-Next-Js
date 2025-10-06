"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  PencilIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
// import RequestType from "@/constants/RequestType";
import RequestSuccessModal from "@/components/basic-modals/RequestSuccessModal";
import AddCustomModal from "@/components/basic-modals/AddCustomModal";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import authenticatedPage from "@/lib/authenticatedPage";
import { formatFileSize } from "@/utils/formatFileSize";

type CustomApprover = {
  id: number;
  name: string;
  approvers: {
    noted_by: { name: string }[];
    approved_by: { name: string }[];
  };
};

interface Approver {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
}

const schema = z.object({
  approver_list_id: z.number(),
  approver: z.string(),
  attachment: z.array(z.any()).optional(),
  items: z.array(
    z.object({
      quantity: z.string(),
      description: z.string(),
      unitCost: z.string(),
      totalAmount: z.string(),
      remarks: z.string().optional(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

type Props = {};

const inputStyle =
  "w-full h-full  px-2 py-1   autofill-input focus:outline-0";
const buttonStyle =
  "h-[45px] w-[150px] rounded-[12px] text-white cursor-pointer";

const CreateRefund = (props: Props) => {
  const [selectedRequestType, setSelectedRequestType] = useState(
    "/create-request/request-for-refund"
  );
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [file, setFile] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [initialNotedBy, setInitialNotedBy] = useState<Approver[]>([]);
  const [initialApprovedBy, setInitialApprovedBy] = useState<Approver[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFile((prevImages) => [...prevImages, ...files]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFile((prevImages) => [...prevImages, ...droppedFiles]);
    setIsHovering(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleRemoveImage = (imageName: string) => {
    setFile((prevImages) =>
      prevImages.filter((image) => image.name !== imageName)
    );
  };

  useEffect(() => {
    setInitialNotedBy(notedBy);
    setInitialApprovedBy(approvedBy);
  }, [notedBy, approvedBy]);
  useEffect(() => {
    setNotedBy(user.noted_bies.map((nb: any) => nb.noted_by));
    setApprovedBy(user.approved_bies.map((ab: any) => ab.approved_by));
  }, [user.noted_bies, user.approved_bies]);
  const [items, setItems] = useState<
    {
      quantity: string;
      description: string;
      unitCost: string;
      totalAmount: string;
      remarks: string;
    }[]
  >([
    {
      quantity: "1",
      description: "",
      unitCost: "",
      totalAmount: "",
      remarks: "",
    },
  ]);

  // Function to close the confirmation modal
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (approvedBy.length === 0) {
        Swal.fire({
          icon: "error",
          title: "No approver selected",
          text: "Please select an approver. To proceed, click on 'Add Approver' button above and select an approver from list.",
          confirmButtonText: "Close",
          confirmButtonColor: "#007bff",
        });

        return; // Prevent form submission
      }
      // Check if any item fields are empty
      if (
        items.some((item) =>
          Object.entries(item)
            .filter(([key, value]) => key !== "remarks")
            .some(([key, value]) => value === "")
        )
      ) {
        console.error("Item fields cannot be empty");
        // Display error message to the user or handle it accordingly
        return;
      }

      let grandTotal = 0;
      items.forEach((item) => {
        if (item.totalAmount) {
          grandTotal += parseFloat(item.totalAmount);
        }
      });

      const formData = new FormData();

      // Append each file to FormData
      file.forEach((file) => {
        formData.append("attachment[]", file); // Use "attachment[]" to handle multiple files
      });
      const notedByIds = Array.isArray(notedBy)
        ? notedBy.map((person) => person.id)
        : [];
      const approvedByIds = Array.isArray(approvedBy)
        ? approvedBy.map((person) => person.id)
        : [];
      formData.append("noted_by", JSON.stringify(notedByIds));
      formData.append("approved_by", JSON.stringify(approvedByIds));
      formData.append("form_type", "Refund Request");
      formData.append("currency", "PHP");
      formData.append("user_id", user.id);

      formData.append(
        "form_data",
        JSON.stringify([
          {
            branch: user.branch_code,
            grand_total: grandTotal.toFixed(2),
            items: items.map((item) => ({
              quantity: item.quantity,
              description: item.description,
              unitCost: item.unitCost,
              totalAmount: item.totalAmount,
              remarks: item.remarks,
            })),
          },
        ])
      );

      // Display confirmation modal
      setShowConfirmationModal(true);

      setFormData(formData);
    } catch (error) {
      console.error("An error occurred while submitting the request:", error);
    } finally {
      setLoading(false);
    }
  };

  const tableStyle = "border p-2 bg-[#8EC7F7]";

  const openAddCustomModal = () => {
    setIsModalOpen(true);
  };

  const handleAddCustomData = (notedBy: Approver[], approvedBy: Approver[]) => {
    setNotedBy(notedBy);
    setApprovedBy(approvedBy);
  };

  const handleConfirmSubmit = async () => {
    // Close the confirmation modal
    setShowConfirmationModal(false);

    if (!approvedBy) {
      Swal.fire({
        icon: "error",
        title: "No approver selected",
        text: "Please select an approver. To proceed, click on 'Add Approver' button above and select an approver from list.",
        confirmButtonText: "Close",
        confirmButtonColor: "#007bff",
      });
      return; // Prevent form submission
    }

    Swal.fire({
      title: "Creating...",
      text: "Please wait while we create your request.",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      setLoading(true);

      // Perform the actual form submission
      const response = await api.post(
        `/create-request`,
        formData // Use the formData stored in state
      );

      setShowSuccessModal(true);
      setFormSubmitted(true);
      setLoading(false);
      if (response.status === 201) {
        Swal.close();
      }
    } catch (error: any) {
      console.error("An error occurred while submitting the request:", error);

      if (error.response.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: error.response.data.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#dc3545",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "An unexpected error occurred. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc3545",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);

    router.replace("/request");
  };
  const handleFormSubmit = () => {
    setFormSubmitted(true);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      Swal.fire({
        title: "Are you sure?",
        text: "This item will be removed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedItems = items.filter((_, i) => i !== index);
          setItems(updatedItems);
        }
      });
    }
  };

  const calculateGrandTotal = () => {
    let grandTotal = 0;
    items.forEach((item) => {
      if (item.totalAmount) {
        grandTotal += parseFloat(item.totalAmount);
      }
    });
    return grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        quantity: "1",
        description: "",
        unitCost: "",
        totalAmount: "",
        remarks: "",
      },
    ]);
  };

  const handleInputChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: string
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Calculate total amount if both unitCost and quantity are provided
    if (field === "unitCost" || field === "quantity") {
      const unitCost = parseFloat(updatedItems[index].unitCost);
      const quantity = parseFloat(updatedItems[index].quantity);
      if (!isNaN(unitCost) && !isNaN(quantity)) {
        updatedItems[index].totalAmount = (unitCost * quantity).toFixed(2);
      } else {
        updatedItems[index].totalAmount = "";
      }
    }

    setItems(updatedItems);
  };

  const handleTextareaHeight = (index: number, field: string) => {
    const textarea = document.getElementById(
      `${field}-${index}`
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = "auto"; // Reset to auto height first
      textarea.style.height = `${Math.max(textarea.scrollHeight, 100)}px`; // Set to scroll height or minimum 100px
    }
  };

  const isEditableApprover =
    user.noted_bies.length > 0 || user.approved_bies.length > 0;

  return (
    <div className="bg-graybg dark:bg-blackbg h-full pt-[15px] px-[30px] pb-[15px]">
      {/* <h1 className="text-primary dark:text-primaryD text-[32px] font-bold">
        Create Request
      </h1>

      <select
        className="w-2/5 lg:h-[56px] md:h-10 p-2 bg-gray-200 pl-[30px] border-2 border-black rounded-xl mb-2"
        value={selectedRequestType}
        onChange={(e) => {
          setSelectedRequestType(e.target.value);
          router.replace(e.target.value);
        }}
      >
        <option value="" disabled>
          Type of request
        </option>
        {RequestType.map((item) => (
          <option key={item.title} value={item.path}>
            {item.title}
          </option>
        ))}
      </select> */}
      <div className=" w-full  mb-5 rounded-[12px] flex flex-col">
        <div className="border-b flex justify-between flex-col px-[30px] md:flex-row ">
          <div>
            <h1 className="flex py-4 mr-2 text-3xl font-bold text-left text-primary">
              <span className="mr-2 text-3xl underline decoration-2 underline-offset-8">
                Request
              </span>{" "}
              for Refund
            </h1>
          </div>
        </div>
        <div className="px-[35px] mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row w-1/2 mt-5 mb-4 space-x-6 "></div>
            <div className="table-container">
              <table className="w-full">
                <thead className="">
                  <tr>
                    <th className={`${tableStyle}`}>Quantity</th>
                    <th className={`${tableStyle}`}>Description</th>
                    <th className={`${tableStyle}`}>Unit Cost</th>
                    <th className={`${tableStyle}`}>Total Amount</th>
                    <th className={`${tableStyle}`}>Usage/Remarks</th>
                    <th style={{ border: "none" }}></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="">
                      <td
                        className="p-1 border max-w-[50px]"
                        onClick={() => {
                          const input = document.getElementById(
                            `input-${index}`
                          );
                          if (input) input.focus();
                        }}
                      >
                        <input
                          id={`input-${index}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleInputChange(index, "quantity", e.target.value)
                          }
                          className={`${inputStyle} h-[44px]`}
                        />
                        {validationErrors[`items.${index}.quantity`] &&
                          formSubmitted && (
                            <p className="text-red-500">
                              {validationErrors[`items.${index}.quantity`]}
                            </p>
                          )}
                        {!item.quantity &&
                          formSubmitted &&
                          !validationErrors[`items.${index}.quantity`] && (
                            <p className="text-red-500">Quantity Required</p>
                          )}
                      </td>

                      <td className="p-1 border">
                        <textarea
                          id={`description-${index}`}
                          value={item.description}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className={`${inputStyle}`}
                          style={{ minHeight: "100px", maxHeight: "400px" }} // Minimum height 100px, maximum height 400px (optional)
                          onFocus={() =>
                            handleTextareaHeight(index, "description")
                          } // Adjust height on focus
                          onBlur={() =>
                            handleTextareaHeight(index, "description")
                          } // Adjust height on blur
                          onInput={() =>
                            handleTextareaHeight(index, "description")
                          } // Adjust height on input change
                        />
                        {validationErrors[`items.${index}.description`] &&
                          formSubmitted && (
                            <p className="text-red-500">
                              {validationErrors[`items.${index}.description`]}
                            </p>
                          )}
                        {!item.description &&
                          formSubmitted &&
                          !validationErrors[`items.${index}.description`] && (
                            <p className="text-red-500">Description Required</p>
                          )}
                      </td>
                      <td
                        className="p-1 border max-w-[50px]"
                        onClick={() => {
                          const input = document.getElementById(
                            `unitCost-input-${index}`
                          );
                          if (input) input.focus();
                        }}
                      >
                        <input
                          id={`unitCost-input-${index}`}
                          type="number"
                          value={item.unitCost}
                          onChange={(e) =>
                            handleInputChange(index, "unitCost", e.target.value)
                          }
                          className={`${inputStyle} h-[44px]`}
                        />
                        {validationErrors[`items.${index}.unitCost`] &&
                          formSubmitted && (
                            <p className="text-red-500">
                              {validationErrors[`items.${index}.unitCost`]}
                            </p>
                          )}
                        {!item.unitCost &&
                          formSubmitted &&
                          !validationErrors[`items.${index}.unitCost`] && (
                            <p className="text-red-500">Unit Cost Required</p>
                          )}
                      </td>

                      <td className="p-1 border">
                        {item.totalAmount}
                      </td>
                      <td
                        className="p-1 border"
                        onClick={() => {
                          const input = document.getElementById(
                            `remarks-${index}`
                          );
                          if (input) input.focus();
                        }}
                      >
                        <textarea
                          id={`remarks-${index}`}
                          value={item.remarks}
                          onChange={(e) =>
                            handleInputChange(index, "remarks", e.target.value)
                          }
                          className={`${inputStyle}`}
                          style={{ minHeight: "100px", maxHeight: "400px" }} // Minimum height 100px, maximum height 400px (optional)
                          onFocus={() => handleTextareaHeight(index, "remarks")} // Adjust height on focus
                          onBlur={() => handleTextareaHeight(index, "remarks")} // Adjust height on blur
                          onInput={() => handleTextareaHeight(index, "remarks")} // Adjust height on input change
                        />
                        {validationErrors[`items.${index}.remarks`] &&
                          formSubmitted && (
                            <p className="text-red-500">
                              {validationErrors[`items.${index}.remarks`]}
                            </p>
                          )}
                        {!item.remarks &&
                          formSubmitted &&
                          !validationErrors[`items.${index}.remarks`] && (
                            <p className="text-red-500">Remarks Required</p>
                          )}
                      </td>
                      <td>
                        {items.length > 1 && (
                          <TrashIcon
                            className="text-[#e63c3c] size-7 cursor-pointer"
                            onClick={() => handleRemoveItem(index)}
                            title="Remove Item"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="shadow-md shadow-gray-50">
                  <tr>
                    <td colSpan={4} className="p-2 font-bold text-right">
                      Grand Total:
                    </td>
                    <td className="p-2 font-bold text-center border">
                      ₱ {calculateGrandTotal()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex flex-col items-center justify-center w-full mt-4">
              <hr className="w-full my-2 border-t-4 border-gray-400 border-dotted" />
              <span
                className={`bg-yellow-400 flex items-center cursor-pointer hover:border-4 hover:border-yellow-400  hover:text-white hover:bg-yellow-500  text-gray-950 mt-2 max-w-md justify-center ${buttonStyle}`}
                onClick={handleAddItem}
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Add Item
              </span>
            </div>
            <div className="flex flex-col justify-between md:flex-row">
              <div className="w-full max-w-md p-4">
                <p className="mb-3 font-semibold">Upload attachment:</p>
                <div
                  className={`relative w-full p-6 text-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer 
                      ${isHovering ? "bg-base-200" : "hover:bg-base-300"}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById("files")?.click()}
                >
                  <input
                    type="file"
                    id="files"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-gray-300">
                    Drag and drop your images here <br /> or <br />
                    <span className="text-blue-500">click to upload</span>
                  </p>
                </div>
                {/* <input
                  id="file"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full mt-2"
                /> */}
              </div>
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
                    className="relative w-24 p-2  rounded-lg shadow-md"
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
            <div className="mt-10 mb-4 ml-5">
              <h3 className="mb-3 font-bold">Noted By:</h3>
              <ul className="flex flex-wrap gap-6">
                {" "}
                {/* Use gap instead of space-x */}
                {notedBy.map((user, index) => (
                  <li
                    className="relative flex flex-col items-center justify-center w-auto text-center"
                    key={index}
                  >
                    {" "}
                    {/* Adjust width as needed */}
                    <div className="relative flex flex-col items-center justify-center">
                      <p className="relative inline-block pt-6 font-medium text-center uppercase">
                        <span className="relative z-10 px-2">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                      </p>
                      <p className="font-bold text-[12px] text-center">
                        {user.position}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4 ml-5">
              <h3 className="mb-3 font-bold">Approved By:</h3>
              {approvedBy.length === 0 ? (
                <p className="text-gray-500 ">
                  Please select an approver!
                  <br />
                  <span className="text-sm italic">
                    Note: You can add approvers by clicking the 'Add Approver'
                    button below.
                  </span>
                </p>
              ) : (
                <ul className="flex flex-wrap gap-6">
                  {" "}
                  {/* Use gap instead of space-x */}
                  {approvedBy.map((user, index) => (
                    <li
                      className="relative flex flex-col items-center justify-center text-center"
                      key={index}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        <p className="relative inline-block pt-6 font-medium text-center uppercase">
                          <span className="relative z-10 px-2">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
                        </p>
                        <p className="font-bold text-[12px] text-center">
                          {user.position}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="my-2">
              <button
                type="button"
                onClick={openAddCustomModal}
                className="p-5 text-white rounded bg-primary cursor-pointer hover:text-black"
              >
                {isEditableApprover ? (
                  <span className="flex gap-1 items-center">
                    <PencilIcon className="w-6 h-6" /> Edit Approver
                  </span>
                ) : (
                  <span className="flex gap-1 items-center">
                    <PlusIcon className="w-6 h-6" /> Add Approver
                  </span>
                )}
              </button>
            </div>
            <div className="flex justify-center w-full pb-10 mt-20 space-x-3">
              <button
                className={`bg-[#0275d8] hover:bg-[#6fbcff] ${buttonStyle}`}
                type="submit"
                onClick={handleFormSubmit}
                disabled={loading}
              >
                <span className="text-white hover: ">
                  {loading ? "PLEASE WAIT..." : "CREATE REQUEST"}
                </span>
              </button>
            </div>
            {showConfirmationModal && (
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
                <div className="p-4 bg-base-100 rounded-md">
                  <p>Are you sure you want to submit the request?</p>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 mr-2 font-bold text-gray-800 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
                      onClick={handleCloseConfirmationModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 font-bold text-white rounded bg-primary cursor-pointer hover:bg-primary-dark"
                      onClick={handleConfirmSubmit}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <RequestSuccessModal onClose={handleCloseSuccessModal} />
      )}
      <AddCustomModal
        modalIsOpen={isModalOpen}
        closeModal={closeModal}
        openCompleteModal={() => {}}
        entityType="Approver"
        initialNotedBy={notedBy}
        initialApprovedBy={approvedBy}
        refreshData={() => {}}
        handleAddCustomData={handleAddCustomData}
      />
    </div>
  );
};

export default authenticatedPage(CreateRefund);
