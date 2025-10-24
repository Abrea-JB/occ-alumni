import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getDepartments = async (page,perPage,search) => {
    const { data } = await axiosConfig.get("/department?page=" + page+'&per_page='+perPage+'&keyword='+search);
    return data;
};

export default function useDepartments(page,perPage,search) {
    return useQuery(["departments", page,perPage,search], () => getDepartments(page,perPage,search), {
        keepPreviousData: true,
    });
}