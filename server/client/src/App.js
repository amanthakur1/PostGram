import React,{useEffect, createContext, useReducer, useContext} from "react"                            ;
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
export const setupSocket = () =>{
  // Socket is already set
  if(socket) return;

  const token = localStorage.getItem('jwt');
  console.log(token);

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
    console.log("NEW PRIVATE MESSAGE:",JSON.parse(data).message);
  })

  // Receiving online users list
  socket.on('online users',(data)=>{
    data = JSON.parse(data);
    console.log("ONLINE USERS:",data);
    onlineUsersList = data.user;
  });
}

export const resetSocket = () =>{
  socket.disconnect();
  socket = null;
  onlineUsersList = [];
}
// SOCKET CONNECTION------------------------------------------------------------------


// ROUTING FOR DIFFERENT COMPONENTS---------------------------------------------------
const Routing = ()=>{
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type: "USER", payload:user});
      setupSocket();
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