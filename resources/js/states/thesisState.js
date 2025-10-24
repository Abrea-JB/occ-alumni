import create from "zustand";
import {
    storeCommentsAction,
    storeCommentsHiglights,
} from "~/actions/facultiesActions";
import {
    createThesisAction,
    createSYAction,
    createThesisTitleAction,
    uploadFileAction,
    updatePanelAction,
    updateThesisGroupAction,
    saveInlineComment,
    deleteInlineComment,
    saveScreenRecord,
} from "~/actions/thesisActions";
import { PER_PAGE } from "~/utils/constant";

export const useThesisStore = create((set, get) => ({
    visibleThesis: false,
    addContent: false,
    capturing: false,
    loading: false,
    isComment: false,
    imageCrop: null,
    imageEdited: null,
    comment: "",
    crop: {
        unit: "%", // Can be 'px' or '%'
        x: 10,
        y: 9,
        width: 81,
        height: 50,
    },
    thesisID: null,
    docID: null,
    thesisDetail: null,
    addTitle: false,
    addSY: false,
    isSubmit: false,
    isClear: false,
    perPage: PER_PAGE,
    page: 0,
    uploadDoc: false,
    isDetails: false,
    details: null,
    title: false,
    group: false,
    formPanel: false,
    isSaveComment: false,
    scheduleDetails: null,
    faculties: null,
    setPage: (value) => set((state) => ({ page: value })),
    setTitle: (value) => set((state) => ({ title: value })),
    setGroup: (value) => set((state) => ({ group: value })),
    setVisibleThesis: (value) => set((state) => ({ visibleThesis: value })),
    setimageCrop: (value) => set((state) => ({ imageCrop: value })),
    setimageCropped: (value) => set((state) => ({ imageCrop: value })),
    setCrop: (value) => set((state) => ({ crop: value })),
    setImageEdited: (value) => set((state) => ({ imageEdited: value })),
    setAddContent: (value) => set((state) => ({ addContent: value })),
    setCapturing: (value) => set((state) => ({ capturing: value })),
    setComment: (value) => set((state) => ({ comment: value })),
    setIsComment: (value) => set((state) => ({ isComment: value })),
    setThesisID: (value) => set((state) => ({ thesisID: value })),
    setFaculties: (value) => set((state) => ({ faculties: value })),
    saveComment: async (params) => {
        return await storeCommentsAction({ params });
    },
    storeHighLightPdf: async (params) => {
        return await storeCommentsHiglightsActions({ params });
    },
    setLoading: (value) => set((state) => ({ loading: value })),
    createNewThesis: async (params) => {
        return await createThesisAction({ params });
    },
    setAddSY: (value) => set((state) => ({ addSY: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    createNewSY: async (params) => {
        return await createSYAction({ params });
    },
    setClear: (value) => set((state) => ({ isClear: value })),
    setUploadDoc: (value) => set((state) => ({ uploadDoc: value })),
    setTitle: (value) => set((state) => ({ title: value })),
    setIsDetails: (value) => set((state) => ({ isDetails: value })),
    setDetails: (value) => set((state) => ({ details: value })),
    setSubmitComment: (value) => set((state) => ({ isSaveComment: value })),
    setDocId: (value) => set((state) => ({ docID: value })),
    setThesisDetails: (value) => set((state) => ({ thesisDetail: value })),
    createThesisTitle: async (params) => {
        return await createThesisTitleAction({ params });
    },
    uploadFile: async (params) => {
        return await uploadFileAction({ params });
    },
    setFormPanel: (value) => set((state) => ({ formPanel: value })),
    setScheduleDetails: (value) => set((state) => ({ scheduleDetails: value })),
    updatePanel: async (params) => {
        return await updatePanelAction({ params });
    },
    filterBy: null,
    setFilterBy: (value) => set((state) => ({ filterBy: value })),
    isSchedule: null,
    setIsSchedule: (value) => set((state) => ({ isSchedule: value })),
    updateThesisGroup: async (params) => {
        return await updateThesisGroupAction({ params });
    },
    saveInlineComment: async (params) => {
        return await saveInlineComment({ params });
    },
    deleteInlineComment: async (params) => {
        return await deleteInlineComment({ params });
    },
    isEditedCrop: false,
    setIsEditedCrop: (value) => set((state) => ({ isEditedCrop: value })),
    editedCrop: null,
    setEditedCrop: (value) => set((state) => ({ editedCrop: value })),
    screenRecord: false,
    setScreenRecord: (value) => set((state) => ({ screenRecord: value })),
    screenRecordDetails: false,
    setScreenRecordDetails: (value) => set((state) => ({ screenRecordDetails: value })),
    videoData: false,
    setVideoData: (value) => set((state) => ({ videoData: value })),
    recordData: null,
    setRecordData: (value) => set((state) => ({ recordData: value })),
    saveScreenRecord: async (params) => {
        return await saveScreenRecord({ params });
    },
}));
