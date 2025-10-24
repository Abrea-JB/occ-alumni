import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const fetch = async (classId) => {
    const { data } = await axiosConfig.get(
        `get-quiz-status/${classId}`
    );
    return data || [];
};

export default function useQuizStatus(classId) {
    return useQuery({
        queryKey: ["classwork-quiz-statuses", classId],
        queryFn: () => fetch(classId),
        enabled: !!classId,
        refetchInterval: 15000, // Refetch every 5 seconds
        // keepPreviousData: true,
        // staleTime: 1000 * 60 * 5,
    });
}
