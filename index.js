const socket = io();
socket.emit("message", "Hola desde el cliente");
