import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getSchoolyear = async () => {
    const { data } = await axiosConfig.get(`/dashboad-data`);
    return data;
};

export default function useDashboard() {
    return useQuery(["dashboard"], () => getSchoolyear(), {
        keepPreviousData: true,
    });
}
