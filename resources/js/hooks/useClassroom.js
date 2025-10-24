import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";
import { delay } from "../utils/helper";

const fetch = async () => {
    await delay(1000);
    const { data } = await axiosConfig.get(`faculties/get-classroom`);
    return data || [];
};

export default function useClassroom() {
    return useQuery(["classroom-list"], () => fetch(), {
        keepPreviousData: true,
    });
}
