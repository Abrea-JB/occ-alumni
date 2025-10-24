import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getFaculties = async () => {
    const { data } = await axiosConfig.get("/faculty-list"); 
    return data?.faculties;
};

export default function useFacultyList() {
    return useQuery(["faculty_list"], () => getFaculties(), {
        keepPreviousData: true,
    });
}
