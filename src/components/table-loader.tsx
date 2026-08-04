export default function TableLoader() {
  return (
    <div className="flex flex-col gap-2 w-full p-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton h-14 w-full" key={index}></div>
      ))}
    </div>
  );
}
