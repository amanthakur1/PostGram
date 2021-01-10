import React, {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import   M                                   from 'materialize-css'  ;
import './chatScreenStyles/chatScreen.css';
import ChatList from "./chatList/ChatList";
import ChatContent from "./chatContent/chatContent";
import UserProfile from "./userProfile/UserProfile";

const ChatScreen = () => {
    const [onlinePeople,setOnlinePeople] = useState([]);
    const [socket, setSocket] = useState(null);
    const [chatWithUser, setChatWithUser] = useState(null);

    const setupSocket = () =>{
        // temporary
        return;

        const token = localStorage.getItem('jwt');
        console.log(token);
        // Socket is already set
        if(socket) return;

        const newSocket = io('http://localhost:5000',{
            query:{ token: token },
            },{ transports: ['websocket']}
        );

        newSocket.on('connect',()=>{
            M.toast({html: "Socket Connected!", classes: "#12b697 teal accent-3"});
            console.log("Socket Connected!");
        });

        newSocket.on('disconnect',()=>{
            M.toast({html: "Socket Dis-Connected!", classes: "#a91409 red"});
            console.log("Socket Dis-Connected!");
        });

        newSocket.on('new message',(data)=>{
            data = JSON.parse(data);
            console.log("NEW MESSAGE:",data.message,data);
            M.toast({
                html: `<h6>Message<h6><p>${data.message}</p><p>From: ${data.sender.name}</p>`,
                classes: "#eee5ae teal accent-3"
            });
        });

        newSocket.on('new private message',(data)=>{
            console.log("NEW PRIVATE MESSAGE:",JSON.parse(data).message);
        })

        newSocket.on('online users',(data)=>{
            console.log("ONLINE USERS:",JSON.parse(data));
            setOnlinePeople(JSON.parse(data).users);
        });
        
        console.log();
        setSocket(newSocket);
    }

    useEffect(()=>{
        setupSocket();
    },[]);

    const messageRef = useRef(null);

    const newMessage = (message) =>{
        if(!message){
            M.toast({html: "Message can't be empty!!!", classes: "#a91409 red"});
            return;
        }
        socket.emit('private message',JSON.stringify({message,toUserId:chatWithUser._id}));
    }

    return (
        <div>
            <div className="main__chatbody">
                <ChatList onlinePeople={onlinePeople} />
                <ChatContent />
                <UserProfile />
            </div>

        <>
        {/*
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-4">
                    <div style={{
                            backgroundColor: "yellow",
                            float: "left"
                    }}>
                        <h2>People Online</h2>
                        {
                            onlinePeople &&
                            onlinePeople.map(person=>{
                                return (
                                    <div
                                        key={person._id}
                                        onClick={()=>setChatWithUser(person)}
                                    >
                                        <p>{person.name}</p>
                                        <p>{person.email}</p>
                                        <hr />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="col-lg-8">
                    <div style={{
                        backgroundColor: "red",
                        float: "right"
                    }}>
                        { chatWithUser &&
                            <>
                                <p>Chatting with {chatWithUser.name}</p>
                                <input ref={messageRef} type="text" />
                                <button onClick={()=>{
                                    newMessage(messageRef.current.value);
                                    messageRef.current.value = "";
                                }}>
                                    Send Message
                                </button>
                            </>
                        }
                        { chatWithUser === null &&
                            <p>Not Chatting currently</p>
                        }
                    </div>
                </div>
            </div>
        </div>
        */}
        </>
        </div>
    )
}

export default ChatScreen;