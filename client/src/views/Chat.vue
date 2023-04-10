<script setup>
import { ref, onMounted } from "vue";

const input = ref(null);
const auth = ref(null);

const enumClassStyle = {
  sent: "sent text-start bg-primary text-white rounded p-2 ms-auto mb-3",
  received:
    "received text-start bg-secondary text-white rounded p-2 me-auto mb-3",
  time: "time font-monospace ms-3",
};

const messages = ref(null);

onMounted(() => {
  console.log(messages.value);
});

const mountMessage = (message, typeMessage) => {
  const chatMessage = document.createElement("li");
  chatMessage.setAttribute("class", typeMessage);
  chatMessage.setAttribute("style", "width: fit-content");
  chatMessage.textContent = message;

  const chatTime = document.createElement("span");
  chatTime.setAttribute("class", enumClassStyle.time);
  chatTime.textContent = new Date()
    .toLocaleTimeString("pt-BR")
    .split(":", 2)
    .join(":");

  chatTime.style.fontSize = "11px";
  chatMessage.appendChild(chatTime);

  messages.value.appendChild(chatMessage);
};

const url = window.location.href;
const queryString = new URLSearchParams(new URL(url).search);
const token = queryString.get("token");

const socket = new WebSocket(`ws://localhost:3000/chat?token=${token}`);
onMounted(() => {
  socket.onopen = () => {
    console.log("Conectado");
    auth.value = true;
  };

  // Recebendo mensagem
  socket.onmessage = message => {
    console.log(message.data)
    mountMessage(message.data, enumClassStyle.received);
  };
  socket.onclose = invalid => {
    console.log("Desconectado");
    auth.value = false;
    if (invalid) document.write("Nào foi possível autenticar");
  };
  socket.onerror = () => {
    console.log("Erro!");
  };
});

const sendMessage = () => {
  if (!input.value) {
    return;
  }

  mountMessage(input.value, enumClassStyle.sent);
  // Envia para o websocket
  socket.send(input.value);
  // Limpa input
  input.value = "";
};
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <div class="container my-3">
      <ul class="list-unstyled" ref="messages"></ul>
    </div>

    <div class="container mt-auto bg-white p-3">
      <div class="input-group">
        <input type="text" class="form-control" id="input" v-model="input" />

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
