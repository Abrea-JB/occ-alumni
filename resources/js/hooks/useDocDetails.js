import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getDetails = async (id) => {
    const { data } = await axiosConfig.get(`/thesis/document/${id}`);
    return data;
};

export default function useDocDetails(id) {
    return useQuery(["docDetailsQuery", id], () => getDetails(id), {
        keepPreviousData: true,
    });
}
