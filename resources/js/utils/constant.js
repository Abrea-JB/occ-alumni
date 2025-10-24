export const PER_PAGE = 10;
export const ERROR_MESSAGE = "Error found please contact administrator!";
export const BASE_URL = window.location.origin + "/";
export const DIR_LOCATION = {
    profile: `${BASE_URL}/uploads/profile/`,
};
export const CONCAT_IDS = { student: "0934765" };

export const CLASS_WORK_TYPES = [
    { key: "hands-on-quiz", value: "HANDS-ON QUIZ" },
    { key: "lab-exercises", value: "LABORATORY EXERCISES/CASE STUDIES" },
    { key: "lab-assignment", value: "ASSIGNMENT/GROUP WORK" },
    { key: "midterm-exam", value: "MIDTERM EXAM", term: "midterm" },
    { key: "final-exam", value: "FINAL EXAM/PROJECT", term: "final" },
];




export const ATTENDANCE_IMAGE = BASE_URL + "uploads/attendance/";
export const HERO_IMAGE = BASE_URL + "uploads/classroom/hero_image/";
export const DEFAULT_BANNER = BASE_URL + "images/default-banner.jpg";
export const STUDENT_SUBMISSION = BASE_URL + "uploads/submission/";
export const PROFILE = BASE_URL + "uploads/profile/";
export const ATTENDANCE_PROFILE = BASE_URL + "uploads/attendance-profile/";
export const CLASSWORK_ATTACHMENT = BASE_URL + "uploads/classwork/";