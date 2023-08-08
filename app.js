import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./src/routes/views.routes.js";
import { Server } from "socket.io";

const app = express();
const port = 8000;

const httpServer = app.listen(port, () => {
  console.log("Servidor escuchando en puerto " + port);
});
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRouter);

socketServer.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.emit("socket_individual", "Hola desde el cliente #1");
});
