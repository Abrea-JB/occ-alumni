import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const fetchClassroomStudents = async (classId, date) => {
    const { data } = await axiosConfig.get(`faculties/get-classroom-attendance/${classId}/${date}`);
    return data || [];
};

export default function useAttendanceDetails(classId, date) {
    return useQuery(
        ["classroom-aattendance-details", classId, date], 
        () => fetchClassroomStudents(classId, date),
        {
            keepPreviousData: true,
        }
    );
}
