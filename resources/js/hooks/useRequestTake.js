import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const fetch = async (classId) => {
    const { data } = await axiosConfig.get(
        `get-quiz-request/${classId}`
    );
    return data || [];
};

export default function useRequestTake(classId) {
    return useQuery({
        queryKey: ["classwork-quiz-request", classId],
        queryFn: () => fetch(classId),
        enabled: !!classId,
        refetchInterval: 15000, // Refetch every 5 seconds
        // keepPreviousData: true,
        // staleTime: 1000 * 60 * 5,
    });
}
