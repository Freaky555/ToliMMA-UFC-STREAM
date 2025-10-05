import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Debug log for Render
console.log("Serving static files from:", path.join(__dirname, "public"));

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Redirect root to host.html
app.get("/", (req, res) => {
  res.redirect("/host.html");
});

// Fallback for missing routes
app.use((req, res) => {
  res.status(404).send("File not found: " + req.originalUrl);
});

// WebSocket setup
io.on("connection", socket => {
  socket.on("offer", data => socket.broadcast.emit("offer", data));
  socket.on("answer", data => socket.broadcast.emit("answer", data));
  socket.on("candidate", data => socket.broadcast.emit("candidate", data));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port " + PORT));
