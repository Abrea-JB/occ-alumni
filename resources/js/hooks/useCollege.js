import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getCollege = async (page,perPage,search) => {  
    const { data } = await axiosConfig.get("/college?page=" + page+'&per_page='+perPage +'&keyword='+search);
    return data;
};

export default function useCollege(page,perPage,search) {
    return useQuery(["colleges", page,perPage,search], () => getCollege(page,perPage,search), {
        keepPreviousData: true,
    });
}
