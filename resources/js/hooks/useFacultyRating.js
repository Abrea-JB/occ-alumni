import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getDetails = async (id) => {
    const { data } = await axiosConfig.get(`/thesis/details/${id}`);
     return data;
};

export default function useThesisDetails(id) {
    return useQuery(["thesisDetailsQuery", id], () => getDetails(id), {
        keepPreviousData: true,
    });
}
