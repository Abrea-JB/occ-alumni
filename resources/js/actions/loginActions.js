import Api from "../utils/api";
import { delay, setCookie } from "../utils/helper";
import secureLocalStorage from "react-secure-storage";

const checkLogin = async ({ params, set, get }) => {
    const setSubmit = get().setSubmit;
    const setError = get().setError;
    setSubmit(true);
    setError(null);
    await delay(1000);
    Api.login(params)
        .then((result) => {
            secureLocalStorage.setItem(
                "access_token",
                result.data.access_token
            );
            
            secureLocalStorage.setItem("faculty_id", result?.data?.faculty_id);
            secureLocalStorage.setItem("userID", result?.data?.user?.id);
            secureLocalStorage.setItem("userRole", result?.data?.user?.role);
            secureLocalStorage.setItem("email", result?.data?.user?.email);
            secureLocalStorage.setItem("name", result?.data?.user?.name);
            // if (result.data.user.role === "admin") {
            //     window.location = "/admin-dashboard";
            // }
            // if (result.data.user.role === "faculty") {
            //     window.location = "/classroom";
            // }
            // if (result.data.user.role === "student") {
            //     window.location = "/classroom";
            // }
            window.location = "/";

            //window.location.href = "/admin-dashboard";
            return false;
        })
        .catch((error) => {
            setSubmit(false);
            if (error.response) {
                setError(error.response.data.message);
                return;
            }
            setError(true);
        });
};

export { checkLogin };
