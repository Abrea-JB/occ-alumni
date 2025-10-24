import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getFaculties = async (page, perPage, search) => {
    const { data } = await axiosConfig.get("/faculties?page=" + page+'&per_page='+perPage+'&keyword='+search);
    return data;
};

export default function useFaculties(page, perPage, search) {
    return useQuery(["faculties", page, perPage, search], () => getFaculties(page, perPage, search), {
        keepPreviousData: true,
    });
}
