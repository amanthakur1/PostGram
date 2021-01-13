const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT ||5000;
const {MONGOURI} = require('./config/keys');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config/keys');



mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log("[DATABASE CONNECTED]");
});

mongoose.connection.on('error',(err)=>{
    console.log("[DATABASE CONNECTION ERROR]:",err);
});

require('./models/user');
require('./models/post');
const User = mongoose.model("User");

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));


// for heroku-----------
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


const server = app.listen(PORT,()=>{
    console.log("[SERVER RUNNING PORT:",PORT,"]");
});


// SOCKET
const io = require('socket.io')(server,{
    cors:{
        origin: process.env.NODE_ENV == "production" ? 
              ""
            : "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let OnlineUsers = [];
const printSendOnlineUsersList = () =>{
    try{
        console.log("[USERS ONLINE:",OnlineUsers.length,"]",OnlineUsers.map((user)=>user.name));
        io.sockets.emit(
            'online users',
            JSON.stringify({
                users: [...OnlineUsers.map(item=>{
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        pic: item.pic
                    }
                })]
            })
        );
    }catch(err){}
}

const getOnlineUser= (userOrSocketId)=>{
    try{
        return OnlineUsers.find((onlineUser)=>onlineUser._id == userOrSocketId || onlineUser.socketId == userOrSocketId);
    }catch(err){}
}

io.use((socket, next)=>{
    try{
        console.log("[NEW SOCKET REQUEST]");
        const token = socket.handshake.query.token;
        const payload = jwt.verify(token, JWT_SECRET);
        socket.userId = payload._id;

        User.findById(payload._id)
        .then((user)=>{
            const { _id, name, email, pic } = user;
            OnlineUsers = [...OnlineUsers, { _id, name, email, pic, socketId: socket.id }];
            // console.log("[NEW USER]",user.name,user._id,user);
            printSendOnlineUsersList();
        }).catch(err=>{
            console.log("online user error:",err);
        });
        next();
    }catch(err){}
});

io.on('connection', (socket)=>{
    // socket.on('message', (data)=>{
    //     socket.emit('new message', data);
    // });

    // LIST ONLINE USERS
    socket.on('list online users',()=>{
        try{
            io.to(socket.id).emit('online users',JSON.stringify({users:OnlineUsers}));
        }catch(err){}
    });

    // PRIVATE MESSAGING
    socket.on('private message',(data)=>{
        try{
            data = JSON.parse(data);
            // console.log("sender userid:",socket.id);
            const sender = getOnlineUser(socket.id);
            const receiver = getOnlineUser(data.toUserId);
            // console.log(sender,receiver);
            data.sender = sender;
            delete data.toUserId;
            // io.sockets.socket(receiver.socketId).emit('new private message',JSON.stringify(data));
            io.to(receiver.socketId).emit('new private message',JSON.stringify(data));
        }catch(err){}
    });

    // USER DISCONNECTS
    socket.on('disconnect',()=>{
        try{
            console.log("[DISCONNECTED]:",socket.userId);
            User.findById(socket.userId)
            .then((user)=>{
                OnlineUsers = OnlineUsers.filter(user=>user._id != socket.userId);
                console.log("[USER LEFT]",user.name,user._id);
                printSendOnlineUsersList();
            }).catch(err=>{
                console.log("online user error:",err);
            });
        }catch(err){}
    });
});