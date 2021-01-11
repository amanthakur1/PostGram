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