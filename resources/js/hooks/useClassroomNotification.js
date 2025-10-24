import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const fetch = async (id) => {
    const { data } = await axiosConfig.get(`classroom-notification?id=${id}`);
    return data || [];
};

export default function useClassroomNotification(id) {
    return useQuery(["classroom-notications",id], () => fetch(id), {
        keepPreviousData: true,
    });
}
