"use client";

import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { feedbackData } from "@/constants/formData";
import { FeedbackData } from "@/types/formData";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

export default function Form({ setSubmitted, setSuccessMessage }: any) {
  const [formData, setFormData] = useState<FeedbackData>(feedbackData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.length === 0) {
      setFormData(feedbackData);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      name: user?.fullName,
      email: user?.email,
      phone: user?.contact,
      department: user?.branch?.branch_name,
    }));
    setIsSubmitted(false);
  }, [user, isSubmitted]);

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
        setIsSubmitted(true);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
          confirmButtonText: "Close",
        });
      }
    } catch (error: any) {
      console.error("Error sending feedback:", error);
      setError(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-8 overflow-hidden shadow-md rounded-xl bg-base-100 h-fit shadow-gray-300">
      <h2 className="mb-6 !text-2xl font-bold text-primary">
        Help Make the System Better
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span>
              Full Name <span className="text-error">*</span>
            </span>
          </label>
          <Input
            type="text"
            value={formData?.name}
            onChange={handleChange("name")}
            placeholder="Full Name (e.g. Juan Dela Cruz)"
          />
          {error?.name && (
            <small className="text-error !text-sm">{error?.name[0]}</small>
          )}
        </div>

        <div>
          <label className="label">
            <span>
              Email Address <span className="text-error">*</span>
            </span>
          </label>
          <Input
            type="email"
            value={formData?.email}
            onChange={handleChange("email")}
            placeholder="Email Address"
          />
          {error?.email && (
            <small className="text-error !text-sm">{error?.email[0]}</small>
          )}
        </div>

        <div>
          <label className="label">
            <span>Phone Number (optional)</span>
          </label>
          <Input
            type="number"
            value={formData?.phone}
            onChange={handleChange("phone")}
            placeholder="Phone Number (optional)"
          />
          {error?.phone && (
            <small className="text-error !text-sm">{error?.phone[0]}</small>
          )}
        </div>

        <div>
          <label className="label">
            <span>
              Department Name <span className="text-error">*</span>
            </span>
          </label>
          <Input
            type="text"
            value={formData?.department}
            onChange={handleChange("department")}
            placeholder="Department Name"
          />
          {error?.department && (
            <small className="text-error !text-sm">
              {error?.department[0]}
            </small>
          )}
        </div>

        <div>
          <label className="label">
            <span>
              Select a Opinion <span className="text-error">*</span>
            </span>
          </label>
          <div className="space-y-2">
            <Select
              value={formData?.opinion}
              onChange={handleChange("opinion")}
            >
              <option value="" disabled>
                Select a opinion
              </option>
              <option value="Report a Bug">Report a Bug</option>
              <option value="Improve the User Interface">
                Improve the User Interface
              </option>
              <option value="Improve Performance">Improve Performance</option>
              <option value="Request a Feature">Request a Feature</option>
              <option value="other">Other Opinion</option>
            </Select>
            {error?.opinion && (
              <small className="text-error !text-sm">
                {error?.opinion[0]}
              </small>
            )}
            <Input
              type={formData?.opinion === "other" ? "text" : "hidden"}
              placeholder="Other Opinion"
              value={formData?.other_opinion}
              onChange={handleChange("other_opinion")}
            />
            {error?.other_opinion && (
              <small className="text-error !text-sm">
                {error?.other_opinion[0]}
              </small>
            )}
          </div>
        </div>

        <div>
          <label className="label">
            <span>
              Message <span className="text-error">*</span>
            </span>
          </label>
          <Textarea
            value={formData?.message}
            onChange={handleChange("message")}
            placeholder="Tell us about your experience..."
          />
          {error?.message && (
            <small className="text-error !text-sm">{error?.message[0]}</small>
          )}
        </div>

        <div className="pt-4 form-control">
          <button
            type="submit"
            className={`${
              isLoading && "!bg-blue-300 !cursor-not-allowed"
            } w-full btn btn-primary`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
