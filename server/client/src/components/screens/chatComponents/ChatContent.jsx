import React, {useRef} from 'react';
import './chatContent.css'

const ChatContent = ({user, sendMessage}) => {
    const messageRef = useRef("");

    if(!user)
        return (
            <h5>
                SELECT A USER FROM LIST TO START CHATS
            </h5>
        );
    
    else
    return (
        <div className="main__chatcontent">
            
            
            {/* CHAT WITH USER HEADER --------------------------------------------------------- */}
            <div className="content__header">
                <div className="blocks">
                    <div className="current-chatting-user">
                        <div className="avatar">
                            <div className="avatar-img">
                                <img 
                                    src={user.pic}
                                    alt={user.name}
                                />
                            </div>
                            <span className={`isOnline active`}></span>
                        </div>
                        <p>{user.name}</p>
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
            {/* {this.state.chat.map((itm, index) => {
              return (
                <ChatItem
                  animationDelay={index + 2}
                  key={itm.key}
                  user={itm.type ? itm.type : "me"}
                  msg={itm.msg}
                  image={itm.image}
                />
              );
            })} */}
            {/* <div ref={this.messagesEndRef} /> */}
                </div>
            </div>


            {/* MESSAGE INPUT BOX--------------------------------------------------------- */}
            <div className="content__footer">
                <div className="sendNewMessage">
                    {/* <button className="addFiles">
                        <i className="fa fa-plus"></i>
                    </button> */}
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
    );
}

export default ChatContent;