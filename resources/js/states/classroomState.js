import { create } from "zustand";
import axiosConfig from "~/utils/axiosConfig";
import dayjs from "dayjs";

const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const useClassroomStore = create((set) => ({
    isSubmit: false,
    isClear: false,
    formStudent: false,
    attendanceDetails: false,
    attendanceCurrent: null,
    classID: null,
    classroom: null,
    editClasswork: null,
    formClassroom: false,
    formType: null,
    term: null,
    submission: false,
    studentSubmission: false,
    classwork_id: null,
    classwork_title: null,
    classwork_points: null,
    currentUser: {
        id: null,
        name: "",
        role: "",
        email: "",
    },
    otherUser: {
        id: null,
        name: "",
        role: "",
        email: "",
    },
    lastConversation: null,
    setField: (key, value) => set(() => ({ [key]: value })),
    storeClassroom: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/store-classroom", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    addStudentClassroom: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/store-classroom-students", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    deleteStudentClassroom: async (params) => {
        await delay(1000);
        return axiosConfig
            .delete("faculties/delete-classroom-students", { data: params })
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    storeClasswork: async (params) => {
        const formData = new FormData();
        formData.append("classworkId", params?.classworkId || null);
        formData.append("class_id", params?.class_id);
        formData.append("title", params.title);
        formData.append("instructions", params.instructions);
        formData.append("points", params.points || 0);
        formData.append("quiz_id", params.selectValue || null);
        if (params?.nonFiles?.length) {
            formData.append("nonFiles", JSON.stringify(params.nonFiles));
        }
        formData.append("is_published", params.is_published);
        formData.append(
            "due_date",
            params.due_date
                ? dayjs(params.due_date).format("YYYY-MM-DD HH:mm:ss")
                : ""
        );

        formData.append("topic", params.topic ?? "");

        // Handle links array properly in FormData
        if (params.links?.length > 0) {
            params.links
                .filter((link) => {
                    // Handle both string and object cases
                    const linkValue =
                        typeof link === "string"
                            ? link
                            : link?.url || link?.link || "";
                    return String(linkValue).trim() !== "";
                })
                .forEach((link) => {
                    // Get the value to append (same logic as above)
                    const linkValue =
                        typeof link === "string"
                            ? link
                            : link?.url || link?.link || "";
                    formData.append("links[]", linkValue);
                });
        } else {
            // Only add empty value if you specifically need to indicate "no links"
            formData.append("links[]", "");
        }

        params?.attachments.forEach((file) => {
            formData.append("attachment_list[]", file);
        });

        formData.append("close_after_due_date", params.close_after_due_date);
        formData.append("term", params.term);
        await delay(1000);
        return axiosConfig
            .post("faculties/store-classwork", formData)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    addTopicClasswork: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/store-classwork-topic", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    addTopicClassworkScore: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/store-classwork-topic-score", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    updateClassroomSettings: async (values) => {
        const formData = new FormData();
        formData.append("id", values?.class_id);
        formData.append("class_name", values?.class_name);
        formData.append("section", values?.section);
        formData.append("subject_id", values?.subject_id);
        formData.append("course_code", values?.course_code);
        formData.append("room", values.room);
        formData.append("day", values.day);
        formData.append("time_in", values.schedule[0].format("HH:mm:ss"));
        formData.append("time_out", values.schedule[1].format("HH:mm:ss"));
        formData.append("term", values?.examType);
        formData.append("attendance_points", values?.attendance_points);
        formData.append(
            "attendance_points_late",
            values?.attendance_points_late
        );
        formData.append("show_grade", values?.show_grade);

        if (values?.heroImage) {
            formData.append("banner_image", values?.heroImage);
        }

        return axiosConfig
            .post("update-classroom-settings", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: (data) => data,
            })
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    storePrivateMessage: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/store-classwork-topic-score", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    storeAcademicRecords: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/store-academic-records", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    deleteClasswork: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/delete-classwork", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    updateCourseSyllabus: async (params) => {
        const formData = new FormData();
        formData.append("id", params?.id);
        formData.append("file", params?.file);
        await delay(1000);

        return axiosConfig
            .post("update-course-syllabus", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: (data) => data,
            })
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    storeQuestion: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("store-question", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    manualAttendance: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("manual-attendance", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    storeQuizes: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("quizzes", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    storePresentation: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("presentations", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    deletePresentation: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("delete-presentations", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    approveRequest: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("approve-request", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    markNotificationAsRead: async (params) => {
        return axiosConfig
            .get(`/notifications/${params}/read`)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
    // In your classroom store
    addBulkClassworkScores: async (params) => {
        await delay(1000);
        return axiosConfig
            .post("faculties/store-classwork-topic-score-bulk", params)
            .then((result) => result)
            .catch((error) => ({
                error: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unknown error",
            }));
    },
}));

export default useClassroomStore;
