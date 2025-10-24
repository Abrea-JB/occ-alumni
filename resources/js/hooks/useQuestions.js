


import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getQuestions = async (values) => {  
    const { data } = await axiosConfig.post("/classroom/question-list",{
        page: values?.queryKey[1],
        per_page: values?.queryKey[2],
        class_id: values?.queryKey[3],
        type: values?.queryKey[4],
        subject_id: values?.queryKey[5],
    });
    return data;
};

export default function useQuestions(page, perPage, id, type = null, subjectId) {    
    return useQuery(["questions", page, perPage, id, type, subjectId], (datas) => getQuestions(datas ), {
        keepPreviousData: true,
        // enabled: !!subjectId,
    });
}
