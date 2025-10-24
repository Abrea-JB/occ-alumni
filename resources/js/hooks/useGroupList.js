import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const groupList = async () => {
    const { data } = await axiosConfig.get(`/groups/list`);
    return data?.groups || [];
};

export default function useGroupList() {
    return useQuery(["group_list"], () => groupList(), {
        keepPreviousData: true,
    });
}
