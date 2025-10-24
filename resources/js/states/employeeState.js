import create from "zustand";
import { createEmployeeAction } from "~/actions/employeeActions";
import { PER_PAGE } from '~/utils/constant'

export const useEmployeeStore = create((set, get) => ({
    isSubmit: false,
    createEmployee: false,
    isClear: false,
    perPage: PER_PAGE,
    employess: [],
    editEmployee: null,
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setEdit: (value) => set((state) => ({ editEmployee: value })),
    setCreateEmployee: (value) => set((state) => ({ createEmployee: value })),
    createNewEmployee: async (params) => {
        return  await createEmployeeAction({ params });
    },
}));
