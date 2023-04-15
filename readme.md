# Chat Real-Time

## Recursos

- Autenticação de usuários com token **JWT**
- Mensagem em grupo
- Histórico de conversas

## Informações

- SQLite como banco de dados compacto
- Websocket nativo do browser
- Axios para requisições

---

## Requisitos:

Para executar este aplicativo no seu computador,é necessário apenas do [Node](https://nodejs.org/en) e [Git](https://git-scm.com/downloads).

## Instalação

Clone o projeto para o seu computador

```bash
git clone https://github.com/marcusduraes/chat-realtime.git
```

Mude para o diretório `server` e instale as dependências:

```bash
cd server
npm install
```
Faça o build
```bash
npm run build
```

Rode o servidor com:
```bash
npm run dev
```

Pronto! Servidor já configurado e rodando, agora o mesmo processo no `client`:

Mude para o diretório `client`:

```bash
cd ../client
```

Instale as dependências:
```bash
npm install
```

Rode o servidor de desenvolvimento do `client`:

```bash
npm run dev
```

### *__Importante__*
Para se autenticar e usar o chat, é necessário que crie os usuários, para criar os usuários, recomendo o PostMan

Deve seguir a seguinte estrutura:
![App Screenshot](https://i.imgur.com/Omtstu5.png)

Com os usuários já criados, está tudo pronto!

Agora basta acessar o endereço: [http://localhost:5173/](http://localhost:5173/) e realizar o login


