import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getEmployees = async (page,perPage) => {
    const { data } = await axiosConfig.get("/employees?page=" + page+'&per_page='+perPage);
    return data;
};

export default function useEmployees(page,perPage) {
    return useQuery(["employees", page], () => getEmployees(page,perPage), {
        keepPreviousData: true,
    });
}
