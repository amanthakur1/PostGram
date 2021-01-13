import React, {useRef, useEffect} from 'react';
import ChatItem from './ChatItem';
import './chatContent.css';

const ChatContent = ({ user, sendMessage, chats, state }) => {
    const messageRef = useRef("");
    const scrollRef = useRef(null);

    useEffect(()=>{
        if(scrollRef.current)scrollRef.current.scrollIntoView({behavior: "smooth",block: "nearest",inline: "start"});
    },[scrollRef]);

    useEffect(()=>{
        if(scrollRef.current)scrollRef.current.scrollIntoView({behavior: "smooth",block: "nearest",inline: "start"});
    },[chats]);

    if(!user) return (<h5>SELECT A USER FROM LIST TO START CHATS</h5>);
    else
    return (
        <>
        <div className="main__chatcontent">
            
            
            
            {/* CHAT WITH USER HEADER --------------------------------------------------------- */}
            <div className="content__header">
                <div className="blocks">
                    <div className="current-chatting-user">
                        <div className="avatar">
                            <div className="avatar-img">
                                {   user &&
                                    <img 
                                        src={user.pic}
                                        alt={user.name}
                                    />
                                }
                            </div>
                            <span className={`isOnline active`}></span>
                        </div>
                        <p>
                            {
                                user && <span>{user.name}</span>
                            }
                        </p>
                    </div>
                </div>

                <div className="blocks">
                    <div className="settings">
                        <button className="btn-nobg">
                            <i className="fa fa-cog"></i>
                        </button>
                    </div>
                </div>
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
                    />
                    <button
                        className="btnSendMsg"
                        id="sendMsgBtn"
                        onClick={()=>{
                            if(messageRef.current.value !== "") sendMessage(messageRef.current.value);
                            messageRef.current.value = "";
                        }}
                    >
                        <i className="material-icons">send</i>
                    </button>
                </div>
            </div>
            {/* MESSAGE INPUT BOX--------------------------------------------------------- */}
      </div>
      </>
    );
}

export default ChatContent;