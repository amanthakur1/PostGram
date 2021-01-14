import React from 'react';
import './chatList.css';
import   Avatar                                          from '@material-ui/core/Avatar' ;

const ChatListItems = ({ name, email, animationDelay, active, isOnline, image }) => {
    return (
        <div
            style={{ animationDelay: `0.${animationDelay}s` }}
            // onClick={this.selectChat}
            className={`chatlist__item ${active ? active : ""}`}
        >
            {/* AVATAR */}
            {/* <div className="avatar">
                <div className="avatar-img">
                    <img src={image} alt="#" />
                </div>
                <span className={`isOnline ${isOnline}`}></span>
            </div> */}
            <Avatar alt={name} className="useravatarchat" src={image} />

        
            {/* USERNAME */}
            <div className="userMeta">
                <p>{name}</p>
                {/* <span className="activeTime">{email}</span> */}
            </div>
        </div>
    );
}

export default ChatListItems;