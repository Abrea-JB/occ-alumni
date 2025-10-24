import create from "zustand";
import {
    createStudentAction,
    createThesisTitleAction,
    uploadFileAction,
} from "~/actions/studentActions";
import { PER_PAGE } from "~/utils/constant";
import { delay } from "~/utils/helper";
import axiosConfig from "~/utils/axiosConfig";

const useStudentStore = create((set) => ({
    isSubmit: false,
    createStudent: false,
    isClear: false,
    perPage: PER_PAGE,
    students: [],
    editStudent: null,
    data: [],
    value: undefined,
    thesisDetail: null,
    title: false,
    uploadDoc: false,
    filterBy: null,
    setField: (key, value) => set(() => ({ [key]: value })),
    setFilterBy: (value) => set((state) => ({ filterBy: value })),
    setTitle: (value) => set((state) => ({ title: value })),
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setEdit: (value) => set((state) => ({ editStudent: value })),
    setCreateStudent: (value) => set((state) => ({ createStudent: value })),
    setThesisDetails: (value) => set((state) => ({ thesisDetail: value })),
    setUploadDoc: (value) => set((state) => ({ uploadDoc: value })),
    createThesisTitle: async (params) => {
        return await createThesisTitleAction({ params });
    },
    createNewStudent: async (params) => {
        await delay(1000);
        let formData = new FormData();
        formData.append("email", params?.email);
        formData.append("fname", params?.fname);
        formData.append("lname", params?.lname);
        formData.append("image", params?.image);
        formData.append("attendance_profile", params?.attendance_profile);
        formData.append("lname", params?.lname);
        formData.append("mname", params?.mname);
        formData.append("phone", params?.phone);
        formData.append("student_id", params?.student_id);
        formData.append("college_id", params?.college_id);
        formData.append("department_id", params?.department_id);
        formData.append("id", params?.id || "");
        formData.append("user_id", params?.user_id || "");
        return axiosConfig
            .post("students", formData)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "UnknownuseStudentStore error",
            }));
    },
    image: null,
    imageProfile: null,
    setImage: (value) => set((state) => ({ image: value })),
    setProfile: (value) => set((state) => ({ imageProfile: value })),
    page: 0,
    setPage: (value) => set((state) => ({ page: value })),
    importStudents: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("students/save-import", params)
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

export default useStudentStore;
