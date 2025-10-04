export default function SubmittedSuccess({
  successMessage,
  setSubmitted,
}: any) {
  return (
    <div className="max-w-fit p-8 mx-auto overflow-hidden text-center bg-base-100 shadow-md rounded-xl">
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
      <h2 className="mb-4 !text-2xl font-bold text-primary">Thank You!</h2>
      <p className="text-gray-700 font-bold !text-xl">
        {successMessage?.feedback_code}
      </p>
      <p className="mb-6 text-gray-600">{successMessage?.message}</p>
      <button onClick={() => setSubmitted(false)} className="btn btn-primary">
        Submit Another Feedback
      </button>
    </div>
  );
}
