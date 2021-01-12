import React, { useContext, useEffect, useState } from 'react'           ;
import { socket} from                                  '../../../App'    ;
import ChatListItems from                              './ChatListItems' ;
import                                                 './chatList.css'  ;

const ChatList = ({setChatWithUserId}) => {

    const [onlineUsersListLocal, setOnlineUsersListLocal] = useState([]);

    const setupChatlist = () =>{
        const { _id: myId } = JSON.parse(localStorage.getItem("user"));
        // Receiving online users list
        socket.on('online users',(data)=>{
            data = JSON.parse(data);
            console.log(data.users);
            let onlineUsersList = [];
            if(data.users) onlineUsersList = data.users.filter((user)=>user._id !== myId);
            console.log("ONLINE USERS:",onlineUsersList);
            setOnlineUsersListLocal(onlineUsersList);
        });
        socket.emit('list online users');
    }

    useEffect(()=>{
        if(!socket) console.log("SOCKET NOT SET");
        else{
            setupChatlist();
            console.log("SOCKET SET");
        }
    },[socket]);

    return (
        <div className="main__chatlist">
            <div className="chatlist__heading">
                <h4>Online Users</h4>
                <button className="btn-nobg">
                    <i className="fa fa-ellipsis-h"></i>
                </button>
            </div>
            <div className="chatList__search">
                <div className="search_wrap">
                    <button className="search-btn">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </div>
            <div className="chatlist__items">
                {onlineUsersListLocal && onlineUsersListLocal.map((item, index) => {
                    return (
                        <span
                            key={item._id}
                            onClick={()=>setChatWithUserId(item)}
                        >
                            <ChatListItems
                                name           ={item  .name                          }
                                email          ={item .email                          }
                                key            ={item  ._id                           }
                                animationDelay ={index + 1                            }
                                active         ={item  .active ? "active" : "active"  }
                                isOnline       ={item  .isOnline ? "active" : "active"}
                                image          ={item  .pic                           }
                            />
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default ChatList;