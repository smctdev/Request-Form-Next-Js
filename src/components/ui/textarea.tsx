export default function Textarea({ ...props }: any) {
  return (
    <textarea
      {...props}
      className="h-24 rounded-lg textarea textarea-bordered focus:outline-none focus:ring-1 focus:border-primary w-full"
    ></textarea>
  );
}
