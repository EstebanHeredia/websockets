const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);
const { getHistorial, addHistorial } = require("./historial");

const webRouter = require("./router/webRouter.js");

app.use(express.static("public"));

app.use("/", webRouter);

io.on("connection", (socket) => {
  console.log("conectado");
  const mensajes = getHistorial();
  socket.emit("mensajes", { mensajes });
  socket.on("ping", () => {
    console.log(`socket ${socket.id}`);
  });
  socket.on("mensaje", (mensaje) => {
    addHistorial(mensaje);
    const mensajes = getHistorial();
    io.sockets.emit("mensajes", { mensajes });
  });
});

const server = httpServer.listen(8080, () => {
  console.log(`escuchando en puerto ${server.address().port}`);
});
