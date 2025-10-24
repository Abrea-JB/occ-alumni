import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getData = async (type) => {
    const { data } = await axiosConfig.get(`get-bookings?type=${type}`);
    return data;
};

export default function useBooking(type) {
    return useQuery(["bookings", type], () => getData(type), {
        keepPreviousData: true,
    });
}
