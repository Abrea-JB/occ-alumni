import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const fetchClassroomStudents = async (classId) => {
    const { data } = await axiosConfig.get(`faculties/get-classroom-students/${classId}`);
    return data || [];
};

export default function useClassroomStudents(classId) {
    return useQuery(
        ["classroom-student-list", classId], // Key includes classId for caching correctly
        () => fetchClassroomStudents(classId),
        {
            keepPreviousData: true,
        }
    );
}
