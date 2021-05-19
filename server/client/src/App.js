import React,{useEffect, createContext, useReducer, useContext } from "react"                            ;
import                                                                './App.css'                        ;
import Navbar from                                                    "./components/Navbar"              ;
import { BrowserRouter, Route , Switch , useHistory} from             "react-router-dom"                 ;
import Home from                                                      "./components/screens/Home"        ;
import Signin from                                                    "./components/screens/Signin"      ;
import Signup from                                                    "./components/screens/Signup"      ;
import Profile from                                                   "./components/screens/Profile"     ;
import CreatePost from                                                "./components/screens/CreatePost"  ;
import UserProfile from                                               "./components/screens/UserProfile" ;
import MyFeed from                                                    "./components/screens/MyFeed"      ;
import Reset from                                                     "./components/screens/Reset"       ;
import NewPassword from                                               "./components/screens/NewPassword" ;


import {reducer, initialState} from './reducers/userReducer';
import {chatReducer, chatInitialState} from './reducers/chatReducer';
import Default from "./components/Default";

// import {UserContext} from '../../App'

// ------------Context Creation-----------------

export const UserContext = createContext()
export const ChatContext = createContext()
// ------------Context Creation-----------------


// ROUTING FOR DIFFERENT COMPONENTS---------------------------------------------------
const Routing = ()=>{
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  const { chatDispatch } = useContext(ChatContext);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));

    if(user){
      dispatch({type: "USER", payload:user});
      chatDispatch({type:"INIT"});
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
        <Route           component = {Default} />
      </Switch>
  );
}
// ROUTING FOR DIFFERENT COMPONENTS---------------------------------------------------


// MAIN APP---------------------------------------------------------------------------
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [chatState, chatDispatch] = useReducer(chatReducer, chatInitialState);

  return (
    <UserContext.Provider value= {{state, dispatch}}>
      <ChatContext.Provider value = {{chatState, chatDispatch}}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </ChatContext.Provider>
    </UserContext.Provider>
  );
}
// MAIN APP---------------------------------------------------------------------------

export default App;