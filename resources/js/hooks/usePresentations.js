import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";
import { delay } from "../utils/helper";

const fetch = async (class_id) => {  
    // await delay(1000);
    const { data } = await axiosConfig.get(`presentations/${class_id}`);
    return data || [];
};

export default function usePresentations(class_id) {
    return useQuery(["presentation-list",class_id], () => fetch(class_id), {
        keepPreviousData: true,
    });
}
