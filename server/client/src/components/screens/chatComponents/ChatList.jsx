import React, { useContext, useEffect, useState } from 'react'          ;
import {UserContext} from              '../../../App'   ;
import ChatListItems from                  './ChatListItems';
import                                     './chatList.css' ;

const ChatList = () => {

    const [onlineUsersListLocal, setOnlineUsersListLocal] = useState([]);
    const {state, dispatch} = useContext(UserContext);

    // useEffect(()=>{
    //     const {_id: myId} = JSON.parse(localStorage.getItem("user"));
    //     socket.on('online users',(data)=>{
    //         data = JSON.parse(data);
    //         if(data.users) setOnlineUsersListLocal(data.users.filter((user)=>user._id !== myId));
    //     });
    //     socket.emit('list online users');
    // },[]);

    useEffect(()=>{
        console.log(state);
    },[]);

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
                        <ChatListItems
                            name           ={item  .name                          }
                            email          ={item .email                          }
                            key            ={item  ._id                           }
                            animationDelay ={index + 1                            }
                            active         ={item  .active ? "active" : "active"  }
                            isOnline       ={item  .isOnline ? "active" : "active"}
                            image          ={item  .pic                           }
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default ChatList;