export default function Select({ children, ...props }: any) {
  return (
    <select
      {...props}
      className="w-full select h-14 rounded-md focus:outline-none focus:ring-1 focus:border-primary"
    >
      {children}
    </select>
  );
}
