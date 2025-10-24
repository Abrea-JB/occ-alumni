import { create } from 'zustand'
import axiosConfig from "~/utils/axiosConfig";

const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const useSettingsStore = create((set) => ({
    isSubmit: false,
    isClear: false,
    formClassroom: false,
    formStudent: false,
    attendanceDetails: false,
    attendanceCurrent: null,
    classID: null,
    classroom: null,
    setField: (key, value) => set(() => ({ [key]: value })),
    updateSettings: async (params) => {
        await delay(1000);
        return axiosConfig
            .patch("update-settings", params)
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

export default useSettingsStore;
