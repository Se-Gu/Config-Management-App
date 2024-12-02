import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginPage from "../views/LoginPage.vue";
import DashboardPage from "../views/DashboardPage.vue";
import SignOut from "../views/SignOut.vue";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/dashboard",
    name: "DashboardPage",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/sign-out",
    name: "SignOut",
    component: SignOut,
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    const isAuthenticated = !!user;
    console.log("isAuthenticated: ", isAuthenticated);

    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: "LoginPage" });
    } else if (to.name === "LoginPage" && isAuthenticated) {
      next({ name: "DashboardPage" });
    } else {
      next();
    }
  });
});

export default router;
