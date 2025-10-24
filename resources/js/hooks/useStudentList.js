import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const studentList = async () => {
    const { data } = await axiosConfig.get(`/student-list`);
    return data?.students || [];
};

export default function useStudentList() {
    return useQuery(["student_list"], () => studentList(), {
        keepPreviousData: true,
    });
}
