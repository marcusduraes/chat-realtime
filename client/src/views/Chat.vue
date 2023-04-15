<template>
  <div class="d-flex flex-column min-vh-100">
    <div class="container my-3">
      <ul class="list-unstyled" ref="messages" id="messages"></ul>
    </div>

    <div class="container mt-auto p-3">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          id="input"
          v-model="input"
          ref="chat"
        />

        <button
          id="send"
          class="btn btn-primary fw-semibold"
          type="button"
          @click="sendMessage"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import enumStyle from "../modules/enumStyle";
import mountMessageCommon from "../modules/functions/mountMessage";
import getTime from "../modules/functions/getTime";

const input = ref(null);
const messages = ref(null);
const chat = ref(null);

onMounted(() => {
  chat.value.onkeydown = e => {
    if (e.key === "Enter") sendMessage();
  };
});

const unauthorized = () => (window.location.href = "http://localhost:5173/");
const user_global = ref(null);

const mountMessage = (sentBy, content, time) => {
  const user = user_global.value;
  mountMessageCommon(user, sentBy, content, time);
};

const url = window.location.href;
const queryString = new URLSearchParams(new URL(url).search);
const token = queryString.get("token");

const socket = new WebSocket(`ws://localhost:3000/chat?token=${token}`);
onMounted(() => {
  socket.onopen = () => {
    console.log("Conectado");
  };

  socket.onmessage = data => {
    let { message, user, history } = JSON.parse(data.data);
    let sentBy;
    if (user) user_global.value = user;
    if (message) {
      message = JSON.parse(message);
      sentBy = message.sentBy;
      mountMessage(sentBy, message.message, getTime());
    }
    if (history) {
      history.forEach(message => {
        let time = message.createdAt;
        let date = new Date(time);
        let hours = date.getHours();
        hours = hours < 10 ? `0${hours}` : hours;
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        let full_time = `${hours}:${minutes}`;
        mountMessage(message.username, message.message, full_time);
      });
    }
  };

  socket.onclose = event => {
    console.log("Desconectado", event);
    alert(event.reason);
    if (event.code === 3000 || event.code === 3001) unauthorized();
  };
  socket.onerror = () => {
    console.log("Erro!");
  };
});

const sendMessage = () => {
  if (!input.value) {
    return;
  }

  socket.send(
    JSON.stringify({ sentBy: user_global.value, message: input.value })
  );
  mountMessage(user_global.value, input.value, getTime());
  input.value = "";
};
</script>

<style scoped></style>
