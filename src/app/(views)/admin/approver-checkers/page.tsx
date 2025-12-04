"use client";

import authenticatedPage from "@/lib/authenticatedPage";
import useFetch from "../_hooks/useFetch";
import DataTable from "react-data-table-component";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import kindOfRequests from "@/data/kind-of-request.json";
import { api } from "@/lib/api";
import Swal from "sweetalert2";
import CreateApproverCheckers from "../_components/modals/create-approver-checkers";
import EditApproverCheckers from "../_components/modals/edit-approver-checkers";

interface Checkers {
  id: number;
  fullName: string;
}

interface Approver {
  id: number;
  fullName: string;
  checkers: Checkers[];
  checker_category: string;
  item_id: number;
}

interface FormInputs {
  approver: number | string;
  checker: number | string;
  checker_category: string;
}

const formItems = {
  approver: "",
  checker: "",
  checker_category: "",
};

const tableCustomStyles = {
  headRow: {
    style: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "black",
      backgroundColor: "#FFFF",
    },
  },
  rows: {
    style: {
      color: "STRIPEDCOLOR",
      backgroundColor: "STRIPEDCOLOR",
    },
    stripedStyle: {
      color: "NORMALCOLOR",
      backgroundColor: "#E7F1F9",
    },
  },
};

const emptyTable = (approverCheckers: Approver[], searchTerm: string) => {
  return (
    approverCheckers?.length === 0 && (
      <p className="flex flex-col items-center justify-center h-64">
        {searchTerm
          ? "No " + `"${searchTerm}"` + " found"
          : "No data available."}
      </p>
    )
  );
};

