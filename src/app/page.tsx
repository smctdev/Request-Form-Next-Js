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

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    setSubmitted(true);
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
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Request Our Services
            </h1>
            <p className="max-w-2xl mx-auto text-xl">
              Complete the form below to get in touch with SMCT Group of
              Companies. Our team will respond promptly.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="container flex-grow px-4 py-12 mx-auto">
          {submitted ? (
            <div className="max-w-2xl p-8 mx-auto overflow-hidden text-center bg-white shadow-md rounded-xl">
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
              <h2 className="mb-4 text-2xl font-bold text-primary">
                Thank You!
              </h2>
              <p className="mb-6 text-gray-600">
                Your request has been submitted successfully. Our team will
                contact you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-primary"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="p-8 overflow-hidden bg-white shadow-md md:w-1/2 rounded-xl">
                <h2 className="mb-6 !text-2xl font-bold text-primary">
                  Request Form
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Address</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Department Name</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Department Name"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Service Needed</span>
                    </label>
                    <Select value={formData.service} onChange={handleChange}>
                      <option value="" disabled>
                        Select a service
                      </option>
                      <option value="consulting">Business Consulting</option>
                      <option value="construction">Construction</option>
                      <option value="logistics">Logistics</option>
                      <option value="technology">Technology Solutions</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Message</span>
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <div className="pt-4 form-control">
                    <button type="submit" className="w-full btn btn-primary">
                      Submit Request
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
                      <span>+1 (123) 456-7890</span>
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
                      <span>info@smctgroup.com</span>
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
                      <span>
                        123 Business Ave, Suite 500, New York, NY 10001
                      </span>
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
