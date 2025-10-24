import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getSchoolyear = async () => {
    const { data } = await axiosConfig.get(`/schoolyear`);
    return data?.schoolyear;
};

export default function useSchoolYear() {
    return useQuery(["schoolyear"], () => getSchoolyear(), {
        keepPreviousData: true,
    });
}
