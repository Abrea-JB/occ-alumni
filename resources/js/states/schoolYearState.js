

import create from "zustand";
import { createSYAction } from "~/actions/schoolYearActions";
import { PER_PAGE } from '~/utils/constant'

export const useSchoolYearStore = create((set, get) => ({
    isSubmit: false,
    createSY: false,
    isClear: false,
    perPage: PER_PAGE,
    editSY: null,
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setEdit: (value) => set((state) => ({ editSY: value })),
    setCreateSY: (value) => set((state) => ({ createSY: value })),
    createNewSY: async (params) => {
        return  await createSYAction({ params });
    },
}));
