import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Default from "../Pages/Default";
import HomeLayout from "../layouts/HomeLayout";
import HistoryLayout from "../layouts/HistoryLayout";
import StatsLayout from "../layouts/StatsLayout";
import HelpLayout from "../layouts/HelpLayout";
import UserLayout from "../layouts/UserLayout";
import AuthComponent from "../Pages/AuthComponent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
  },
  {
    path: "/home",
    element: <HomeLayout />,
  },
  {
    path: "/history",
    element: <HistoryLayout />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/stats",
    element: <StatsLayout />,
  },
  {
    path: "/help",
    element: <HelpLayout />,
  },
  {
    path: "/user",
    element: <UserLayout />,
  },
  {
    path: "/auth",
    element: <AuthComponent />,
  },
  {
    path: "*",
    element: <Default />,
  },
]);
