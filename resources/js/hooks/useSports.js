import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getData = async (page,perPage,search) => {  
    const { data } = await axiosConfig.get("/get-sports");
    return data;
};

export default function useSports(page,perPage,search) {
    return useQuery(["sports", page,perPage,search], () => getData(page,perPage,search), {
        keepPreviousData: true,
    });
}
