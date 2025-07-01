import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import King from "@/views/King.vue";
import Queen from "@/views/Queen.vue";
import Contact from "@/views/Contact.vue";
import Dashboard from "@/views/Dashboard.vue";
import Crudking from "@/views/Crudking.vue";
import Detailking from "@/views/Detailking.vue";
import Crudqueen from "@/views/Crudqueen.vue";
import Detailqueen from "@/views/Detailqueen.vue";
import { getAuth } from "firebase/auth"; // Correct import for Firebase Auth
import { auth } from "@/firebase/config"; // Assuming this is your Firebase app initialization
import RandomCodes from "@/views/RandomCodes.vue";
import RandomCodesQueens from "@/views/RandomCodesQueens.vue";
import VotedKing from "@/views/VotedKing.vue";
import VotedQueen from "@/views/VotedQueen.vue";
import VoteCotrol from "@/views/VoteCotrol.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/king",
    name: "king",
    component: King,
  },
  {
    path: "/queen",
    name: "queen",
    component: Queen,
  },
  {
    path: "/votedKing",
    name: "votedKing",
    component: VotedKing,
  },
  {
    path: "/votedQueen",
    name: "votedQueen",
    component: VotedQueen,
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
  },
  {
    path: "/detail/:kingid",
    name: "KingDetail",
    component: Detailking,
    props: true,
  },
  {
    path: "/detail/:queenid",
    name: "QueenDetail",
    component: Detailqueen,
    props: true,
  },
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    component: Dashboard,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/crudKing",
    name: "Crudking",
    component: Crudking,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/crudQueen",
    name: "Crudqueen",
    component: Crudqueen,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/randomGeneratesKingsCodes",
    name: "RandomCodes",
    component: RandomCodes,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/randomGeneratesQueensCodes",
    name: "RandomQueensCodes",
    component: RandomCodesQueens,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/voteControl",
    name: "VoteControl",
    component: VoteCotrol,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const user = auth.currentUser; // Check the currently logged-in user

  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // If the route requires authentication, check if the user is logged in
    if (!user) {
      next({ name: "home" }); // Redirect to home if not logged in
    } else {
      next(); // Allow access to the route if logged in
    }
  } else {
    next(); // Allow access to all routes that do not require authentication
  }
});

export default router;
