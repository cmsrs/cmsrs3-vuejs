import { createRouter, createWebHistory } from "vue-router"
import MenuPagesPage from "../pages/MenuPagesPage.vue"
import LoginPage from "../pages/LoginPage.vue"
import UsersPage from "../pages/UsersPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
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
    name: 'users',
    component: UsersPage,
  },
  {
    path: "/user/:mode/:id?",
    component: UserEditPage,
    name: 'user',
    props: true
  },
  // {
  //   path: "/users",
  //   component: SignUpPage,
  // },  
];

const router = createRouter({ routes, history: createWebHistory() });

export default router;
