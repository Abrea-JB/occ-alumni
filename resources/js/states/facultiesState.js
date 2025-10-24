import create from "zustand";
import { createFacultiesAction, uploadFileAction, updateGroupAction } from "~/actions/facultiesActions";
import { PER_PAGE } from '~/utils/constant'

export const useFacultiesStore = create((set, get) => ({
    page: 0,
    isSubmit: false,
    uploadDoc: false,
    isClear: false,
    isGroup: false,
    perPage: PER_PAGE,
    students: [],
    details: null,
    editFaculty:null,
    setPage: (value) => set((state) => ({ page: value })),
    setClear: (value) => set((state) => ({ isClear: value })),
    setUploadDoc: (value) => set((state) => ({ uploadDoc: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setDetails :(value) => set((state) => ({ details: value })),
    setCreateStudent: (value) => set((state) => ({ createStudent: value })),
    setEdit: (value) => set((state) => ({ editFaculty: value })),
    search: '',
    setSearch: (value) => set((state) => ({ search: value })),
    createNewFaculty: async (params) => {
        return  await createFacultiesAction({ params });
    },
    uploadFile: async (params) => {
        return  await uploadFileAction({ params });
    },
    updateGroup: async (params) => {
        return  await updateGroupAction({ params });
    },
    setGroup: (value) => set((state) => ({ isGroup: value })),
    image:null,
    setImage: (value) => set((state) => ({ image: value })),
}));
