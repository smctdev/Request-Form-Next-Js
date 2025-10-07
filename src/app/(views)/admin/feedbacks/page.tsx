"use client";

import { FeedbackType } from "../_types/Feedback";
import useFetch from "../_hooks/useFetch";
import DataTable from "react-data-table-component";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { paginationRowsPerPageOptions } from "@/constants/paginationRowsPerPageOptions";
import authenticatedPage from "@/lib/authenticatedPage";
import { ChangeEvent, useState } from "react";
import { FormInputFeedbackType } from "../_types/form-inputs";
import { FORM_INPUTS_FEEDBACK } from "../_constants/form-inputs";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Error from "next/error";
import { api } from "@/lib/api";
import Swal from "sweetalert2";
import { BellAlertIcon } from "@heroicons/react/24/solid";

function Feedbacks() {
  const {
    data: feedbacks,
    isLoading,
    pagination,
    setPagination,
  } = useFetch({ url: "/feedbacks" });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formInputs, setFormInputs] =
    useState<FormInputFeedbackType>(FORM_INPUTS_FEEDBACK);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(null);

  const tableData = [
    {
      name: "ID/CODE",
      cell: (row: FeedbackType) => (
        <span className="p-2 break-words font-bold text-gray-600">
          {row.id}/{row.feedback_code}
        </span>
      ),
      width: "150px",
    },
    {
      name: "NAME",
      selector: (row: FeedbackType) => row.name,
    },
    {
      name: "EMAIL",
      selector: (row: FeedbackType) => row.email,
    },
    {
      name: "PHONE",
      selector: (row: FeedbackType) => row.phone,
    },
    {
      name: "DEPARTMENT",
      selector: (row: FeedbackType) => row.department,
    },
    {
      name: "OPINION",
      selector: (row: FeedbackType) =>
        row.opinion === "other" ? row.other_opinion : row.opinion,
    },
    {
      name: "MESSAGE",
      cell: (row: FeedbackType) => (
        <span className="whitespace-pre-wrap">{row.message}</span>
      ),
    },
    {
      name: "DATE SUBMITTED",
      cell: (row: FeedbackType) => (
        <div>
          <p>{formatDate(row.created_at, "MMM dd, yyyy h:mm a")}</p>
          <p className="text-gray-500 !text-sm">
            {formatDistanceToNowStrict(row.created_at, { addSuffix: true })}
          </p>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      current_page: page,
    });
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setPagination({
      ...pagination,
      per_page: perPage,
    });
  };

  const handleOpenModal = () => {
    console.log("open");
    setIsOpen(!isOpen);
  };

  const handleSubmitNotification = async () => {
    setIsSubmitLoading(true);
    try {
      const response = await api.post("/send-notification", formInputs);
      if (response.status === 201) {
        setFormInputs(FORM_INPUTS_FEEDBACK);
        setErrors(null);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
          confirmButtonText: "Close",
        });
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="bg-graybg min-h-screen pt-8 px-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="!text-4xl font-bold text-blue-400 mb-6">Feedbacks</h2>
        <button
          type="button"
          className="px-4 py-3 font bold bg-primary rounded-md text-white flex gap-1 items-center"
          onClick={handleOpenModal}
        >
          <BellAlertIcon className="w-5 h-5 mr-2" /> Notify Users
        </button>
      </div>

      <div className="bg-base-100 rounded-xl shadow-md">
        <DataTable
          columns={tableData}
          data={feedbacks}
          pagination
          paginationServer
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          paginationTotalRows={pagination.total}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          progressComponent={
            <div className="w-full">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="w-full border border-gray-200 p-2">
                    <div className="flex justify-center">
                      <div className="flex flex-col w-full gap-4">
                        <div className="w-full h-12 skeleton bg-slate-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          progressPending={isLoading}
          persistTableHead
        />
      </div>
      <Modal
        isOpen={isOpen}
        isLoading={isSubmitLoading}
        title="Notify Users"
        handleSubmit={handleSubmitNotification}
        handleClose={handleOpenModal}
      >
        <div className="flex flex-col space-y-2">
          <div>
            <label htmlFor="title">Title</label>
            <Input
              type="text"
              placeholder="Enter title"
              value={formInputs.title}
              translate
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormInputs({ ...formInputs, title: e.target.value })
              }
            />
            {errors?.title && (
              <small className="text-error">{errors.title[0]}</small>
            )}
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <Input
              type="text"
              placeholder="Enter message"
              value={formInputs.message}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormInputs({ ...formInputs, message: e.target.value })
              }
            />
            {errors?.message && (
              <small className="text-error">{errors.message[0]}</small>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default authenticatedPage(Feedbacks, true, true, true);
