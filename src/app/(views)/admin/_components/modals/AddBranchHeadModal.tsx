import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

type User = {
  user: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    branch_code: string;
    email: string;
    role: string;
    contact: string;
    position: string;
  };
};

type Branch = {
  id: number;
  branch: string;
  branch_code: string;
};

const AddBranchHeadModal = ({
  modalIsOpen,
  closeModal,
  openCompleteModal,
  entityType,
  refreshData,
}: {
  modalIsOpen: boolean;
  closeModal: any;
  openCompleteModal: any;
  entityType: string;
  refreshData: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsWaiting(true);
      try {
        const response = await api.get(`/get-all-branch-heads`);

        const transformedData = response.data.data.map((item: any) => ({
          id: item.user.id,
          name: item.user.fullName,
          branch_code: item.user.branch_code,
          email: item.user.email,
          role: item.user.role.trim(),
          position: item.user.position,
        }));

        setUsers(transformedData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      } finally {
        setLoading(false);
        setIsWaiting(false);
      }
    };

    if (modalIsOpen) {
      fetchUsers();
    }
  }, [modalIsOpen]);

  useEffect(() => {
    const fetchBranches = async () => {
      setIsWaiting(true);
      try {
        const response = await api.get(
          `/view-branch/${selectedUser.id}/view-branch-not-in-branch-head`
        );

        setBranches(response.data.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setError("Failed to fetch branches");
        setBranches([]);
      } finally {
        setIsWaiting(false);
      }
    };

    if (selectedUser) {
      fetchBranches();
    } else {
      setBranches([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    // Check if at least one branch is selected
    setIsButtonVisible(selectedBranches.length > 0);
  }, [selectedBranches]);

  const handleCheckboxChange = (id: number) => {
    if (selectedBranches.includes(id)) {
      setSelectedBranches(
        selectedBranches.filter((branchId) => branchId !== id)
      );
    } else {
      setSelectedBranches([...selectedBranches, id]);
    }
  };

  const handleConfirmSelection = async () => {
    if (selectedUser && selectedBranches.length > 0) {
      setIsLoading(true);

      try {
        // Example of POST request to add branch head with selectedBranches
        const postData = {
          user_id: selectedUser.id,
          branch_id: selectedBranches, // Ensure this is an array of branch IDs
        };

        const response = await api.post(`/create-branch-head`, postData);
        // Assuming successful, close modal or show success message
        setIsLoading(false);
        closeModal();
        openCompleteModal(); // Implement your completion modal or alert
        setSelectedUser(null);
        setSelectedBranches([]);
        refreshData(); // Refresh parent data if needed
      } catch (error: any) {
        console.error("Error creating branch head:", error);
        setIsLoading(false);
        // Handle error state or show error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
      }
    } else {
      // Handle case where user or branches are not selected
      console.warn("Please select a user and at least one branch.");
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setSelectedBranches([]);
    closeModal();
  };

  const handleSelectAnotherBranchHead = () => {
    setSelectedUser(null);
    setSelectedBranches([]);
  };

  if (!modalIsOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black/50 z-50">
      <div className="p-4 w-10/12 sm:w-1/3 relative bg-primary flex justify-center mx-20 border-b rounded-t-[12px]">
        <h2 className="text-center text-xl md:text-[32px] font-bold text-white">
          Add {entityType}
        </h2>
        <XMarkIcon
          className="absolute text-black cursor-pointer size-6 right-3"
          onClick={handleCancel}
        />
      </div>
      <div className="relative w-10/12 overflow-y-auto bg-white sm:w-1/3 x-20 h-2/3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ClipLoader size={35} color={"#389df1"} loading={loading} />
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">
            <ClipLoader size={35} color={"#123abc"} />
          </div>
        ) : (
          <div>
            {selectedUser ? (
              <div className="bg-white flex-col w-10/12 sm:w-full h-1/2 rounded-b-[12px] shadow-lg p-2 bottom-4 right-4 flex space-x-2">
                <div className="flex justify-between items-center">
                  <h3 className="p-4 text-lg font-bold">
                    Branches for {`${selectedUser.name} `}:
                  </h3>
                  <button
                    type="button"
                    onClick={handleSelectAnotherBranchHead}
                    className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                  >
                    Select another branch head
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search branches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 mb-2 bg-white border border-black rounded-md "
                />
                <div className="px-4">
                  {isWaiting ? (
                    <>
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between mb-2 bg-blue-100"
                        >
                          <div className="flex items-center justify-between w-full p-4">
                            <div className="w-full space-y-2">
                              <p className="skeleton bg-slate-200 h-6 w-45"></p>
                              <p className="skeleton bg-slate-200 h-6 w-26"></p>
                            </div>
                            <div className="h-6 w-6">
                              <p className="skeleton bg-slate-200 h-6 w-6"></p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : branches.length === 0 ? (
                    <ClipLoader size={35} color={"#123abc"} loading={loading} />
                  ) : (
                    branches
                      .filter((branch) => {
                        const branchName = branch.branch.toLowerCase();
                        const branchCode = branch.branch_code.toLowerCase();
                        const query = searchQuery.toLowerCase();
                        return (
                          branchName.includes(query) ||
                          branchCode.includes(query)
                        );
                      })
                      .map((branch) => (
                        <div
                          key={branch.id}
                          className="flex items-center justify-between mb-2 bg-blue-100"
                        >
                          <div className="flex items-center justify-between w-full p-4">
                            <div>
                              <p>{branch.branch}</p>
                              <p>{branch.branch_code}</p>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                checked={selectedBranches.includes(branch.id)}
                                onChange={() => handleCheckboxChange(branch.id)}
                                className="mx-1 text-blue-500 cursor-pointer size-5"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="px-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isWaiting ? (
                        <>
                          {Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index}>
                              <td colSpan={3} className="text-center p-2">
                                <p className="skeleton bg-slate-200 h-10 w-full"></p>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : users.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan={3} className="text-center">
                              No users found
                            </td>
                          </tr>
                        </>
                      ) : (
                        users.map((user: any) => (
                          <tr
                            key={user.id}
                            className={`cursor-pointer hover:bg-gray-200  ${
                              selectedUser === user.id ? "bg-blue-200" : ""
                            }`}
                            onClick={() => setSelectedUser(user)}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {user.id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {`${user.name}`}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {user.email}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {isButtonVisible ? (
        <div className="bg-white w-10/12 sm:w-1/3 rounded-b-[12px] shadow-lg p-2 bottom-4 right-4 justify-end flex space-x-2">
          <button
            onClick={handleCancel}
            className="h-12 px-4 py-2 font-bold text-white bg-gray-500 rounded cursor-pointer hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            className="h-12 px-4 py-2 font-bold text-white rounded cursor-pointer hover:bg-blue-400 bg-primary"
          >
            {isLoading ? <ClipLoader color="#36d7b7" /> : "Add Branch Head"}
          </button>
        </div>
      ) : (
        <div className="bg-white w-10/12 sm:w-1/3 rounded-b-[12px] shadow-lg p-2 bottom-4 right-4 flex justify-end space-x-2" />
      )}
    </div>
  );
};
export default AddBranchHeadModal;
