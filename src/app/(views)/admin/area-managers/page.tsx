"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ClipLoader } from "react-spinners";
import AddAreaManagerModal from "@/app/(views)/admin/_components/modals/AddAreaManagerModal";
import DeleteModal from "@/app/(views)/admin/_components/modals/DeleteModal";
import DeleteSuccessModal from "@/app/(views)/admin/_components/ui/DeleteSucessModal";
import CompleteModal from "@/app/(views)/admin/_components/ui/CompleteModal";
import EditAreaManager from "@/app/(views)/admin/_components/modals/EditAreaManager";
import SuccessModal from "@/app/(views)/admin/_components/ui/SuccessModal";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import authenticatedPage from "@/lib/authenticatedPage";

type Props = {};

interface Record {
  id: number;
  user_id: number;
  branch_id: number[];
  branches: {
    message: string;
    data: {
      id: number;
      branch_code: string;
      branch: string;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  user: UserObject;
}

interface AreaManager {
  id: number;
  user_id: number;
  branch_id: number[];
  branches: {
    message: string;
    data: {
      id: number;
      branch_code: string;
      branch: string;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  user: UserObject;
}

interface UserObject {
  message: string;
  data: User;
  status: boolean;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  contact: string;
  branch_code: string;
  userName: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  signature: string;
  created_at: string;
  updated_at: string;
  position: string;
  branch: string;
  employee_id: string;
}

const SetupAreaManager = (props: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeletedSuccessModal, setShowDeletedSuccessModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Record | null>(null);
  const [areaManagerList, setAreaManagerList] = useState<Record[]>([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApproverData = async () => {
      if (!user.id) {
        console.error("User ID is missing");
        return;
      }
      try {
        // Fetch area managers
        const response = await api.get<{ data: AreaManager[] }>(
          `/view-area-managers`
        );

        setAreaManagerList(response.data.data);
        setFetchCompleted(true); // Indicate fetch completion
      } catch (error) {
        console.error("Error fetching approvers data:", error);
        setFetchCompleted(true); // Indicate fetch completion
      } finally {
        setLoading(false);
      }
    };

    fetchApproverData();
  }, [user.id]);

  const filteredAreaManager = areaManagerList.filter((areamanager: any) =>
    Object.values(areamanager.user).some((value) =>
      String(value).toLowerCase().includes(filterTerm.toLowerCase())
    )
  );

  const refreshData = async () => {
    setFetchCompleted(false); // Reset fetch completion state
    setisLoading(true);

    if (!user.id) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await api.get<{ data: AreaManager[] }>(
        `/view-area-managers`
      );

      setAreaManagerList(response.data.data);
      setisLoading(false);
      setFetchCompleted(true);
    } catch (error) {
      console.error("Error fetching approvers data:", error);
      setisLoading(false);
      setFetchCompleted(true);
    }
  };

  const deleteModalShow = (row: Record) => {
    setSelectedUser(row);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const editModalShow = (row: Record) => {
    setEditModal(true);
    setSelectedUser(row);
  };

  const editModalClose = () => {
    setEditModal(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const openCompleteModal = () => {
    setShowCompleteModal(true);
    setModalIsOpen(false);
  };

  const closeCompleteModal = () => {
    setShowCompleteModal(false);
  };
  const openSuccessModal = () => {
    setShowSuccessModal(true);
    setEditModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };
  const openDeleteSuccessModal = () => {
    setShowDeletedSuccessModal(true);
    setDeleteModal(false);
  };

  const closeDeleteSuccessModal = () => {
    setShowDeletedSuccessModal(false);
  };
  const getAssignedBranches = (row: Record) => {
    return (
      <div className="grid grid-cols-1 space-y-2 sm:grid-cols-2 sm:gap-2 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
        {row.branches.map((branchInfo: any, index: any) => (
          <div
            className="bg-primary p-2 rounded-[12px] w-20 text-center "
            key={index}
          >
            <ul className="text-white ">{branchInfo.branch_code}</ul>
          </div>
        ))}
      </div>
    );
  };

  const deleteUser = async () => {
    setisLoading(true);
    try {
      // Send PUT request to update user's role
      const response = await api.delete(
        `/delete-area-manager/${selectedUser?.id}`
      );

      setisLoading(false);
      openDeleteSuccessModal();
      refreshData();

      // Optionally handle success message or UI updates after successful update
    } catch (error) {
      setisLoading(false);
      console.error("Error updating role:", error);
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row: Record) => row.id,
      width: "80px",
      sortable: true,
    },
    {
      name: "Name",
      sortable: true,
      selector: (row: any) => {
        const user = row.user;
        const firstName = user?.firstName ?? "";
        const lastName = user?.lastName ?? "";
        return `${firstName} ${lastName}`;
      },
    },
    {
      name: "Assigned Branches",
      sortable: true,
      cell: (row: Record) => getAssignedBranches(row),
    },
    {
      name: "Action",
      sortable: true,
      cell: (row: Record) => (
        <div className="flex space-x-2">
          <PencilSquareIcon
            className="cursor-pointer text-primary size-8"
            onClick={() => editModalShow(row)}
          />
          <TrashIcon
            className="text-[#A30D11] size-8 cursor-pointer"
            onClick={() => deleteModalShow(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full px-4 pt-4 bg-graybg dark:bg-blackbg sm:px-10 md:px-10 lg:px-30 xl:px-30">
      <div className="w-full h-auto rounded-lg drop-shadow-lg md:mr-4">
        <div className="flex flex-col w-full overflow-x-auto bg-white rounded-lg">
          <h1 className="pl-4 sm:pl-[30px] !text-[24px] text-left py-4 text-primary font-bold mr-2 underline decoration-2 underline-offset-8">
            Area Manager
          </h1>
          <div className="flex items-end justify-end mx-2 bg-white">
            <div>
              <button
                className="bg-primary text-white rounded-[12px] p-2"
                onClick={openModal}
              >
                + Create New
              </button>
            </div>
          </div>
          <div className="relative w-2/12 my-2 sm:mx-0 md:mx-4">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full py-2 pl-10 pr-3 bg-white border border-black rounded-md"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                placeholder="Search Area Manager"
              />
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-black transform -translate-y-1/2 pointer-events-none left-3 top-1/2" />
            </div>
          </div>
          {loading ? (
            <table className="table" style={{ background: "white" }}>
              <thead>
                <tr>
                  <th
                    className="w-[80px] py-6"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    ID
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>Name</th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    Assigned Branches
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td className="w-full border border-gray-200" colSpan={4}>
                      <div className="flex justify-center">
                        <div className="flex flex-col w-full gap-4">
                          <div className="w-full h-12 skeleton bg-slate-300"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <DataTable
              columns={columns}
              data={filteredAreaManager}
              pagination
              striped
              noDataComponent={
                filteredAreaManager.length === 0 ? (
                  <p className="flex flex-col items-center justify-center h-64">
                    {filterTerm
                      ? "No " + `"${filterTerm}"` + " found"
                      : "No data available."}
                  </p>
                ) : (
                  <ClipLoader color="#36d7b7" />
                )
              }
              customStyles={{
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
                    color: "black",
                    backgroundColor: "#E7F1F9",
                  },
                  stripedStyle: {
                    color: "black",
                    backgroundColor: "#FFFFFF",
                  },
                },
              }}
            />
          )}
        </div>
      </div>
      <AddAreaManagerModal
        refreshData={refreshData}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        openCompleteModal={openCompleteModal}
        entityType="Area Manager"
      />
      <DeleteModal
        refreshData={refreshData}
        onDelete={deleteUser}
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Area Manager"
      />
      <DeleteSuccessModal
        showDeleteSuccessModal={showDeletedSuccessModal}
        closeDeleteSuccessModal={closeDeleteSuccessModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Area Manager"
      />
      <CompleteModal
        showCompleteModal={showCompleteModal}
        closeCompleteModal={closeCompleteModal}
        openCompleteModal={openCompleteModal}
        entityType="Area Manager"
      />
      <EditAreaManager
        closeSuccessModal={closeSuccessModal}
        refreshData={refreshData}
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="Area Manager"
        selectedUser={selectedUser || null}
        openCompleteModal={null}
        closeModal={null}
        modalIsOpen={false}
        areaManagerId={0}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        openSuccessModal={openSuccessModal}
        entityType="Area Manager"
      />
    </div>
  );
};

export default authenticatedPage(SetupAreaManager, true, true, true);
