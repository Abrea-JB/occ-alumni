import { create } from "zustand";
import axiosConfig from "~/utils/axiosConfig";
import { PER_PAGE } from '~/utils/constant'

const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export const useSubjectStore = create((set) => ({
    isSubmit: false,
    isClear: false,
    visible: false,
    isClear: false,
    shouldClearForm: false,
    perPage: PER_PAGE,
    students: [],
    editData: null,
    addSY: false,
    page: 0,
    search: '',
    setField: (key, value) => set(() => ({ [key]: value })),
    storeSubject: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("store-subject", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
}));
