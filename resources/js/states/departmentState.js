import create from "zustand";
import { createDepartmentAction } from "~/actions/departmetnActions";
import { PER_PAGE } from '~/utils/constant'

export const useDepartmentStore = create((set, get) => ({
    isSubmit: false,
    createDepartment: false,
    isClear: false,
    perPage: PER_PAGE,
    page: 0,
    setPage: (value) => set((state) => ({ page: value })),
    editDepartment: null,
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setEdit: (value) => set((state) => ({ editDepartment: value })),
    setCreateDepartment: (value) => set((state) => ({ createDepartment: value })),
    search: '',
    setSearch: (value) => set((state) => ({ search: value })),
    createNewDepartment: async (params) => {
        return  await createDepartmentAction({ params });
    },
}));
