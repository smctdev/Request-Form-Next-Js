import { FormEvent, useState } from "react";
import { FormType } from "../_types/formType";
import { formData } from "../_constants/formInput";
import { api } from "@/lib/api";
import Swal from "sweetalert2";

export default function RequestAccess({
  updateProfile,
  handleRequestAgain,
}: any) {
  const [formInput, setFormInput] = useState<FormType>(formData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | { [key: string]: string }>(null);

  const handleChange = (title: string) => (e: any) => {
    const { value } = e.target;

    setFormInput((formInput) => ({
      ...formInput,
      [title]: value,
    }));
  };

  function handleSwal({
    response,
    title,
    icon,
  }: {
    response: string;
    title: string;
    icon: "success" | "error" | "warning" | "info" | "question" | undefined;
  }) {
    return Swal.fire({
      icon: icon,
      title: title,
      text: response,
      confirmButtonText: "Close",
      confirmButtonColor: "#007bff",
    });
  }

  const handleSubmit = () => async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/request-access", formInput);
      if (response.status === 201) {
        handleSwal({
          response: `${response.data.message}. (${response.data.code})`,
          title: "Success",
          icon: "success",
        });
        setError(null);
        setFormInput(formData);
        updateProfile();
        handleRequestAgain();
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
      if (error.response.status === 405) {
        handleSwal({
          response: error.response.data,
          title: "Error",
          icon: "error",
        });
        handleRequestAgain();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-lg">
      <div className="bg-blue-500 rounded-t-lg p-5">
        <h1 className="!text-3xl text-center font-bold text-gray-100">
          Request Access
        </h1>
        <p className="mt-4 text-gray-200 text-center">
          Please fill out the form below to request access to our service.
        </p>
      </div>
      <form
        className="space-y-4 mx-auto p-10 bg-white rounded-b-lg shadow-sm border-gray-200 border"
        onSubmit={handleSubmit()}
      >
        <div className="form-control">
          <label className="label" htmlFor="access-type">
            <span className="label-text font-semibold">
              Request Access Type <span className="text-red-500">*</span>
            </span>
          </label>
          <select
            className="select select-bordered w-full cursor-pointer bg-gray-100 h-14 focus:outline-none focus:ring-1 focus:ring-blue-500"
            id="access-type"
            value={formInput.request_access_type}
            onChange={handleChange("request_access_type")}
          >
            <option disabled value="">
              Select an option
            </option>
            <option value="admin_access">Admin Access</option>
            <option value="approver_access">Approver Access</option>
          </select>
          {error?.request_access_type && (
            <small className="text-red-500">
              {error?.request_access_type[0]}
            </small>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="message">
            <span className="label-text font-semibold">
              Message <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            value={formInput.message}
            onChange={handleChange("message")}
            className="textarea textarea-bordered h-24 w-full bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            id="message"
            placeholder="Please enter your message"
          ></textarea>
          {error?.message && (
            <small className="text-red-500">{error?.message[0]}</small>
          )}
        </div>

        <hr className="border-t border-gray-300 mt-6" />

        <div className="pt-2 space-y-1">
          <button
            className="bg-blue-500 p-2 rounded text-white w-full hover:bg-blue-400 flex items-center justify-center gap-1"
            type="submit"
          >
            {isLoading ? (
              <>
                <span className="loading"></span> <span>Submitting...</span>
              </>
            ) : (
              "Submit Request"
            )}
          </button>
          <button
            className="bg-gray-500 p-2 rounded text-white hover:bg-gray-400 w-full"
            type="button"
            onClick={handleRequestAgain}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
