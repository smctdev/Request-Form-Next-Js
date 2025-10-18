"use client";

import NavbarHome from "@/components/layouts/NavbarHome";
import Faqs from "./_components/faqs";
import WhySmct from "./_components/WhyRequestOnline";
import ContactInfo from "./_components/ContactInfo";
import SubmittedSuccess from "./_components/SubmittedSuccess";
import Form from "./_components/Form";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import guestPage from "@/lib/guestPage";

const Home = () => {
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<any>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;
  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <NavbarHome />
      <section className="py-16 text-white bg-gradient-to-r from-primary to-secondary">
        <div className="container px-4 mx-auto text-center">
          <h1 className="mb-4 font-bold md:!text-5xl">
            Help Us Improve the System
          </h1>
          <p className="max-w-2xl mx-auto !text-xl">
            Please feel free to send us your feedback about the system so we can
            continue to improve and better meet your needs.
          </p>
        </div>
      </section>
      <main className="container flex-grow px-4 py-12 mx-auto">
        {submitted ? (
          <SubmittedSuccess
            successMessage={successMessage}
            setSubmitted={setSubmitted}
          />
        ) : (
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="space-y-8 md:w-1/2">
              <Form
                setSubmitted={setSubmitted}
                setSuccessMessage={setSuccessMessage}
              />
              <ContactInfo />
            </div>

            <div className="space-y-8 md:w-1/2">
              <Faqs />
              <WhySmct />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default guestPage(Home);
