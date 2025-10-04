export default function Input({ ...props }: any) {
  return (
    <input {...props} className="w-full h-14 rounded-md input input-bordered focus:outline-none border border-gray-200 focus:ring-1 focus:border-primary" />
  );
}
