import React, { Component } from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";

export default class ChatList extends Component {
  allChatUsers = [
    ...this.props.onlinePeople
    // {
    //   image: "https://pbs.twimg.com/profile_images/770394499/female.png",
    //   id: 10,
    //   name: "Manpreet David",
    //   active: false,
    //   isOnline: true,
    // }
  ];
  constructor(props) {
    super(props);
    this.state = {
      allChats: this.props.onlinePeople,
    };
  }

  componentDidMount(){}

  render() {
    return (
      <div className="main__chatlist">
        <div className="chatlist__heading">
          <h2>Chats</h2>
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
          {this.state.allChats.map((item, index) => {
            return (
              <ChatListItems
                name={item.name}
                key={item._id}
                animationDelay={index + 1}
                active={item.active ? "active" : ""}
                isOnline={item.isOnline ? "active" : ""}
                image={item.image}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
