import React, {useEffect, useState, useRef, useContext, useReducer} from 'react'                             ;
import io from                                   'socket.io-client'                  ;
import M from                                    'materialize-css'                   ;
import                                           './chatScreenStyles/chatScreen.css' ;
import './chatComponents/userProfile.css';
import ChatList from                             './chatComponents/ChatList'         ;
import ChatContent from './chatComponents/ChatContent';
import {socket, setupSocket, UserContext} from                '../../App'                         ;
import {reducer} from '../../reducers/userReducer';

const ChatScreen = () => {
    const [onlinePeople,setOnlinePeople] = useState([]);
    const [mySocket, setMySocket] = useState(null);
    const [chatWithUserId, setChatWithUserId] = useState("");
    const { state, dispatch } = useContext(UserContext);
    // const [ mystate ] = useReducer(reducer, state);


    useEffect(()=>{
        if(socket !== null) setMySocket(socket);
    },[socket]);

    useEffect(()=>{
        if(state && state.messages) console.log("NEW MESSAGES FROM STATE",state.messages);
    },state);

    const messageRef = useRef(null);

    const newMessage = (message) =>{
        if(!message){
            M.toast({html: "Message can't be empty!!!", classes: "#a91409 red"});
            return;
        }

        let GlobalStateMessages = state.messages;
        console.log(GlobalStateMessages);

        // NEVER CHATTED WITH THIS USER
        const otherPersonEmail = chatWithUserId.email.toString();
        if(GlobalStateMessages === {} || !GlobalStateMessages[otherPersonEmail]){
            GlobalStateMessages[otherPersonEmail] = {};
            GlobalStateMessages[otherPersonEmail].user = chatWithUserId;
            GlobalStateMessages[otherPersonEmail].messages = [];
        }

        GlobalStateMessages[otherPersonEmail].messages.push({by:"me", msg: message});

        // dispatch({type: "NEW-MESSAGE", payload:GlobalStateMessages});

        mySocket.emit('private message',JSON.stringify({message,toUserId:chatWithUserId._id}));
    }

    return (
        <div>
            <div className="main__chatbody">
                <ChatList setChatWithUserId={setChatWithUserId} />
                <ChatContent
                    user={chatWithUserId}
                    sendMessage={newMessage}
                />
                
                {console.log(state)}





                {/* CHAT WITH USER PROFILE */}
                {   chatWithUserId !== "" &&
                    <div className="main__userprofile">
                        <div className="profile__card user__profile__image">
                            <div className="profile__image">
                                <img src={chatWithUserId.pic} />
                            </div>
                            <h5>{chatWithUserId.name}</h5>
                            <h6>{chatWithUserId.email}</h6>
                        </div>
                        <div className="profile__card">
                            {/*
                            <div className="card__header" onClick={this.toggleInfo}>
                                <h4>Information</h4>
                                <i className="fa fa-angle-down"></i>
                            </div>
                            */}
                            <div className="card__content"></div>
                        </div>
                    </div>
                }
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