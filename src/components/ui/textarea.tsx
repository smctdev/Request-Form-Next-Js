export default function Textarea({ ...props }: any) {
  return (
    <textarea
      {...props}
      className="h-24 textarea textarea-bordered bg-gray-50 focus:outline-none focus:ring-1 focus:border-primary w-full"
    ></textarea>
  );
}
