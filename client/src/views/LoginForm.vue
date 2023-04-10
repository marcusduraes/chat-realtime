<script setup>
import { ref } from "vue";
import axios from "axios";

const username = ref(null);
const password = ref(null);

const attemptLogin = async () => {
  try {
    const res = await axios.post("http://localhost:3000/api/v1/auth", {
      username,
      password,
    });

    const token = res.data.data;
    window.location = `http://localhost:5173/chat?token=${token}`;
  } catch (error) {
    console.log(error.response.data.data);
  }
};
</script>

<template>
  <div>
    <div class="container m-auto my-3 h-100">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Login | Chat</h5>

          <form id="form">
            <div class="mb-3">
              <label for="username" class="form-label">Nome de usuário</label>
              <input
                type="email"
                class="form-control"
                id="username"
                required
                v-model="username"
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Senha</label>
              <input
                type="password"
                class="form-control"
                id="password"
                required
                v-model="password"
              />
            </div>

            <button type="submit" class="btn btn-primary" @click="attemptLogin">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
