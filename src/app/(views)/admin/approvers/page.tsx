"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { ClipLoader } from "react-spinners";
import AddApproverModal from "@/app/(views)/admin/_components/modals/AddApproverModal";
import DeleteModal from "@/app/(views)/admin/_components/modals/DeleteModal";
import DeleteSuccessModal from "@/app/(views)/admin/_components/ui/DeleteSucessModal";
import CompleteModal from "@/app/(views)/admin/_components/ui/CompleteModal";
import EditUserModal from "@/app/(views)/admin/_components/modals/EditUserModal";
import ViewApproverModal from "@/app/(views)/admin/_components/modals/ViewApproverModal";
import { useAuth } from "@/context/AuthContext";
import authenticatedPage from "@/lib/authenticatedPage";

type Props = {};

type Record = {
  user_id: string;
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  branch_code: string;
  branch: string;
  email: string;
  role: string;
  contact: string;
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

const SetupApprover = (props: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeletedSuccessModal, setShowDeletedSuccessModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Record | null>(null);
  const [approverList, setApproverList] = useState<Record[]>([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchMap, setBranchMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
    const fetchApproverData = async () => {
      if (!user.id) {
        console.error("User ID is missing");
        return;
      }
      try {
        const response = await api.get(`/view-approvers`);

        // Transform data to match columns selector
        const transformedData = response.data.data.map(
          (item: Record, index: number) => ({
            id: item.id,
            name: `${item.firstName} ${item.lastName}`, // Combine firstname and lastname
            branch_code: item.branch_code,
            email: item.email,
            role: item.role,
            user_id: item.user_id,
            branch: item.branch,
          })
        );

        setApproverList(transformedData);
      } catch (error) {
        console.error("Error fetching approvers data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApproverData();
  }, [user.id]);
  const filteredApproverlist = approverList.filter((approver) =>
    Object.values(approver).some((value) =>
      String(value).toLowerCase().includes(filterTerm.toLowerCase())
    )
  );
  const refreshData = async () => {
    try {
      const response = await api.get(`/view-approvers`);

      // Transform data to match columns selector
      const transformedData = response.data.data.map(
        (item: Record, index: number) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`, // Combine firstname and lastname
          branch_code: item.branch_code,
          email: item.email,
          role: item.role,
          branch: item.branch,
          user_id: item.user_id,
        })
      );

      setApproverList(transformedData);
    } catch (error) {
      console.error("Error fetching approvers data:", error);
    }
  };
  const viewModalShow = (row: Record) => {
    setSelectedUser(row);
    setViewModalIsOpen(true);
  };

  const viewModalClose = () => {
    setSelectedUser(null);
    setViewModalIsOpen(false);
  };

  const deleteModalShow = (row: Record) => {
    setSelectedUser(row);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
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

  const openDeleteSuccessModal = () => {
    setShowDeletedSuccessModal(true);
    setDeleteModal(false);
  };

  const closeDeleteSuccessModal = () => {
    setShowDeletedSuccessModal(false);
  };
  const deleteUser = async () => {
    if (!user.id || !selectedUser) {
      console.error("User ID or selected user is missing");
      return;
    }
    try {
      const response = await api.delete(`/delete-approver/${selectedUser.id}`);

      if (response.data.status) {
        closeDeleteModal();
        openDeleteSuccessModal();
        refreshData();
      } else {
        console.error("Failed to delete user:", response.data.message);
        // Handle error scenario, show error message or alert
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error scenario, show error message or alert
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row: Record) => row.name,
      sortable: true,
    },
    {
      name: "Assigned Branches ",
      sortable: true,
      selector: (row: any) => row.branch.branch_code,
    },
    {
      name: "Action",
      sortable: true,
      cell: (row: Record) => (
        <div className="flex space-x-2">
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
            Approver
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
                placeholder="Search approvers"
              />
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-black transform -translate-y-1/2 pointer-events-none left-3 top-1/2" />
            </div>
          </div>
          {loading ? (
            <table className="table" style={{ background: "white" }}>
              <thead>
                <tr>
                  <th
                    className="py-6"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    Name
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    Assigned Branches
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td className="w-full border border-gray-200" colSpan={3}>
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
              data={filteredApproverlist}
              pagination
              striped
              customStyles={tableCustomStyles}
              noDataComponent={
                filteredApproverlist.length === 0 ? (
                  <p className="flex flex-col items-center justify-center h-64">
                    {filterTerm
                      ? "No " + `"${filterTerm}"` + " found"
                      : "No data available."}
                  </p>
                ) : (
                  <ClipLoader color="#36d7b7" />
                )
              }
            />
          )}
        </div>
      </div>
      <AddApproverModal
        refreshData={refreshData}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        openCompleteModal={openCompleteModal}
        entityType="Approver"
      />
      <DeleteModal
        refreshData={refreshData}
        onDelete={deleteUser}
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Approver"
      />
      <DeleteSuccessModal
        showDeleteSuccessModal={showDeletedSuccessModal}
        closeDeleteSuccessModal={closeDeleteSuccessModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Approver"
      />
      <CompleteModal
        showCompleteModal={showCompleteModal}
        closeCompleteModal={closeCompleteModal}
        openCompleteModal={openCompleteModal}
        entityType="Approver"
      />
      <EditUserModal
        refreshData={refreshData}
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="Approver"
        selectedUser={selectedUser || null}
      />
      <ViewApproverModal
        modalIsOpen={viewModalIsOpen}
        closeModal={viewModalClose}
        user={selectedUser || null}
      />
    </div>
  );
};

export default authenticatedPage(SetupApprover, true, true, true);
