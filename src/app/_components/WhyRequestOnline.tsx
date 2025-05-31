import contents from "@/data/contents.json";

export default function WhyRequestOnline() {
  return (
    <div className="p-8 overflow-hidden bg-white shadow-md rounded-xl">
      <h2 className="mb-4 !text-2xl font-bold text-primary">
        Why Choose Request Form Online?
      </h2>
      <ul className="space-y-4">
        {contents.map((item, index) => (
          <li className="flex items-start" key={index}>
            <div className="w-10 h-10 flex items-center justify-center mr-4 rounded-full bg-secondary">
              <span className="text-primary font-bold w-10 text-center">
                {index + 1}
              </span>
            </div>
            <span className="text-gray-700 font-semibold">{item.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
