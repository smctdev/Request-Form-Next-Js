export default function Storage(url: string) {
  return `${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${url}`;
}