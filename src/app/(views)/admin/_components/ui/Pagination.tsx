export default function Pagination({
  pagination,
  setPagination,
  isLoading,
}: any) {
  const isFirstPage = pagination?.current_page === 1;
  const isLastPage = pagination?.current_page === pagination?.last_page;
  const isPaginationShown = !isFirstPage || !isLastPage;

  return (
    <div className={`flex justify-between ${isLoading && "hidden"}`}>
      {pagination?.total > 10 && (
        <div className="p-2 flex gap-1 items-center">
          <span className="text-gray-600 font-bold">Show: </span>
          <select
            className="select select-bordered w-full max-w-xs bg-gray-200"
            value={pagination?.per_page}
            onChange={(e) =>
              setPagination((pagination: any) => ({
                ...pagination,
                per_page: parseInt(e.target.value),
              }))
            }
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="70">70</option>
            <option value="80">80</option>
            <option value="90">90</option>
            <option value="100">100</option>
            <option value="150">150</option>
            <option value="200">200</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </select>
        </div>
      )}
      <div
        className={`join !bg-transparent !my-2 p-2 ${
          (isLoading || !isPaginationShown) && "hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (pagination?.loading) return null;
            setPagination((pagination: any) => ({
              ...pagination,
              current_page: pagination?.current_page - 1,
            }));
          }}
          className="join-item btn !bg-gray-200 !border !border-gray-300"
          disabled={isFirstPage}
        >
          «
        </button>
        <button className="join-item btn !bg-gray-200 !border !border-gray-300">
          Page {pagination?.current_page} of {pagination?.last_page}
        </button>
        <button
          type="button"
          onClick={() => {
            if (pagination?.loading) return null;
            setPagination((pagination: any) => ({
              ...pagination,
              current_page: pagination?.current_page + 1,
            }));
          }}
          className="join-item btn !bg-gray-200 !border !border-gray-300"
          disabled={isLastPage}
        >
          »
        </button>
      </div>
    </div>
  );
}
