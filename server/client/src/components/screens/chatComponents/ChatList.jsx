import React, { useEffect, useState } from 'react'           ;
import ChatListItems from                              './ChatListItems' ;
import                                                 './chatList.css'  ;

const ChatList = ({ setChatWithUserId, onlinePeople }) => {

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
                {onlinePeople && onlinePeople.map((item, index) => {
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