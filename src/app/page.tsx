"use client";

import NavbarHome from "@/components/navbar-home";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import Logo from "../../public/assets/logo.png";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import guestPage from "@/lib/guestPage";
import { api } from "@/lib/api";
import { feedbackData } from "@/constants/form-data";
import { FeedbackData } from "@/types/form-data";

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
              <div className="p-8 overflow-hidden bg-white shadow-md md:w-1/2 rounded-xl">
                <h2 className="mb-6 !text-2xl font-bold text-primary">
                  Help Make the System Better
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={handleChange("name")}
                      placeholder="Full Name"
                    />
                    {error?.name && (
                      <small className="text-red-500 !text-sm">
                        {error?.name[0]}
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Email Address</span>
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
                      <span className="label-text">Phone Number</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      placeholder="Phone Number"
                    />
                    {error?.phone && (
                      <small className="text-red-500 !text-sm">
                        {error?.phone[0]}
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Department Name</span>
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
                      <span className="label-text">Select a Opinion</span>
                    </label>
                    <div className="space-y-2">
                      <Select
                        value={formData.opinion}
                        onChange={handleChange("opinion")}
                      >
                        <option value="" disabled>
                          Select a opinion
                        </option>
                        <option value="Report a Bug">Report a Bug</option>
                        <option value="Improve the User Interface">
                          Improve the User Interface
                        </option>
                        <option value="Improve Performance">
                          Improve Performance
                        </option>
                        <option value="Request a Feature">
                          Request a Feature
                        </option>
                        <option value="other">Other Suggestions</option>
                      </Select>
                      {error?.opinion && (
                        <small className="text-red-500 !text-sm">
                          {error?.opinion[0]}
                        </small>
                      )}
                      <Input
                        type={formData.opinion === "other" ? "text" : "hidden"}
                        placeholder="Other Suggestions"
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
                      <span className="label-text">Message</span>
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
                <div className="p-8 overflow-hidden bg-white shadow-md rounded-xl">
                  <h2 className="mb-4 !text-2xl font-bold text-primary">
                    Why Choose SMCT?
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="p-2 mr-4 rounded-full bg-secondary">
                        <svg
                          className="w-5 h-5 text-primary"
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
                      <span className="text-gray-700">
                        Industry-leading expertise across multiple sectors
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-2 mr-4 rounded-full bg-secondary">
                        <svg
                          className="w-5 h-5 text-primary"
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
                      <span className="text-gray-700">
                        Proven track record of successful projects
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-2 mr-4 rounded-full bg-secondary">
                        <svg
                          className="w-5 h-5 text-primary"
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
                      <span className="text-gray-700">
                        Customer-centric approach
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-2 mr-4 rounded-full bg-secondary">
                        <svg
                          className="w-5 h-5 text-primary"
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
                      <span className="text-gray-700">
                        Competitive pricing and transparent processes
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-8 overflow-hidden text-white shadow-md bg-primary rounded-xl">
                  <h2 className="mb-4 !text-2xl font-bold">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-4 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                      <span>(+63) 912 3456 789</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-4 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span>it@strongmotocentrum.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-4 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <span>J.A Clarin Cogon St., Tagbilaran City</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 text-white bg-primary">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center rounded-full">
                    <Image
                      src={Logo}
                      alt="logo"
                      height={100}
                      width={100}
                    ></Image>
                  </div>
                  <h2 className="text-lg font-bold">SMCT Group of Companies</h2>
                </div>
                <p className="mt-2 text-sm">
                  © {new Date().getFullYear()} All Rights Reserved
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="transition hover:text-secondary">
                  Privacy Policy
                </a>
                <a href="#" className="transition hover:text-secondary">
                  Terms of Service
                </a>
                <a href="#" className="transition hover:text-secondary">
                  Careers
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default guestPage(Home);
