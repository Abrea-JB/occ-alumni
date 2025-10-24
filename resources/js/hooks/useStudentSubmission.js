import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const fetchClassroomStudents = async (classId) => {
    const { data } = await axiosConfig.get(`faculties/get-classwork-submission/${classId}`);
    return data || [];
};

export default function useStudentSubmission(classId) {
    return useQuery({
        queryKey: ["classwork-submission-list", classId],
        queryFn: () => fetchClassroomStudents(classId),
        enabled: !!classId,  
        // keepPreviousData: true,
        // staleTime: 1000 * 60 * 5,
    });
}