import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getData = async (page,perPage,search) => {  
    const { data } = await axiosConfig.get("/get-subjects?page=" + page+'&per_page='+perPage +'&keyword='+search);
    return data;
};

export default function useSubject(page,perPage,search) {
    return useQuery(["subjects", page,perPage,search], () => getData(page,perPage,search), {
        keepPreviousData: true,
    });
}
