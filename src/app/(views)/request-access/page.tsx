"use client";

import authenticatedPage from "@/lib/authenticatedPage";
import RequestAccess from "./_components/RequestAccess";
import { useAuth } from "@/context/AuthContext";
import RequestAccessCard from "./_components/RequestAccessCard";
import { useState } from "react";

const RequestAccessPage = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const { user, updateProfile } = useAuth();

  const requestAccess = user?.request_access;

  const handleRequestAgain = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="p-10">
      <div className="mt-5">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-5">
          {requestAccess && !isFormOpen ? (
            <RequestAccessCard
              requestAccess={requestAccess}
              handleRequestAgain={handleRequestAgain}
              updateProfile={updateProfile}
            />
          ) : (
            <>
              <RequestAccess
                updateProfile={updateProfile}
                handleRequestAgain={handleRequestAgain}
                user={user}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default authenticatedPage(RequestAccessPage);
