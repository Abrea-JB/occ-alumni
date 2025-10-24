import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";
import { delay } from "../utils/helper";

const fetch = async () => {  
    await delay(1000);
    const { data } = await axiosConfig.get(`faculty-subjects`);
    return data || [];
};

export default function useFacultySubjects() {
    return useQuery(["subject-list-faculty"], () => fetch(), {
        keepPreviousData: true,
    });
}
