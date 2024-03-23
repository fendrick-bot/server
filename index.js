// const port = 8000;
// const io = require("socket.io")(port , {
//     cors: {
//       origin: '*',
//     }
//   });

// console.log("server running at port " + port);

// const userlist = {};

// io.on('connection' , socket =>{
//     socket.on('user-join' , name =>{
//         userlist[socket.id] = name;
//         socket.broadcast.emit('new-user' , name + " joined");
//     });
//     socket.on('msg-send' , messege =>{
//         socket.broadcast.emit('msg-rec', {msg : messege, name : userlist[socket.id]});
//     });
//     socket.on('disconnect' , name =>{
//         console.log("user left " + userlist[socket.id]);
//         socket.broadcast.emit('user-left' , userlist[socket.id] + " left");
//         delete userlist[socket.id];
//     });
// })

const http = require('http');
const express = require('express');
const { Server: SocketIO } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server);
const PORT = process.env.PORT || 8000;

const userlist = {};

io.on('connection' , socket =>{
    socket.on('user-join' , name =>{
        userlist[socket.id] = name;
        socket.broadcast.emit('new-user' , name + " joined");
    });
    socket.on('msg-send' , messege =>{
        socket.broadcast.emit('msg-rec', {msg : messege, name : userlist[socket.id]});
    });
    socket.on('disconnect' , name =>{
        console.log("user left " + userlist[socket.id]);
        socket.broadcast.emit('user-left' , userlist[socket.id] + " left");
        delete userlist[socket.id];
    });
})

app.get('/home', function(req, res,next) {  
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static( path.resolve('./client') ));

app.get('/users', (req, res) => {
    return res.json(Array.from(userlist));
});

server.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));