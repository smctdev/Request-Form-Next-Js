export default function Textarea({ ...props }: any) {
  return (
    <textarea
      {...props}
      className="min-h-24 rounded-lg textarea textarea-bordered max-h-42 focus:outline-none focus:ring-1 focus:border-primary w-full"
    ></textarea>
  );
}
