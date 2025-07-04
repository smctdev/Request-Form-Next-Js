"use client";

import Navbar from "@/components/layouts/navbar";
import Sidebar2 from "@/components/layouts/sidebar2";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Modal from "../ui/modal";
import SetupSignature from "../setup-signature";
import SignatureCanvas from "react-signature-canvas";
import { api } from "@/lib/api";
import Swal from "sweetalert2";

const BaseContent = ({ children }: any) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<any>(false);
  const [signature, setSignature] = useState<SignatureCanvas | null | any>(
    null
  );
  const { user, isLoading, updateProfile, isAuthenticated } = useAuth();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const pathname = usePathname();

  const isGuest =
    pathname === "/login" ||
    pathname === "/registration" ||
    pathname === "/" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/print");

  if (isGuest) return <>{children}</>;

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSubmitSignature = async () => {
    setIsSubmit(true);
    if (!signature) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please add signature first before saving.",
      });
      setIsSubmit(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("signature", signature);
      const response = await api.post("/update-signature", formData);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.data?.message,
        });
        updateProfile();
        document.body.style.overflow = "unset";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={!isLoading && !user?.signature && isAuthenticated}
        title="Setup Signature"
        handleSubmit={handleSubmitSignature}
        isLoading={isSubmit}
      >
        <SetupSignature signatureProps={setSignature} />
      </Modal>
      <div className="relative flex w-full h-screen white">
        <div
          className={`h-full fixed ${
            isSidebarVisible ? "block" : "hidden"
          } md:block z-30 text-black`}
        >
          <Sidebar2
            darkMode={false}
            role={user?.role}
            isSidebarVisible={isSidebarVisible}
            toggleSidebar={toggleSidebar}
            open={isSidebarVisible}
          />
        </div>
        <div
          className={`flex-1 flex-col w-full transition-all duration-300 ml-0 ${
            isSidebarVisible ? "md:ml-60 ml-20" : "md:ml-20 ml-0"
          }`}
        >
          <Navbar
            darkMode={false}
            toggleDarkMode={() => {}}
            toggleSidebar={toggleSidebar}
            currentPage={pathname.replace(/\//g, " ")}
            isSidebarVisible={isSidebarVisible}
          />
          <div className="flex-1 w-full text-black bg-gray">{children}</div>
        </div>
      </div>
    </>
  );
};

export default BaseContent;
