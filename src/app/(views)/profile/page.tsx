"use client";

import React, { useState, useEffect, useRef } from "react";
import Avatar2 from "@/assets/avatar.png";
import ClipLoader from "react-spinners/ClipLoader";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import PropogateLoader from "react-spinners/PropagateLoader";
import SignatureCanvas from "react-signature-canvas";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Image from "next/image";
import authenticatedPage from "@/lib/authenticatedPage";
import { FaCamera } from "react-icons/fa";
import fullnameAcronym from "@/utils/fullnameAcronym";
import Storage from "@/utils/storage";

interface Branch {
  branch: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  branch_code: string;
  contact: string;
  signature: string;
  userName: string;
  profile_picture: string;
  position: string;
  branch: Branch;
}

const Profile = ({ isdarkMode }: { isdarkMode: boolean }) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setChangePasswordLoading] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [branchList, setBranchList] = useState<
    { id: number; branch_code: string }[]
  >([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [signatureEmpty, setSignatureEmpty] = useState(false);
  const [signature, setSignature] = useState<SignatureCanvas | null>(null);
  const [signatureButton, setSignatureButton] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [signatureError, setSignatureError] = useState("");
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [signatureSuccess, setSignatureSuccess] = useState(false);
  const [loadingChange, setLoading] = useState(false);
  const { user, isLoading, updateProfile } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await api.get(`/view-branch`);
        const branches = response.data.data;
        const branchOptions = branches.map(
          (branch: { id: number; branch_code: string }) => ({
            id: branch.id,
            branch_code: branch.branch_code,
          })
        );
        setBranchList(branchOptions);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    fetchBranchData();
  }, []);

  useEffect(() => {
    if (signature) {
      signature.toDataURL("image/png");
    }
  }, [signature]);

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signature?.clear();
  };
  const handleChangePassword = async () => {
    setErrorMessage("");
    try {
      setChangePasswordLoading(true);
      if (newPassword !== confirmNewPassword) {
        setErrorMessage("The new password fields confirmation does not match.");
        setChangePasswordLoading(false);
        return;
      }

      const response = await api.put(`/change-password/${user.id}`, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password changed successfully",
        confirmButtonText: "Close",
        confirmButtonColor: "#007bff",
      });
      // alert("Password changed successfully");
      setChangePasswordLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowCurrent(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      setChangePasswordLoading(false);
      console.error(
        "Failed to change password:",
        error.response?.data?.message || error.response.data.error
      );
      setErrorMessage(
        error.response?.data?.message || error.response.data.error
      );
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSignatureButton(false);
    setShouldRefresh(true); // Set to true to trigger data refetch
    router.replace("/profile");
  };
  const closeSignatureSuccess = () => {
    setSignatureSuccess(false);
    setShouldRefresh(true); // Set to true to trigger data refetch
    router.replace("/profile");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return (
      <>
        <div className="w-full h-full px-4 py-4 md:px-10 lg:px-30">
          <div className="flex flex-col w-full px-4 py-12 bg-white rounded-lg md:px-8 lg:px-10 xl:px-12">
            <div className="flex flex-col items-center justify-center rounded-lg lg:flex-row">
              <div className="flex flex-col items-start w-full px-4 text-left md:px-10">
                <div className="flex flex-col items-center lg:flex-row md:items-start">
                  <div className="border-4 border-blue-300 rounded-full bg-slate-300 skeleton w-44 h-44"></div>
                  <div className="flex flex-col mt-4 ml-2">
                    <h1 className="w-56 h-8 mb-3 text-lg font-bold skeleton bg-slate-300 md:text-xl lg:text-2xl"></h1>
                    <div>
                      <p className="h-4 mb-3 cursor-pointer w-36 text-primary skeleton bg-slate-300"></p>
                      <input type="file" className="hidden" />
                    </div>
                    <p className="w-40 h-4 italic font-semibold text-black skeleton bg-slate-300"></p>
                  </div>
                </div>

                <h1 className="h-8 my-5 text-lg font-semibold md:text-xl w-44 lg:text-2xl skeleton bg-slate-300"></h1>
                <div className="grid w-full grid-cols-1 gap-4 lg:gap-6">
                  <div className="flex flex-col">
                    <p className="w-32 h-4 mt-2 mb-2 text-gray-400 skeleton bg-slate-300"></p>
                    <p className="p-2 font-medium border rounded-md skeleton h-9 bg-slate-300"></p>
                  </div>
                  <div className="flex flex-col">
                    <p className="w-32 h-4 mt-2 mb-2 text-gray-400 skeleton bg-slate-300"></p>
                    <p className="p-2 font-medium border rounded-md skeleton h-9 bg-slate-300"></p>
                  </div>
                  <div className="flex flex-col">
                    <p className="w-32 h-4 mt-2 mb-2 text-gray-400 skeleton bg-slate-300"></p>
                    <p className="p-2 font-medium border rounded-md skeleton h-9 bg-slate-300"></p>
                  </div>
                  <div className="flex flex-col">
                    <p className="w-32 h-4 mt-2 mb-2 text-gray-400 skeleton bg-slate-300"></p>
                    <p className="p-2 font-medium border rounded-md skeleton h-9 bg-slate-300"></p>
                  </div>
                </div>
              </div>

              <div className="w-full mt-4 md:mt-0 md:px-10">
                <h1 className="h-8 my-8 text-lg font-semibold w-44 md:text-xl lg:text-2xl skeleton bg-slate-300"></h1>
                <p className="w-32 h-4 mt-2 mb-2 text-gray-400 skeleton bg-slate-300"></p>
                <div className="relative flex items-center w-full">
                  <input
                    type="password"
                    className="w-full h-10 p-2 rounded-lg skeleton bg-slate-300"
                  />
                </div>
                <p className="w-32 h-4 mt-2 mb-2 text-gray-400 skeleton bg-slate-300"></p>
                <div className="relative flex items-center w-full">
                  <input
                    type="password"
                    className="w-full h-10 p-2 rounded-lg skeleton bg-slate-300"
                  />
                </div>
                <p className="w-32 h-4 mt-2 mb-2 text-gray-400 skeleton bg-slate-300"></p>
                <div className="relative flex items-center w-full">
                  <input
                    type="password"
                    className="w-full h-10 p-2 rounded-lg skeleton bg-slate-300"
                  />
                </div>
                <button className="flex items-center justify-center w-full h-12 mt-4 text-white rounded-lg skeleton bg-primary"></button>
              </div>

              <div className="flex flex-col w-full mb-4 md:w-1/2">
                <p className="w-10 h-4 mb-2 text-base lg:text-lg skeleton bg-slate-300"></p>
                <div className="flex items-center justify-center overflow-hidden">
                  <div className="w-full border skeleton bg-slate-300 h-28"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error === "User not authenticated") {
    return <div>User not authenticated. Please log in.</div>;
  }

  const saveInfo = async () => {
    if (!newProfilePic) {
      console.error("No profile picture selected.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", newProfilePic);

    try {
      setChangePasswordLoading(true);
      const response = await api.post(
        `/upload-profile-pic/${user.id}`,
        formData
      );

      if (response.data.status) {
        await updateProfile();
      } else {
        throw new Error(
          response.data.message || "Failed to upload profile picture"
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to upload profile picture:",
        error.response?.data?.message || error.message
      );
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const profilePictureUrl = newProfilePic
    ? URL.createObjectURL(newProfilePic) // Create a temporary URL for the new profile picture
    : user?.profile_picture
    ? `${
        process.env.NEXT_PUBLIC_API_STORAGE_URL
      }/${user.profile_picture.replace(/\\/g, "/")}`
    : Avatar2;
  const onSubmit = async () => {
    setLoading(true);
    setSubmitting(true);
    try {
      const formData = new FormData();

      // Ensure profile picture is a File object before appending
      if (newProfilePic) {
        formData.append("profile_picture", newProfilePic);
      } else {
        console.error("Profile picture is missing");
        setSubmitting(false);
        return;
      }

      const response = await api.post(
        `/update-profilepic/${user.id}`,
        formData
      );
      if (response.status === 200) {
        await updateProfile();
        setSubmitting(false);
        setShowSuccessModal(true);
        setNewProfilePic(null);
        setProfileError(null);
      }
    } catch (error: any) {
      console.error(
        "Failed to update profile picture:",
        error.response?.data || error.message
      );
      setProfileError(error.response?.data.message);
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };
  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureImage = signatureRef.current.toDataURL();
      // You can save signatureImage or set it to a form field for submission
    }
  };
  const signatureIsEmpty = () => {
    if (signature && signature.isEmpty && signature.isEmpty()) {
      setSignatureEmpty(true);
      return true;
    }
    return false;
  };
  const handleSaveSignature = async () => {
    setSignatureLoading(true);
    try {
      // Send the data URL to the backend API

      if (signature && !signature.isEmpty()) {
        const signatureDataURL = signature.toDataURL();
        const response = await api.post(
          `/update-signature/${user.id}`, // Ensure the URL is correct
          { signature: signatureDataURL },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setSignatureSuccess(true);
          setSignatureError("");
          updateProfile();
        }
      } else {
        setSignatureLoading(false);
        setSignatureError("Please add signature first before saving.");
      }
    } catch (error) {
      console.error("Error saving signature:", error); // Log any errors
    } finally {
      setSignatureLoading(false);
    }
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewProfilePic(file); // Store the selected file in state
  };
  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 lg:p-12">
      <div className="bg-white rounded-box shadow-lg p-4 md:p-8 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="avatar relative">
                <div className="w-40 rounded-full ring ring-primary ring-offset-gray-100 ring-offset-2">
                  {user?.profile_picture || newProfilePic ? (
                    <Image
                      width={160}
                      height={160}
                      alt="profile"
                      src={profilePictureUrl}
                      className="rounded-full"
                    />
                  ) : (
                    fullnameAcronym({
                      fullName: user?.fullName,
                      width: "w-40",
                      height: "h-40",
                      textSize: "!text-7xl",
                    })
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="absolute bottom-2 right-2 btn btn-circle btn-sm btn-primary"
                >
                  <FaCamera className="!text-lg" />
                  <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleProfilePicUpload}
                  />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h1 className="!text-2xl md:text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="!text-lg italic font-semibold text-gray-600">
                  {user.position}
                </p>
              </div>
            </div>

            {profileError && (
              <div className="alert alert-error">
                <span>{profileError}</span>
              </div>
            )}

            <div className="space-y-6">
              <h2 className="!text-2xl font-bold text-gray-800">
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Email
                  </span>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Branch Code
                  </span>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 font-medium">
                      {user.branch.branch_code}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Contact
                  </span>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 font-medium">{user.contact}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Username
                  </span>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 font-medium">{user.userName}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Branch Name
                  </span>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 font-medium">
                      {user.branch?.branch}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {newProfilePic && (
              <button
                className={`btn btn-primary w-full mt-4 ${
                  loadingChange ? "!bg-blue-300 !text-white" : ""
                }`}
                disabled={loadingChange}
                onClick={onSubmit}
              >
                {loadingChange ? "Uploading..." : "Upload Profile Picture"}
              </button>
            )}
          </div>

          <div className="space-y-8">
            <div className="card bg-gray-100 shadow">
              <div className="card-body">
                <h2 className="card-title !text-lg">Change Password</h2>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      className="input input-bordered w-full bg-gray-100"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      value={currentPassword}
                      placeholder="Enter your current password"
                    />
                    <button
                      className="absolute right-3 top-3"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? (
                        <EyeSlashIcon className="size-5" />
                      ) : (
                        <EyeIcon className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full bg-gray-100"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                    />
                    <button
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="size-5" />
                      ) : (
                        <EyeIcon className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="input input-bordered w-full bg-gray-100"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm your new password"
                    />
                    <button
                      className="absolute right-3 top-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="size-5" />
                      ) : (
                        <EyeIcon className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="alert alert-error mt-2">
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="card-actions justify-end mt-4">
                  <button
                    className={`p-2 rounded-md bg-primary text-white hover:bg-blue-500 w-full ${
                      loading || !currentPassword
                        ? "!cursor-not-allowed bg-blue-300"
                        : ""
                    }`}
                    disabled={!currentPassword || loading}
                    onClick={handleChangePassword}
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-gray-100 shadow">
              <div className="card-body">
                <h2 className="card-title !text-lg">Signature</h2>

                {user?.signature ? (
                  <div className="relative border rounded-box overflow-hidden">
                    <Image
                      width={300}
                      height={150}
                      src={Storage(user?.signature) || ""}
                      className="w-full h-48 object-contain bg-gray-100"
                      alt="signature"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-gray-400 opacity-30 rotate-[-12deg] text-xl font-bold whitespace-nowrap">
                        SMCT Group of Companies • SMCT Group of Companies • SMCT
                        Group of Companies
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <SignatureCanvas
                      penColor="black"
                      ref={(ref) => setSignature(ref)}
                      canvasProps={{
                        className:
                          "sigCanvas border rounded-box w-full h-48 bg-white",
                      }}
                      velocityFilterWeight={0.7} // Reduces stringy effect (default: 0.7)
                      minWidth={1.5} // Minimum stroke width
                      maxWidth={2.5} // Maximum stroke width
                      throttle={10} // Reduces points for smoother lines
                      dotSize={1.5}
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={(e) => handleClear(e)}
                        className="p-2 bg-gray-500 text-white hover:bg-gray-400 rounded-md"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSignature}
                        className={`p-2 bg-blue-500 text-white hover:bg-blue-400 rounded-md ${
                          signatureLoading ? "loading" : ""
                        }`}
                        disabled={signatureLoading}
                      >
                        {signatureLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </>
                )}

                {signatureError && (
                  <div className="alert alert-error mt-2">
                    <span>{signatureError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black/50 z-50 ">
          <div className="relative flex flex-col items-center justify-center w-1/4 bg-white rounded-md ">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="absolute !size-20 text-primary -top-6 "
            />
            <div>
              <h1 className="mt-20 text-[28px] font-bold text-center">
                Success
              </h1>
              <p className="font-semibold text-center text-gray-400 my-7">
                User information updated!
              </p>
            </div>
            <div className="flex items-center justify-center w-full p-4 rounded-b-lg bg-graybg">
              <button
                type="button"
                className=" bg-primary p-2 w-1/2 rounded-[12px] text-white font-extrabold cursor-pointer"
                onClick={closeSuccessModal}
              >
                OKAY
              </button>
            </div>
          </div>
        </div>
      )}
      {signatureSuccess && (
        <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black/50 z-50 ">
          <div className="relative flex flex-col items-center justify-center w-1/4 bg-white rounded-md ">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="absolute !size-20 text-primary -top-6 "
            />
            <div>
              <h1 className="mt-20 text-[28px] font-bold text-center">
                Success
              </h1>
              <p className="font-semibold text-center text-gray-400 my-7">
                Signature Added!
              </p>
            </div>
            <div className="flex items-center justify-center w-full p-4 rounded-b-lg bg-graybg">
              <button
                className=" bg-primary p-2 w-1/2 rounded-[12px] text-white font-extrabold hover:bg-blue-400"
                onClick={closeSignatureSuccess}
              >
                OKAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default authenticatedPage(Profile);
