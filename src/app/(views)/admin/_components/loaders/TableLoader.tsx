import { tr } from "date-fns/locale";

export default function TableLoader({ colSpan, tableHeads }: any) {
  return (
    <table className="table">
      <thead>
        <tr>
          {tableHeads.map((item: any, index: number) => (
            <th
              key={index}
              className="w-[80px] py-6 uppercase"
              style={{ color: "black", fontWeight: "500" }}
            >
              {item}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index}>
            <td className="w-full border border-gray-200 p-2" colSpan={colSpan}>
              <div className="flex justify-center">
                <div className="flex flex-col w-full gap-4">
                  <div className="w-full h-12 skeleton bg-slate-300"></div>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
