import enumStyle from "../enumStyle";

const mountMessageCommon = (user, sentBy, content, time) => {
  const sendingUser = sentBy === user;
  const ul = document.querySelector("#messages");
  const li = document.createElement("li");

  li.setAttribute(
    "class",
    sendingUser ? enumStyle.li_sent : enumStyle.li_received
  );
  ul.appendChild(li);

  if (!sendingUser) {
    const header_li = document.createElement("div");
    header_li.setAttribute("class", "header");
    header_li.textContent = sentBy;
    li.appendChild(header_li);
  }

  const content_li = document.createElement("div");
  content_li.setAttribute("class", "content");
  content_li.textContent = content;

  const time_span = document.createElement("span");
  time_span.setAttribute("class", "time font-monospace ms-3");
  time_span.textContent = time;

  content_li.appendChild(time_span);

  li.appendChild(content_li);
};

export default mountMessageCommon;
