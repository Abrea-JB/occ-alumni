import create from "zustand";
import { addRatingConceptPaperAction } from "~/actions/facultiesActions";
import { PER_PAGE } from '~/utils/constant';

export const useFacultyDashboardStore = create((set, get) => ({
    isSubmit: false,
    addRating: false,
    isClear: false,
    perPage: PER_PAGE,
    defenseSchedID:null,
    facultyPanelID:null,
    panelRating:null,
    thesisID:null,
    ratingLength:null,
    totalFacultyRating:null,
    addRatingConceptPaperForm:false,
    defenseThesisDetailsID:false,
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setDefenseSchedID: (value) => set((state) => ({ defenseSchedID: value })),
    setFacultyPanelID: (value) => set((state) => ({ facultyPanelID: value })),
    setPanelRating: (value) => set((state) => ({ panelRating: value })),
    setAddRatingConceptPaperForm: (value) => set((state) => ({ addRatingConceptPaperForm: value })),
    setCreateDepartment: (value) => set((state) => ({ createDepartment: value })),
    setThesisID: (value) => set((state) => ({ thesisID: value })),
    setRatingLength: (value) => set((state) => ({ ratingLength: value })),
    setTotalFacultyRating: (value) => set((state) => ({ totalFacultyRating: value })),
    setDefenseThesisDetailsID: (value) => set((state) => ({ defenseThesisDetailsID: value })),
    addRatingConceptPaper: async (params) => {
        return  await  addRatingConceptPaperAction({ params });
    },
}));
