import { PagingResult } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PaginationState = {
  pagination: PagingResult;
  setPagination: (totalCount: number) => void;
  setPage: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
};

const usePaginationStore = create<PaginationState>()(
  devtools(
    (set) => ({
      pagination: {
        pageNumber: 1,
        pageSize: 12,
        totalCount: 0,
        totalPages: 1,
      },

      setPagination: (totalCount: number) =>
        set((state) => {
          const totalPages = Math.max(
            1,
            Math.ceil(totalCount / state.pagination.pageSize)
          );
          return {
            pagination: {
              ...state.pagination,
              pageNumber: 1,
              totalCount,
              totalPages,
            },
          };
        }),

      setPage: (pageNumber: number) =>
        set((state) => {
          const { totalPages } = state.pagination;
          const nextPage = Math.min(Math.max(1, pageNumber), totalPages);
          return { pagination: { ...state.pagination, pageNumber: nextPage } };
        }),

      setPageSize: (pageSize: number) =>
        set((state) => {
          const totalPages = Math.max(
            1,
            Math.ceil(state.pagination.totalCount / pageSize)
          );
          return {
            pagination: {
              ...state.pagination,
              pageSize,
              pageNumber: 1,
              totalPages,
            },
          };
        }),
    }),
    { name: "paginationStoreDemo" }
  )
);

export default usePaginationStore;
