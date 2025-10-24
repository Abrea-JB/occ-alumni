import create from "zustand";
import { createStudentAction } from "~/actions/studentActions";
import { createGroupAction, createGroupAccountAction } from "~/actions/groupActions";
import { PER_PAGE } from '~/utils/constant'

export const useGroupStore = create((set, get) => ({
    isSubmit: false,
    isGroup: false,
    isClear: false,
    page: 0,
    totalCount: 0,
    perPage: PER_PAGE,
    students: [],
    editData: null,
    addAccount: false,
    groupDetails: null,
    search: '',
    setSearch: (value) => set((state) => ({ search: value })),
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setEdit: (value) => set((state) => ({ editData: value })),
    setGroup: (value) => set((state) => ({ isGroup: value })),
    setAddAccount: (value) => set((state) => ({ addAccount: value })),
    setGroupDetails: (value) => set((state) => ({ groupDetails: value })),
    setTotalCount: (value) => set((state) => ({ totalCount: value })),
    createNewGroup: async (params) => {
        return  await createGroupAction({ params });
    },
    createGroupAccount: async (params) => {
        return  await createGroupAccountAction({ params });
    },
    searchStudents: async (params) => {
        return  await searchStudents({ params });
    },
}));
