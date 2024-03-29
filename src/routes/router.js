import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/LoginPage";
import MenuPagesPage from "../pages/MenuPagesPage";
import UsersPage from "../pages/UsersPage";
//import UserPage from "../pages/UserPage";
//import AccountActivationPage from "../pages/AccountActivationPage";

const routes = [
  {
    path: "/",
    component: LoginPage,
  },
  {
    path: "/pages",
    component: MenuPagesPage,
  },
  {
    path: "/users",
    component: UsersPage,
  },
  // {
  //   path: "/users",
  //   component: SignUpPage,
  // },  
];

const router = createRouter({ routes, history: createWebHistory() });

export default router;