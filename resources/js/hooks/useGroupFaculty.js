import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getGroups = async (page,perPage) => {
    const { data } = await axiosConfig.get("/groups/faculty-group-list?page=" + page+'&per_page='+perPage); 
    return data || [];
};

export default function useGroupFaculty(page,perPage) {
    return useQuery(["group", page], () => getGroups(page,perPage), {
        keepPreviousData: true,
    });
}
