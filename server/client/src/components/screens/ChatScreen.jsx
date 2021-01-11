import React, {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import   M                                   from 'materialize-css'  ;
import './chatScreenStyles/chatScreen.css';
import ChatList from "./chatList/ChatList";
import ChatContent from "./chatContent/chatContent";
import UserProfile from "./userProfile/UserProfile";
import {socket, setupSocket} from '../../App';

const ChatScreen = () => {
    const [onlinePeople,setOnlinePeople] = useState([]);
    const [socket, setSocket] = useState(null);
    const [chatWithUser, setChatWithUser] = useState(null);

    const socketFunctions = () =>{

        
        
        console.log();
        // setSocket(newSocket);
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