<template>
  <div>
    <div class="container m-auto my-3 h-100">
      <div class="card bg-dark">
        <div class="card-body bg-dark">
          <h5 class="card-title text-white">Login | Chat</h5>

          <form id="form" @submit.prevent="attemptLogin">
            <div class="mb-3">
              <label for="username" class="form-label">Nome de usuário</label>
              <input
                type="text"
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

            <button type="submit" class="btn btn-primary">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

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
    console.log(error);
    alert(error.response.data.data);
  }
};
</script>

<style scoped>
form {
  color: #fff;
}
</style>
