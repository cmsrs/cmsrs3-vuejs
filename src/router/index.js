//import { createRouter, createMemoryHistory } from "vue-router"; // it was createWebHistory instead of createMemoryHistory
import { createRouter, createWebHistory } from "vue-router"; // it was createWebHistory instead of createMemoryHistory
import MenuPagesPage from "../pages/MenuPagesPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import ProductsPage from "../pages/ProductsPage.vue";
import ContactsPage from "../pages/ContactsPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import ProductEditPage from "../pages/ProductEditPage.vue";
import CheckoutsPage from "../pages/CheckoutsPage.vue";
//import { ADMIN_URL_SECRET } from '../config.js';

const routesIn = [
  {
    //path: "/admin"+ADMIN_URL_SECRET+"/:demo?",  
    path: "/:demo?",
    component: LoginPage,      
    props: true,      
  },
  {
    //path: "/admin"+ADMIN_URL_SECRET+"/pages/:id?",
    path: "/pages/:id?",      
    component: MenuPagesPage,
  },

  {
    //path: "/admin"+ADMIN_URL_SECRET+"/users",
    path: "/users",      
    name: "users",
    component: UsersPage,
  },
  {
    //path: "/admin"+ADMIN_URL_SECRET+"/user/:mode/:id?",
    path: "/user/:mode/:id?",      
    component: UserEditPage,
    name: "user",
    props: true,
  },

  {
    //path: "/admin"+ADMIN_URL_SECRET+"/products",
    path: "/products",      
    name: "products",
    component: ProductsPage,
  },
  {
    //path: "/admin"+ADMIN_URL_SECRET+"/product/:mode/:id?",
    path: "/product/:mode/:id?",      
    component: ProductEditPage,
    name: "product",
    props: true,
  },
  {
    //path: "/admin"+ADMIN_URL_SECRET+"/contacts",
    path: "/contacts",      
    component: ContactsPage,
  },
  {
    //path: "/admin"+ADMIN_URL_SECRET+"/settings",
    path: "/settings",      
    component: SettingsPage,
  },

  {
    //path: "/admin"+ADMIN_URL_SECRET+"/checkouts",
    path: "/checkouts",    
    component: CheckoutsPage,
  },

  // {
  //   path: "/*",
  //   component: LoginPage,
  //   catchAll: true,
  // },

  // {
  //   path: "/users",
  //   component: SignUpPage,
  // },
];


const router = createRouter({
  //history:  is_test ?  createMemoryHistory(import.meta.env.BASE_URL)  : createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routesIn
});

export default router;
