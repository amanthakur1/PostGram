import React, {useEffect, useState, useRef, useContext} from 'react'                            ;
import io from                                               'socket.io-client'                 ;
import M from                                                'materialize-css'                  ;
import { UserContext } from                                  '../../App'                        ;
import                                                       './chatComponents/chatScreen.css'  ;
import                                                       './chatComponents/userProfile.css' ;
import ChatList from                                         './chatComponents/ChatList'        ;
import ChatContent from                                      './chatComponents/ChatContent'     ;
import { Link } from 'react-router-dom';

// code for tool tip--------------
import { makeStyles }               from '@material-ui/core/styles'  ;
import   Tooltip                    from '@material-ui/core/Tooltip' ;

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
    const [ onlinePeople  , setOnlinePeople ]   = useState  ([]         );
    const [ debugChats    , setDebugChats]      = useState  ([]         );
    const [ chatWithUserId, setChatWithUserId ] = useState  (""         );
    const [ socket        , setSocket ]         = useState  (null       );
    const [ chats         , setChats ]          = useState  ([]         );

    useEffect(()=>{
        try{
            let {chatData} = JSON.parse(sessionStorage.getItem("chatData"));
            setChats(chatData);
        }catch(err){}
    },[]);

    const addMessageToChats = (data,by) =>{
        let otherUser = by==="me" ? chatWithUserId : data.sender;

        // ADD MESSAGES TO SESSION STORAGE-------------------------------------------------
        let {chatData} = JSON.parse(sessionStorage.getItem("chatData"));
        chatData = [...chatData, {
            msg:data.message,
            by: by,
            email: otherUser.email
        }]
        setChats(chatData);
        sessionStorage.setItem("chatData",JSON.stringify({chatData:chatData}));
    }

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
        const newSocket = io(`http://localhost:${process.env.PORT || 5000}`,{
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
    
        // RECEIVING PRIVATE UPDATE--------------------------------------------------------
        newSocket.on('new private message',(data)=>{
            data = JSON.parse(data);
            // console.log("NEW PRIVATE MESSAGE:",data.message, data);
            addMessageToChats(data,"other");
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

        // console.log("new msg by me",chatWithUserId);
        addMessageToChats({message:message}, "me");
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
                              [...chats.filter(item=>item.email === chatWithUserId.email)]
                            : []
                        }                    
                        debugChats={debugChats}
                        state={state}
                    />
                    
                    {/* CHAT WITH USER PROFILE */}
                    {   chatWithUserId !== "" &&
                        <div className="main__userprofile">
                            <div className="profile__card user__profile__image">
                                <div className="profile__image">
                                    <img src={chatWithUserId.pic} />
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