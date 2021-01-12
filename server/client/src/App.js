import React,{useEffect, createContext, useReducer, useContext, useState} from "react"                            ;
import                                                               './App.css'                        ;
import Navbar from                                                   "./components/Navbar"              ;
import { BrowserRouter, Route , Switch , useHistory} from            "react-router-dom"                 ;
import Home from                                                     "./components/screens/Home"        ;
import Signin from                                                   "./components/screens/Signin"      ;
import Signup from                                                   "./components/screens/Signup"      ;
import Profile from                                                  "./components/screens/Profile"     ;
import CreatePost from                                               "./components/screens/CreatePost"  ;
import UserProfile from                                              "./components/screens/UserProfile" ;
import MyFeed from                                                   "./components/screens/MyFeed"      ;
import Reset from                                                    "./components/screens/Reset"       ;
import NewPassword from                                              "./components/screens/NewPassword" ;
import ChatScreen from                                               './components/screens/ChatScreen'  ;
import io from                                                       'socket.io-client'                 ;
import M from                                                        'materialize-css'                  ;


import {reducer, initialState} from './reducers/userReducer'

// import {UserContext} from '../../App'

// ------------Context Creation-----------------

export const UserContext = createContext()

// ------------Context Creation-----------------


// SOCKET CONNECTION------------------------------------------------------------------
export var socket = null;
export var onlineUsersList = [];
export var allChats = {};
export const setupSocket = () => console.log("SOCKET CALLED");
export const SetupMainSocket = () =>{
  // Socket is already set
  const { dispatch } = useContext(UserContext);

  // const setMessagesInReducerState = (data) =>{
  //   return;
  //   let GlobalStateMessages = state.messages;
  //     console.log(GlobalStateMessages);

  //   // NEVER CHATTED WITH THIS USER
  //   const otherPersonEmail = data.sender.email.toString();
  //   if(!GlobalStateMessages[otherPersonEmail]){
  //       GlobalStateMessages[otherPersonEmail] = {};
  //       GlobalStateMessages[otherPersonEmail].user = data.sender;
  //       GlobalStateMessages[otherPersonEmail].messages = [];
  //   }

  //   GlobalStateMessages[otherPersonEmail].messages.push({by:"other", msg:data.message});

  //   dispatch({type: "NEW-MESSAGE", payload:GlobalStateMessages});
  // }

  if(socket) return <></>;

    try{
      const {_id: myId} = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem('jwt');
    
      socket = io('http://localhost:5000',{
        query:{ token: token },
        },{ transports: ['websocket']}
      );
    
      socket.on('connect',()=>{
        M.toast({html: "Socket Connected!", classes: "#12b697 teal accent-3"});
        console.log("Socket Connected!");
      });
    
      socket.on('disconnect',()=>{
        M.toast({html: "Socket Dis-Connected!", classes: "#a91409 red"});
        console.log("Socket Dis-Connected!");
      });
    
      socket.on('new message',(data)=>{
          data = JSON.parse(data);
          console.log("NEW MESSAGE:",data.message,data);
          M.toast({
              html: `<h6>Message<h6><p>${data.message}</p><p>From: ${data.sender.name}</p>`,
              classes: "#eee5ae teal accent-3"
          });
      });
    
      // Receiving private messages
      socket.on('new private message',(data)=>{
        data = JSON.parse(data);
        console.log("NEW PRIVATE MESSAGE:",data.message, data);
        // setMessagesInReducerState(data);
        dispatch({type: "NEW-MESSAGE", payload: data});
      })
    
      // Receiving online users list
      socket.on('online users',(data)=>{
        data = JSON.parse(data);
        // console.log(data.users);
        if(data.users) onlineUsersList = data.users.filter((user)=>user._id !== myId);
        // console.log("ONLINE USERS:",onlineUsersList);
      });
    }catch(err){
      console.log(err,"APP JS MAIN SOCKET SETUP")
    }
  

  return <></>;
}

export const resetSocket = () =>{

  try{socket.disconnect();}
  catch(err){console.log(err)}
  socket = null;
  allChats = {};
  onlineUsersList = [];
}
// SOCKET CONNECTION------------------------------------------------------------------


// ROUTING FOR DIFFERENT COMPONENTS---------------------------------------------------
const Routing = ()=>{
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  // dispatch({type: "MESSAGES", payload:{messagesActive:true}});

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type: "USER", payload:user});
      // history.push('/');
    }else{
      if(!history.location.pathname.startsWith('/reset')) history.push('/signin');
    }
  },[])

  return(
      <Switch>
        <Route exact path="/"                component = {Home        } />
        <Route       path="/signin"          component = {Signin      } />
        <Route       path="/signup"          component = {Signup      } />
        <Route exact path="/profile"         component = {Profile     } />
        <Route exact path="/profile/:userid" component = {UserProfile } />
        <Route       path="/create"          component = {CreatePost  } />
        <Route       path="/myfeed"          component = {MyFeed      } />
        <Route exact path="/reset"           component = {Reset       } />
        <Route       path="/reset/:token"    component = {NewPassword } />
        <Route       path="/chats"           component = {ChatScreen  } />
      </Switch>
  );
}
// ROUTING FOR DIFFERENT COMPONENTS---------------------------------------------------


// MAIN APP---------------------------------------------------------------------------
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value= {{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}
// MAIN APP---------------------------------------------------------------------------

export default App;