function ApproverCheckers() {
  const { data, isLoading, handleSearch, searchData, setData } = useFetch({
    url: "/approver-checkers",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const [isLoadingApproverCheckers, setIsLoadingApproverCheckers] =
    useState<boolean>(false);
  const [approverCheckers, setApproverCheckers] = useState<any>([]);
  const [formInputs, setFormInputs] = useState<FormInputs>(formItems);
  const [errors, setErrors] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [selectedApprover, setSelectedApprover] = useState<any>(null);

  useEffect(() => {
    if (!isOpen && !isOpenUpdate) return;

    const fetchApproverCheckers = async () => {
      setIsLoadingApproverCheckers(true);
      try {
        const response = await api.get("/approver-checkers-select", {
          params: {
            approver: selectedApprover?.id,
            checker: selectedApprover?.checkers[0]?.id,
          },
        });
        setApproverCheckers(response.data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoadingApproverCheckers(false);
      }
    };

    fetchApproverCheckers();
  }, [isOpen, isOpenUpdate, selectedApprover]);

  const columns = [
    {
      name: "Approver",
      cell: (row: Approver) => row.fullName,
    },
    {
      name: "Checkers",
      cell: (row: Approver) =>
        row.checkers.map((checker: Checkers, index: number) => (
          <p key={index} className={`${!checker?.id && "text-red-500"}`}>
            {checker.fullName}
          </p>
        )),
    },
    {
      name: "Approver Category",
      cell: (row: Approver) =>
        row.checker_category?.replace(/_/g, " ").toUpperCase(),
    },
    {
      name: "Action",
      cell: (row: Approver) => (
        <div className="flex gap-2 items-center">
          <button
            className="btn btn-error text-white"
            onClick={handleDelete(row.item_id)}
          >
            Delete
          </button>
          <button
            className="btn btn-info text-white"
            onClick={handleOpenUpdateModal(row)}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
    setFormInputs(formItems);
  };

  const handleOpenUpdateModal = (row: Approver) => () => {
    setIsOpenUpdate(!isOpenUpdate);
    setSelectedApprover(row);
    setFormInputs(formItems);
  };

  const handleDelete = (id: number | string) => () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await api.delete(`/approver-checkers/${id}`);
          if (response.status === 200) {
            setData(data.filter((item: any) => item.item_id !== id));
            return response.data.message;
          }
          throw new Error("Failed to delete");
        } catch (error: any) {
          console.error(error);
          throw new Error(
            error.response.data.message || "Something went wrong"
          );
        }
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: result.value,
            confirmButtonText: "Close",
            confirmButtonColor: "#007bff",
          });
        }
      })
      .catch((error: any) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonText: "Close",
          confirmButtonColor: "#007bff",
        });
      });
  };

  const handleChange =
    (title: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      setFormInputs({
        ...formInputs,
        [title]: e.target.value,
      });
    };

  const categories = kindOfRequests.filter(
    (category) => category.value !== "n/a"
  );

  const approverOptions = useMemo(() => {
    return approverCheckers?.approvers?.map((a: any, index: number) => (
      <option key={index} value={a.id}>
        {a.fullName}
      </option>
    ));
  }, [approverCheckers?.approvers]);

  const checkerOptions = useMemo(() => {
    return approverCheckers?.checkers?.map((a: any, index: number) => (
      <option key={index} value={a.id}>
        {a.fullName}
      </option>
    ));
  }, [approverCheckers?.checkers]);

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    try {
      const response = await api.post("/approver-checkers", formInputs);
      if (response.status === 200) {
        setData([...data, response.data.data]);
        setIsOpen(false);
        setErrors(null);
        setError(null);
        setFormInputs(formItems);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added successfully",
          confirmButtonText: "Close",
          confirmButtonColor: "#007bff",
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
        setError(null);
      } else {
        setErrors(null);
        setError(error.response.data.message);
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoadingSubmit(true);
    try {
      const response = await api.patch(
        `/approver-checkers/${selectedApprover?.item_id}`,
        formInputs
      );
      if (response.status === 200) {
        setData((prevData: Approver[]) => {
          const exists = prevData.some(
            (item) => item.item_id === response.data.data.item_id
          );

          if (exists) {
            return prevData.map((item: Approver) =>
              item.item_id === response.data.data.item_id
                ? { ...item, ...response.data.data }
                : item
            );
          } else {
            return [...prevData, response.data.data];
          }
        });
        setIsOpenUpdate(false);
        setErrors(null);
        setError(null);
        setFormInputs(formItems);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated successfully",
          confirmButtonText: "Close",
          confirmButtonColor: "#007bff",
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
        setError(null);
      } else {
        setErrors(null);
        setError(error.response.data.message);
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleResetChecker = () => {
    setFormInputs((prev) => ({
      ...prev,
      checker: "",
    }));
  };

  return (
    <div className="w-full h-full px-4 pt-4 bg-graybg dark:bg-blackbg sm:px-10 md:px-10 lg:px-30 xl:px-30 space-y-2">
      <div className="p-10 rounded-lg bg-white shadow-lg">
        <div className="flex justify-end">
          <div className="flex gap-2 items-center">
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx={11} cy={11} r={8} />
                  <path d="m21 21-4.3-4.3" />
                </g>
              </svg>
              <input
                type="search"
                onChange={handleSearch()}
                className="grow"
                placeholder="Search"
                value={searchData}
              />
            </label>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenModal}
            >
              <PlusIcon className="w-6 h-6" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-lg">
        <DataTable
          columns={columns}
          data={data}
          pagination
          striped
          customStyles={tableCustomStyles}
          noDataComponent={emptyTable(data, searchData)}
          progressPending={isLoading}
          persistTableHead
        />
      </div>

      <CreateApproverCheckers
        isOpen={isOpen}
        isLoadingApproverCheckers={isLoadingApproverCheckers}
        approverOptions={approverOptions}
        checkerOptions={checkerOptions}
        formInputs={formInputs}
        errors={errors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        categories={categories}
        isLoadingSubmit={isLoadingSubmit}
        handleOpenModal={handleOpenModal}
        error={error}
        handleResetChecker={handleResetChecker}
      />

      <EditApproverCheckers
        isOpenUpdate={isOpenUpdate}
        isLoadingApproverCheckers={isLoadingApproverCheckers}
        approverOptions={approverOptions}
        checkerOptions={checkerOptions}
        formInputs={formInputs}
        errors={errors}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        categories={categories}
        isLoadingSubmit={isLoadingSubmit}
        handleOpenUpdateModal={handleOpenUpdateModal}
        error={error}
        selectedApprover={selectedApprover}
        setFormInputs={setFormInputs}
        handleResetChecker={handleResetChecker}
      />
    </div>
  );
}

export default authenticatedPage(ApproverCheckers, true, true, true);
