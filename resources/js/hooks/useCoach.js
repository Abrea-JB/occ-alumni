import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getData = async (page,perPage,search) => {  
    const { data } = await axiosConfig.get("/get-coaches");
    return data;
};

export default function useCoach(page,perPage,search) {
    return useQuery(["coached", page,perPage,search], () => getData(page,perPage,search), {
        keepPreviousData: true,
    });
}
