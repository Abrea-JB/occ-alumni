


import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getStudents = async (values) => {  
    const { data } = await axiosConfig.post("/students/student-list",{
        page: values?.queryKey[1],
        per_page: values?.queryKey[2],
        filter: values?.queryKey[3],
    });
    return data;
};

export default function useStudents(page, perPage, filterBy) {    
     //let filter_keywords = String(filterBy?.keywords); 

    //  const [
    //     filterBy,
    // ] = useStudentStore(
    //     (state) => [
    //         state.filterBy,
    //     ],
    //     shallow
    // );

   // console.log(filterBy?.keywords)

    return useQuery(["students", page, perPage, filterBy], (datas) => getStudents(datas ), {
        keepPreviousData: true,
    });
}
