import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const groupList = async () => {
    const { data } = await axiosConfig.post(`/faculties/dashboard`);
    return data || [];
};

function useFacultyDashboard() {
    return useQuery(["faculties_dashboard"], () => groupList(), {
        keepPreviousData: true,
    });
}

const rating = async (defenseSchedID,facultyPanelID) => {
    const { data } = await axiosConfig.post("/faculties/rating?defenseSchedID=" + defenseSchedID+'&facultyPanelID='+facultyPanelID);
    return data || [];
};

function useFacultyDashboardRating(defenseSchedID,facultyPanelID) {
    return useQuery(["faculties_dashboard_rating"], () => rating(defenseSchedID,facultyPanelID), {
        keepPreviousData: true,
    });
}

const ratingThesisSched = async (defenseSchedID) => {
    const { data } = await axiosConfig.post("/faculties/rating-thesis-sched?defenseSchedID=" + defenseSchedID);
    return data || [];
};

function useRatingThesisSched(defenseSchedID) {
    return useQuery(["rating_thesis_dashboard"], () => ratingThesisSched(defenseSchedID), {
        keepPreviousData: true,
    });
}


export { useFacultyDashboard, useFacultyDashboardRating, useRatingThesisSched };