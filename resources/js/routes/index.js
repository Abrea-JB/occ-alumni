import { DashboardPage } from "../pages/admin/dashboard";



import Pages404 from "../pages/ErrorPages/Pages404";
import { LoginPage, AlumniRegistration } from "../pages/auth";
import { MainPage } from "../pages/Main";
import AlumniList  from "../pages/admin/alumni/AlumniList";
import AlumniEvents  from "../pages/admin/events/AlumniEvents";

import { PlayerPage, CoachPage, CoachBookingList, CoachWithdrawalPage } from "../pages/admin/player";

const authRoutes = [{ path: "/login", component: LoginPage }, { path: "/register", component: AlumniRegistration }];

const adminRoutes = [
    { path: "/admin-dashboard", title: "Dashboard", component: DashboardPage },
    { path: "/alumni", component: AlumniList },
    { path: "/events", component: AlumniEvents },
];



const noLayoutRoutes = [
    { path: "/404", component: Pages404 },
    { path: "/", component: MainPage },
];

export {
    noLayoutRoutes,
    authRoutes,
    adminRoutes,
};
