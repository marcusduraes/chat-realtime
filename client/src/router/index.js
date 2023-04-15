import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/LoginForm.vue";
import Chat from "../views/Chat.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  
];

const router = createRouter({
  history: createWebHistory(""),
  routes,
});

export default router;
