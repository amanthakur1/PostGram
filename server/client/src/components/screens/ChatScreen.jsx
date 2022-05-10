import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import M from 'materialize-css';
import { UserContext, ChatContext } from '../../App';
import './chatComponents/chatScreen.css';
import './chatComponents/userProfile.css';
import ChatList from './chatComponents/ChatList';
import ChatContent from './chatComponents/ChatContent';
import { Link } from 'react-router-dom';

// code for tool tip--------------
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}
// <BootstrapTooltip placement="right" title="Visit Profile" arrow>
// code for tool tip--------------


export var GlobalSocket = null;

const ChatScreen = () => {
    const { state          }                    = useContext(UserContext);
    const { chatState, chatDispatch} = useContext(ChatContext);
    const [ onlinePeople  , setOnlinePeople ]   = useState  ([]         );
    const [ chatWithUserId, setChatWithUserId ] = useState  (""         );
    const [ socket        , setSocket ]         = useState  (null       );

    useEffect(()=>{
    },[]);

    // SETUP SOCKET FOR COMMUNICATION------------------------------------------------------
    const setupSocket = () =>{
        if(GlobalSocket !== null){
            setSocket(GlobalSocket);
            return;
        }
        setSocket({socketInitiated: true});

        const {_id: myId} = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem('jwt');
        
        // CREATE SOCKET-------------------------------------------------------------------
        const newSocket = io(
            process.env.NODE_ENV === "production" ? `` : `http://localhost:${process.env.PORT || 5000}`,{
            query:{ token: token },
            },{ transports: ['websocket']}
        );
        GlobalSocket = newSocket;
        setSocket(newSocket);
    
        // SOCKET CONNECT------------------------------------------------------------------
        newSocket.on('connect',()=>{
            M.toast({html: `🌐 <span style="color:black">User Mode Online!</span>`, classes: "#12b697 teal accent-3"});
            // console.log("Socket Connected!");
        });
    
        // SOCKET DISCONNECT---------------------------------------------------------------
        newSocket.on('disconnect',()=>{
            M.toast({html: `❗ <span style="color:black" > User Mode Offline!</span>`, classes: "#a91409 red"});
            // console.log("Socket Dis-Connected!");
        });
    
        // RECEIVING PRIVATE MESSAGE--------------------------------------------------------
        newSocket.on('new private message',(data)=>{
            data = JSON.parse(data);
            chatDispatch({
                type: "NEW_MESSAGE",
                payload: {
                    message: data.message,
                    by: "other",
                    otherUserEmail: data.sender.email
                }
            });
        });
    
        // RECEIVING ONLINE USERS LIST-----------------------------------------------------
        newSocket.on('online users',(data)=>{
            data = JSON.parse(data);
            let onlineUsersList = [];
            if(data.users) onlineUsersList = data.users.filter((user)=>user._id !== myId);
            setOnlinePeople(onlineUsersList);
        });
    }

    // SENDING NEW PRIVATE MESSAGES--------------------------------------------------------
    const newMessage = (message) =>{
        if(!message){
            M.toast({html: `⚠️<span style="color:black" >Message can't be empty!!!</span>`, classes: "yellow red"});
            return;
        }

        // Adding message to my storage
        chatDispatch({
            type: "NEW_MESSAGE",
            payload: {
                message: message,
                by: "me",
                otherUserEmail: chatWithUserId.email
            }
        });

        // Sending message to server
        socket.emit(
            'private message',
            JSON.stringify({
                message: message,
                toUserId: chatWithUserId._id
            })
        );
    }


    // RENDER CHAT SCREEN------------------------------------------------------------------
    const renderChatScreen = () =>{
        if(state){
            if(socket === null){
                setSocket({socketInitiated: true});
                setupSocket();
            }
            return(
                <div className="main__chatbody">
                    <ChatList
                        setChatWithUserId={setChatWithUserId} 
                        onlinePeople={onlinePeople}
                    />
                    
                    <ChatContent
                        user={chatWithUserId}
                        sendMessage={newMessage}
                        chats = {
                            chatWithUserId ? 
                              [...chatState.chatData.filter(item=>item.email === chatWithUserId.email)]
                            : []
                        }
                    />
                    
                    {/* CHAT WITH USER PROFILE */}
                    {   chatWithUserId !== "" &&
                        <div className="main__userprofile">
                            <div className="profile__card user__profile__image">
                                <div className="profile__image">
                                    <img src={chatWithUserId.pic} alt="profile" />
                                </div>

                                <BootstrapTooltip placement="bottom" title="Visit Profile" arrow>
                                    <Link to={`/profile/${chatWithUserId._id}`} 
                                        onClick={()=>{
                                            try{
                                                document.getElementById("chatclose").click();
                                            }catch(e){
                                                console.log("Chat can't close..");
                                            }
                                        }}
                                    >
                                        <h5 style={{color: "blue"}}>
                                            {chatWithUserId.name}
                                        </h5>
                                        <h6>{chatWithUserId.email}</h6>
                                    </Link>
                                </BootstrapTooltip>
                                
                            </div>
                        </div>
                    }
                </div>
            );
        }
        else return(<></>);
    }

    useEffect(()=>{
        return () =>{ // ComponentWillUnMount
            // console.log("Unmount");
            try{
                socket.disconnect();
                // console.log("SOCKET DISCONNECTED");
                GlobalSocket = null;
                // console.log("GLOBAL SOCKET NULL");
            }catch(err){}
            setSocket(null);
        }
    },[]);

    return (<>{renderChatScreen()}</>);
}

export default ChatScreen;