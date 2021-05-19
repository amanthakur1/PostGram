import React, {useRef, useEffect, useState, useContext} from 'react';
import {UserContext} from '../../../App';
import ChatItem from './ChatItem';
import './chatContent.css';
import   Avatar                                          from '@material-ui/core/Avatar' ;

const ChatContent = ({ user, sendMessage, chats }) => {
    const messageRef = useRef("");
    const scrollRef = useRef(null);
    const {state} = useContext(UserContext);

    const makeFocus = () =>{
        if(messageRef.current)
            messageRef.current.focus();
        if(scrollRef.current)
            scrollRef.current.scrollIntoView({
                behavior: "smooth",block: "nearest",inline: "start"
            });
    }

    const sendMyMessage = () =>{
        sendMessage(messageRef.current.value);
        messageRef.current.value = "";
    }

    const handleKeyPressOnMessageInput = (e) =>{
        if(e.key == "Enter"){
            sendMyMessage();
        }
    }

    useEffect(()=>{
        makeFocus();
    },[chats]);

    useEffect(()=>{
        makeFocus();
    },[]);

    if(!user) return ( // no user online
        
        <div 
            className="chatlanding"
            style={{
                height:"100%",
                width:"80%",
                alignItems:"center",
                padding:"2rem"
            }}
        
        >

            <h5 
                style={{
                    color:'white',
                    fontFamily:"'Ubuntu', sans-serif",
                    marginLeft:"115px"
                }}
                >SELECT A USER FROM LIST TO START CHATS
            </h5>
            <div className="chat-landing-image"
                style={{
                    height:"92%",
                    width:"100%",
                    borderRadius:"5px"
            
                }}
            ></div>

        </div>
            

        
        
    );
    else
    return (
        <>
        <div className="main__chatcontent">
            
            
            
            {/* CHAT WITH USER HEADER --------------------------------------------------------- */}
            <div className="content__header">
                <div className="blocks">
                    <div className="current-chatting-user">
                        {/* <div className="avatar"> */}
                            <div className="chat-head-avatar">
                                {   user &&
                                    // <img 
                                    //     src={user.pic}
                                    //     alt={user.name}
                                    // />
                                    <Avatar alt={user.name} className="useravatarchat" src={user.pic} />
                                }
                            </div>
                            {/* <span className={`isOnline active`}></span> */}
                        {/* </div> */}
                        <p className="chatwithusername">
                            {
                                user && <span>{user.name}</span>
                            }
                        </p>
                    </div>
                </div>

                {/* <div className="blocks">
                    <div className="settings">
                        <button className="btn-nobg">
                            <i className="fa fa-cog"></i>
                        </button>
                    </div>
                </div> */}
            </div>
            {/* CHAT WITH USER HEADER --------------------------------------------------------- */}
            
            <div className="content__body">
                <div className="chat__items">
                    { chats &&
                        chats.map((item, index) => {
                            return (
                                <ChatItem
                                    animationDelay={index + 2}
                                    key={index}
                                    user={item.by === "other" ? "other" : "me"}
                                    msg={item.msg}
                                    image={item.by === "other" ? user.pic : state.pic}
                                />
                            );
                        })
                    }
                </div>
                <div ref={scrollRef} />
            </div>


            {/* MESSAGE INPUT BOX--------------------------------------------------------- */}
            <div className="content__footer">
                <div className="sendNewMessage">
                    <input
                        type="text"
                        placeholder="Type a message here..."
                        ref={messageRef}
                        onKeyPress={handleKeyPressOnMessageInput}
                        style = {{color: "white"}}
                    />
                    <span
                        className="btnSendMsg material-icons"
                        id="sendMsgBtn"
                        onClick={() => sendMyMessage()}
                    >
                        send
                    </span>
                </div>
            </div>
            {/* MESSAGE INPUT BOX--------------------------------------------------------- */}
      </div>
      </>
    );
}

export default ChatContent;