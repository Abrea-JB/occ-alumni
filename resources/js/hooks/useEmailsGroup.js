import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getEmails = async (id) => {
    const { data } = await axiosConfig.get(`/student-email-list/${id}`);
    return data?.emails;
};

export default function useEmailsGroup(id) {
    return useQuery(["group_details", id], () => getEmails(id), {
        keepPreviousData: true,
    });
}
