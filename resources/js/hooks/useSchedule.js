import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getData = async (page,perPage) => {
    const { data } = await axiosConfig.get("/schedule");
    return data?.schedules || [];
};

function useSchedule() {
    return useQuery(["scheduleQuery"], () => getData(), {
        keepPreviousData: true,
    });
}

const getScheduleReport = async (page,perPage) => {
    const { data } = await axiosConfig.get("/schedule/report?page=" + page+'&per_page='+perPage);
    return data;
};

function useScheduleReport(page,perPage,filterBy) {
    return useQuery(["scheduleReport", page,perPage], () => getScheduleReport(page,perPage,filterBy), {
        keepPreviousData: true,
    });
}

const getScheduleReports = async (values) => {
    const { data } = await axiosConfig.post("/schedule/reports",{
        page: values?.queryKey[1],
        per_page: values?.queryKey[2],
        filter: values?.queryKey[3],
        // user_id: userID,
       
    });
    return data;
};

function useScheduleReports(page,per_page,filterBy) {
    return useQuery(["scheduleReports", page,per_page,filterBy], (datas ) => getScheduleReports(datas), {
        keepPreviousData: true,
    });
}


export { useSchedule, useScheduleReport,useScheduleReports };