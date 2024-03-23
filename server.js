const port = 8000;
const io = require("socket.io")(port , {
    cors: {
      origin: '*',
    }
  });

console.log("server running at port " + port);

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