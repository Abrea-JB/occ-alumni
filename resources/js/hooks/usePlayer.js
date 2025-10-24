import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getData = async (page,perPage,search) => {  
    const { data } = await axiosConfig.get("/get-players");
    return data;
};

export default function usePlayer(page,perPage,search) {
    return useQuery(["players", page,perPage,search], () => getData(page,perPage,search), {
        keepPreviousData: true,
    });
}
