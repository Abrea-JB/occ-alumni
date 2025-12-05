import { message, Modal } from "antd";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { useLoadingStore } from "~/states/loadingState";
import { BASE_URL } from "./constant";

const instance = axios.create({
    baseURL: BASE_URL + "api/",
});

// Track if a modal is already open
let isModalOpen = false;
let currentModal = null;

// Add request interceptor for loading effects
instance.interceptors.request.use(
    (config) => {
        const loadingStore = useLoadingStore.getState();
        // Prevent crash if function doesn't exist
        loadingStore?.showLoading?.();
        return config;
    },
    (error) => {
        const loadingStore = useLoadingStore.getState();
        loadingStore?.hideLoading?.();
        return Promise.reject(error);
    }
);

// Inside the response interceptor (error handler)
instance.interceptors.response.use(
    (response) => {
        const loadingStore = useLoadingStore.getState();
        loadingStore?.hideLoading?.();
        return response;
    },
    (error) => {
        const loadingStore = useLoadingStore.getState();
        loadingStore?.hideLoading?.();

        const statusCode = error.response ? error.response.status : null;

        // SESSION EXPIRED HANDLING
        if (statusCode === 401) {
            window.location.href = `/login?type=session-expired&link=${window.location.href}`;
            return Promise.reject(error);
        }

        // HANDLE BACKEND VALIDATION ERRORS
        let errorMessage = "No error message to show.";

        if (error.response?.data?.errors) {
            // Combine all field-specific validation errors into one string
            errorMessage = Object.values(error.response.data.errors)
                .flat()
                .join("\n");
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        // SINGLE ERROR MODAL INSTANCE
        if (isModalOpen && currentModal) {
            currentModal.update({
                title: `Error: ${statusCode}`,
                content: errorMessage,
            });
        } else {
            currentModal = Modal.error({
                title: `Error: ${statusCode}`,
                content: errorMessage,
                onOk: () => {
                    isModalOpen = false;
                    currentModal = null;
                },
                onCancel: () => {
                    isModalOpen = false;
                    currentModal = null;
                }
            });
            isModalOpen = true;
        }

        return Promise.reject(error);
    }
);

// Set auth token
const updateAuthToken = () => {
    const access_token = secureLocalStorage.getItem("access_token");

    if (access_token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    }
};

// Initialize auth token
updateAuthToken();

// Optional: Add a method to refresh token when needed
export const refreshAuthToken = (newToken) => {
    secureLocalStorage.setItem("access_token", newToken);
    updateAuthToken();
};

export default instance;
