import { useEffect, useRef, useState } from "react";
import { PaginationType } from "../_types/pagination";
import { paginationData } from "../_constants/pagination";
import { api } from "@/lib/api";

export default function useFetch({ url }: { url: string }) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationType>(paginationData);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchDebounce = useRef<any>(null);

  useEffect(() => {
    setPagination((pagination) => ({
      ...pagination,
      loading: true,
    }));
    const fetchAllData = async () => {
      try {
        const response = await api.get(url, {
          params: {
            page: pagination?.current_page,
            per_page: pagination?.per_page,
            search: searchTerm,
          },
        });
        setData(response.data.data);
        setPagination((pagination) => ({
          ...pagination,
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setPagination((pagination) => ({
          ...pagination,
          loading: false,
        }));
      }
    };
    fetchAllData();
  }, [pagination?.current_page, pagination?.per_page, isRefresh, searchTerm]);

  const handleSearch = () => (e: any) => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);

    const { value } = e.target;

    searchDebounce.current = setTimeout(() => {
      setSearchTerm(value);
    }, 1000);
  };

  return {
    data,
    setData,
    isLoading,
    setIsLoading,
    pagination,
    setPagination,
    isRefresh,
    setIsRefresh,
    searchTerm,
    handleSearch,
  };
}
