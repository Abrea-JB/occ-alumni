import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";
const getSemester = async () => {
    const { data } = await axiosConfig.get(`/semesters`);
    return data?.semesters;
};

export default function useSemesters() {
    return useQuery(["semester"], () => getSemester(), {
        keepPreviousData: true,
    });
}
