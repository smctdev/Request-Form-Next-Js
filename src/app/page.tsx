"use client";

import NavbarHome from "@/components/navbar-home";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import Head from "next/head";
import { useState } from "react";
import guestPage from "@/lib/guestPage";
import { api } from "@/lib/api";
import { feedbackData } from "@/constants/form-data";
import { FeedbackData } from "@/types/form-data";
import Faqs from "./_components/faqs";
import WhySmct from "./_components/why-smct";
import ContactInfo from "./_components/contact-info";

const Home = () => {
  const [formData, setFormData] = useState<FeedbackData>(feedbackData);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<any>(null);

  const handleChange = (title: string) => (e: any) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/send-feedback", formData);

      if (response.status === 201) {
        setFormData(feedbackData);
        setSubmitted(true);
        setError(null);
        setSuccessMessage(response.data);
      }
    } catch (error: any) {
      console.error("Error sending feedback:", error);
      setError(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-theme="smct">
      <Head>
        <title>SMCT Group of Companies | Request Form</title>
        <meta
          name="description"
          content="Submit your request to SMCT Group of Companies"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <NavbarHome />
        {/* Hero Section */}
        <section className="py-16 text-white bg-gradient-to-r from-primary to-blue-800">
          <div className="container px-4 mx-auto text-center">
            <h1 className="mb-4 font-bold md:!text-5xl">
              Help Us Improve the System
            </h1>
            <p className="max-w-2xl mx-auto text-xl">
              Please feel free to send us your feedback about the system so we
              can continue to improve and better meet your needs.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="container flex-grow px-4 py-12 mx-auto">
          {submitted ? (
            <div className="max-w-fit p-8 mx-auto overflow-hidden text-center bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-secondary">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="mb-4 !text-2xl font-bold text-primary">
                Thank You!
              </h2>
              <p className="text-gray-700 font-bold !text-xl">
                {successMessage?.feedback_code}
              </p>
              <p className="mb-6 text-gray-600">{successMessage?.message}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-primary"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="p-8 overflow-hidden bg-white shadow-md md:w-1/2 rounded-xl h-fit">
                <h2 className="mb-6 !text-2xl font-bold text-primary">
                  Help Make the System Better
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">
                        Full Name <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={handleChange("name")}
                      placeholder="Full Name (e.g. Juan Dela Cruz)"
                    />
                    {error?.name && (
                      <small className="text-red-500 !text-sm">
                        {error?.name[0]}
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">
                        Email Address <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      placeholder="Email Address"
                    />
                    {error?.email && (
                      <small className="text-red-500 !text-sm">
                        {error?.email[0]}
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">
                        Phone Number (optional)
                      </span>
                    </label>
                    <Input
                      type="number"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      placeholder="Phone Number (optional)"
                    />
                    {error?.phone && (
                      <small className="text-red-500 !text-sm">
                        {error?.phone[0]}
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">
                        Department Name <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Input
                      type="text"
                      value={formData.department}
                      onChange={handleChange("department")}
                      placeholder="Department Name"
                    />
                    {error?.department && (
                      <small className="text-red-500 !text-sm">
                        {error?.department[0]}
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">
                        Select a Opinion <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <div className="space-y-2">
                      <Select
                        value={formData.opinion}
                        onChange={handleChange("opinion")}
                      >
                        <option value="" disabled>
                          Select a opinion
                        </option>
                        <option value="Report a Bug">
                          Report a Bug <span className="text-red-500">*</span>
                        </option>
                        <option value="Improve the User Interface">
                          Improve the User Interface
                        </option>
                        <option value="Improve Performance">
                          Improve Performance
                        </option>
                        <option value="Request a Feature">
                          Request a Feature
                        </option>
                        <option value="other">
                          Other Opinion <span className="text-red-500">*</span>
                        </option>
                      </Select>
                      {error?.opinion && (
                        <small className="text-red-500 !text-sm">
                          {error?.opinion[0]}
                        </small>
                      )}
                      <Input
                        type={formData.opinion === "other" ? "text" : "hidden"}
                        placeholder="Other Opinion"
                        value={formData.other_opinion}
                        onChange={handleChange("other_opinion")}
                      />
                      {error?.other_opinion && (
                        <small className="text-red-500 !text-sm">
                          {error?.other_opinion[0]}
                        </small>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">
                        Message <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={handleChange("message")}
                      placeholder="Tell us about your experience..."
                    />
                    {error?.message && (
                      <small className="text-red-500 !text-sm">
                        {error?.message[0]}
                      </small>
                    )}
                  </div>

                  <div className="pt-4 form-control">
                    <button
                      type="submit"
                      className={`${
                        isLoading && "!bg-blue-300 cursor-not-allowed"
                      } w-full btn btn-primary`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-8 md:w-1/2">
                <Faqs />
                <WhySmct />
                <ContactInfo />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default guestPage(Home);
