import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getData = async () => {
    const { data } = await axiosConfig.get(`/settings`);
    return data?.settings || null;
};

export default function useSettings() {
    return useQuery(["settings"], () => getData(), {
        keepPreviousData: true,
    });
}
