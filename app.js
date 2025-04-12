const express=require('express')
const path=require('path');
// const { Socket } = require('socket.io');
const app=express()
const PORT=process.env.PORT ||4000
const server=app.listen(PORT,()=>console.log(`server on port ${PORT}`));

const io=require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')));

const socketConnected = new Set();

io.on("connection", (socket) => {
    socketConnected.add(socket.id);
    console.log(`Socket connected: ${socket.id}`);
    io.emit('clients-total', socketConnected.size);

     socket.on('message',(data)=>{
         console.log(data)
          socket.broadcast.emit('chat-message',data)
  })

     socket.on('message', (data) => {
         console.log('Message received:', data);
         socket.broadcast.emit('chat-message', data);
       });

    
    socket.on("disconnect", () => {
        socketConnected.delete(socket.id);
        console.log(`Socket disconnected: ${socket.id}`);

        io.emit('clients-total', socketConnected.size);
    });
});

//     socket.on('message',(data)=>{
//         console.log(data)
//          socket.broadcast.emit('chat-message',data)
//  })


io.on("connection", (socket) => {
    // other socket.on(...) handlers

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
});


//  socket.on('feedback',(data) =>{
//     socket.broadcast.emit('feedback',data)

//  })
  



