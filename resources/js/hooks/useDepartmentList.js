import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const departmentList = async () => {
    const { data } = await axiosConfig.get(`/college/department-list`);
    return data?.departments || [];
};

export default function useDepartmentList() {
    return useQuery(["use-department-list"], () => departmentList(), {
        keepPreviousData: true,
    });
}
