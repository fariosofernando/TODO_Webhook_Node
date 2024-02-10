require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
app.use(express.json());

const tasks = [];

io.on("connection", (socket) => {
	console.log("Cliente conectado");

	socket.on("disconnect", () => {
		console.log("Cliente desconectado");
	});
});

app.post("/webhook", (req, res) => {
	const newTask = req.body.task;
	tasks.push(newTask);
	console.log(tasks);

	io.emit("nova_tarefa", newTask);

	res.status(200).json({ message: "Tarefa recebida com sucesso" });
});

app.get("/todo", (req, res) => {
	res.status(200).json({ tasks });
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
