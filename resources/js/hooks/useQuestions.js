import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const fetchData = async () => {
    const { data } = await axiosConfig.get(`/questions`);
    return data || [];
};

export default function useQuestions() {
    return useQuery(["profile"], () => fetchData(), {
        keepPreviousData: true,
    });
}
