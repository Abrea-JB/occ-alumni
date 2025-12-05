import { DashboardPage } from "../pages/admin/dashboard";

import Pages404 from "../pages/ErrorPages/Pages404";
import { LoginPage, AlumniRegistration, AnswerQuizPage, ImageQuizPage } from "../pages/auth";
import { MainPage } from "../pages/Main";
import AlumniList from "../pages/admin/alumni/AlumniList";
import AlumniEvents from "../pages/admin/events/AlumniEvents";
import AlumniQuestionsPage from "../pages/admin/questions/AlumniQuestionsPage";
import ProfilePage from "../pages/admin/ProfilePage";

// <CHANGE> Add import for DepartmentHeadsPage and DepartmentDashboardPage
import { DepartmentHeadsPage, DepartmentDashboardPage } from "../pages/admin/department-heads";

const authRoutes = [
    { path: "/login", component: LoginPage },
    { path: "/register", component: AlumniRegistration },
    { path: "/answer-question", component: AnswerQuizPage },
    { path: "/image-quiz", component: ImageQuizPage },
];

const adminRoutes = [
    { path: "/admin-dashboard", title: "Dashboard", component: DashboardPage },
    { path: "/alumni", component: AlumniList },
    { path: "/events", component: AlumniEvents },
    { path: "/questions", component: AlumniQuestionsPage },
    // <CHANGE> Add department heads routes
    { path: "/department-heads", component: DepartmentHeadsPage },
    { path: "/department-dashboard", component: DepartmentDashboardPage },
];

const alumniRoutes = [
    { path: "/alumni", component: AlumniList },
    { path: "/events", component: AlumniEvents },
    { path: "/profile", component: ProfilePage },
];

const noLayoutRoutes = [
    { path: "/404", component: Pages404 },
    { path: "/", component: MainPage },
];

export { noLayoutRoutes, authRoutes, adminRoutes, alumniRoutes };