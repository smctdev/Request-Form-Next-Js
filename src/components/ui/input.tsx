export default function Input({ ...props }: any) {
  return (
    <input {...props} className="w-full bg-gray-100 h-14 rounded-md input input-bordered focus:outline-none focus:ring-1 focus:border-primary" />
  );
}
