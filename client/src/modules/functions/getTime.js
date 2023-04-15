const getTime = () => {
  let time = new Date().toLocaleTimeString("pt-BR");
  return (time = time.split(":", 2).join(":"));
};

export default getTime;
