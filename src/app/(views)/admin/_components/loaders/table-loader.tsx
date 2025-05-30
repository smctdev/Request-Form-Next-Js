export default function TableLoader() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          <td className="w-full border border-gray-200 p-2" colSpan={7}>
            <div className="flex justify-center">
              <div className="flex flex-col w-full gap-4">
                <div className="w-full h-12 skeleton bg-slate-300"></div>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
