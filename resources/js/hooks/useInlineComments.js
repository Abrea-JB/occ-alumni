import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getDetails = async (id) => {
    const { data } = await axiosConfig.get(`/thesis/list-inline-comments/${id}`);
    return data;
};

export default function useInlineComments(id) {
    return useQuery(["doc-comments-inline", id], () => getDetails(id), {
        keepPreviousData: true,
        refetchInterval: 10000,
    });
}
