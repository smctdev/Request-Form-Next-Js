export default function CreateApproverCheckers({
  isOpen,
  isLoadingApproverCheckers,
  approverOptions,
  checkerOptions,
  formInputs,
  errors,
  handleChange,
  handleSubmit,
  categories,
  isLoadingSubmit,
  handleOpenModal,
  error,
  handleResetChecker,
}: any) {
  return (
    <dialog className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg!">Add Approver Checkers</h3>
        <div className="flex space-y-4 flex-col border-t border-gray-300 py-5">
          <div>
            <label htmlFor="approver">Select approver</label>
            {isLoadingApproverCheckers ? (
              <div className="skeleton h-12 w-full"></div>
            ) : (
              <select
                value={formInputs.approver}
                onChange={handleChange("approver")}
                className="select w-full select-lg"
              >
                <option disabled={true} value="">
                  Select approver
                </option>
                {approverOptions}
              </select>
            )}
            {errors?.approver && (
              <small className="text-red-500 text-xs!">
                {errors?.approver[0]}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="checker">Select checker</label>
            {isLoadingApproverCheckers ? (
              <div className="skeleton h-12 w-full"></div>
            ) : (
              <select
                value={formInputs.checker}
                onChange={handleChange("checker")}
                className="select w-full select-lg"
              >
                <option disabled={true} value="">
                  Select checker
                </option>
                {checkerOptions}
              </select>
            )}
            {errors?.checker && (
              <small className="text-red-500 text-xs!">
                {errors?.checker[0]}
              </small>
            )}
            {formInputs.checker && (
              <button
                onClick={handleResetChecker}
                className="btn btn-xs btn-primary mt-1"
                type="button"
              >
                Empty checker
              </button>
            )}
          </div>
          <div>
            <label htmlFor="checker_category">Select category</label>
            {isLoadingApproverCheckers ? (
              <div className="skeleton h-12 w-full"></div>
            ) : (
              <select
                value={formInputs.checker_category}
                onChange={handleChange("checker_category")}
                className="select w-full select-lg"
              >
                <option disabled={true} value="">
                  Select category
                </option>
                {categories?.map(
                  (
                    { title, value }: { title: string; value: string },
                    index: number
                  ) => (
                    <option key={index} value={value}>
                      {title}
                    </option>
                  )
                )}
              </select>
            )}
            {errors?.checker_category && (
              <small className="text-red-500 text-xs!">
                {errors?.checker_category[0]}
              </small>
            )}
          </div>
          {error && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button type="button" onClick={handleOpenModal} className="btn">
              Close
            </button>
          </form>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleOpenModal}>
          close
        </button>
      </form>
    </dialog>
  );
}
