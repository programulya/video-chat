var app = require("http").createServer(handler),
    fs = require("fs"),
    io = require("socket.io").listen(app);

app.listen(8080);

function handler(req, res) {
    fs.readFile(__dirname + "/index.html", function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end("Error loading index.html");
        }

        console.log(res);
        res.writeHead(200);
        res.end(data);
    });
}

var messages = [];
var clients = 0;

var rtc = io
    .of("/rtc")
    .on("connection", function(socket) {
        ++clients;
        socket.emit("clients", {clients: clients});
        socket.broadcast.emit("connected", {clients: clients});
        socket.on("disconnect", function() {
            --clients;
            socket.broadcast.emit("disconnected", {clients: clients});
        });
        socket.on("offer", function(data) {
            socket.broadcast.emit("offer", data);
        });
        socket.on("answer", function(data) {
            socket.broadcast.emit("answer", data);
        });
        socket.on("candidate", function(data) {
            socket.broadcast.emit("candidate", data);
        })
    });