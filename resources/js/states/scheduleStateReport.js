import create from "zustand";
import {  } from "~/actions/collegeActions";
import { PER_PAGE } from '~/utils/constant'

export const useScheduleReportStore = create((set, get) => ({
    isSubmit: false,
    isClear: false,
    perPage: PER_PAGE,
    visibleDetails: false,
    details:null,
    schedID:null,
    reportDetails:null,
    panelRating:null,
    ratingLength:null,
    totalFacultyRating:null,
    proponents:null,
    thesisTitle:null,
    totalPanel:null,
    perPage: PER_PAGE,
    page: 0,
    groupList: [],
    setGroupList: (value) => set((state) => ({ groupList: value })),
    setPage: (value) => set((state) => ({ page: value })),
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setVisibleDetails: (value) => set((state) => ({ visibleDetails: value })),
    setDetails: (value) => set((state) => ({ details: value })),
    setSchedID: (value) => set((state) => ({ schedID: value })),
    setReportDetails: (value) => set((state) => ({ reportDetails: value })),
    setPanelRating: (value) => set((state) => ({ panelRating: value })),
    setRatingLength: (value) => set((state) => ({ ratingLength: value })),
    setThesisTitle :(value) => set((state) => ({ thesisTitle: value })),
    setProponents: (value) => set((state) => ({ proponents: value })),
    setTotalFacultyRating: (value) => set((state) => ({ totalFacultyRating: value })),
    setTotalPanel: (value) => set((state) => ({ totalPanel: value })),
   
   
}));
