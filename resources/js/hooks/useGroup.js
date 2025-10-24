import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getGroups = async (page,perPage) => {
    const { data } = await axiosConfig.get("/groups?page=" + page+'&per_page='+perPage); 
    return data || [];
};

export default function useGroup(page,perPage) {
    return useQuery(["groups", page], () => getGroups(page,perPage), {
        keepPreviousData: true,
    });
}
