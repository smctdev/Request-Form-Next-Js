export default function Select({ children, ...props }: any) {
  return (
    <select
      {...props}
      className="w-full select bg-gray-50 focus:outline-none focus:ring-1 focus:border-primary"
    >
      {children}
    </select>
  );
}
