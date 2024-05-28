//import { createRouter, createMemoryHistory } from "vue-router"; // it was createWebHistory instead of createMemoryHistory
import { createRouter, createWebHistory } from "vue-router"; // it was createWebHistory instead of createMemoryHistory
import MenuPagesPage from "../pages/MenuPagesPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import ProductsPage from "../pages/ProductsPage.vue";
import ContactsPage from "../pages/ContactsPage.vue";
import ProductEditPage from "../pages/ProductEditPage.vue";

//import UserPage from "../pages/UserPage";
//import AccountActivationPage from "../pages/AccountActivationPage";

const router = createRouter({
  //history:  is_test ?  createMemoryHistory(import.meta.env.BASE_URL)  : createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LoginPage,
    },
    {
      path: "/pages/:id?",
      component: MenuPagesPage,
    },

    {
      path: "/users",
      name: "users",
      component: UsersPage,
    },
    {
      path: "/user/:mode/:id?",
      component: UserEditPage,
      name: "user",
      props: true,
    },

    {
      path: "/products",
      name: "products",
      component: ProductsPage,
    },
    {
      path: "/product/:mode/:id?",
      component: ProductEditPage,
      name: "product",
      props: true,
    },
    {
      path: "/contacts",
      component: ContactsPage,
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
  ],
});

export default router;
