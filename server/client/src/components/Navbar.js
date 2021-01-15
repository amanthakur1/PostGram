import   React        ,{useContext, useRef,useState, useEffect} from 'react'                      ;
import { Link         ,useHistory }                             from "react-router-dom"           ;
import   M                                                      from 'materialize-css'            ;
import { UserContext }                                          from '../App'                     ;
import   Avatar                                                 from '@material-ui/core/Avatar'   ;
import   postgramlogo                                           from "./images/postgram-512px.png" ;
import   ChatScreen, {GlobalSocket} from './screens/ChatScreen'      ;

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

const Navbar = ()=>{
    const  searchModal = useRef(null);
    const  chatsModal = useRef(null);
    const emailInputRef = useRef(null);
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])

    // using context in navbar ----------------
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();


    useEffect(()=>{
        M.Modal.init(searchModal.current);
        M.Modal.init(chatsModal.current);
    },[])

    const logOutFunction = () =>{
        try{
            GlobalSocket.disconnect();
            GlobalSocket = null;
        }catch(err){}
        sessionStorage.clear();
        localStorage.clear();
        dispatch({type:"CLEAR"});
        history.push('/signin');
        window.location.reload();
    }

    const renderList = ()=>{ // render list in NAVBAR using state login or not
        let signedInNavbar = [
            <BootstrapTooltip placement="bottom" title="Search Users"     arrow> 
                <i  
                    data-target="modal1" 
                    className="material-icons modal-trigger"
                    onClick={()=> setTimeout(()=>document.getElementById("search-text-box").focus(), 100)} // focus for input tag
                >search
                </i>
            </BootstrapTooltip>,
            <i data-target="chats-modal" className="material-icons modal-trigger">chat</i>,
            <Link to="/myfeed"  > <i className="material-icons">explore  </i></Link>,
            <Link to="/create"  > <i className="material-icons">post_add </i></Link>,
            <Link to="/profile" > <i className="material-icons">person   </i></Link>,
            <BootstrapTooltip placement="bottom" title="Logout" arrow>
                <i className="material-icons logoutbtn left" onClick={()=>{
                    logOutFunction();
                }}>power_settings_new
                </i>
            </BootstrapTooltip>
        ]
        
        let signedOutNavbar = [
            <BootstrapTooltip placement="bottom" title="Developers"     arrow>
                <a href="https://github.com/amanthakur1/PostGram" target="_blank"> 
                    <i className="fas fa-code" aria-hidden="true"></i> 
                </a>
            </BootstrapTooltip>
            ,
        ]

        if(state){
            signedInNavbar = signedInNavbar.map((item,index)=><li key={index}>{item}</li>);
            return signedInNavbar;
        }
        else{
            signedOutNavbar = signedOutNavbar.map((item,index)=><li key={index}>{item}</li>);
            return signedOutNavbar;
        }
    }

    // fetching user on search-------------------
    const fetchUsers = (query)=>{
        setSearch(query)
        if(query !== ""){
            fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
            }).then(res=>res.json())
            .then(results=>{
            setUserDetails(results.user)
            })
        }
    }
    // fetching user on search-------------------


    return(
        <>
        <nav>
            <div className="nav-wrapper blue-grey darken-4">
            <BootstrapTooltip placement="bottom" title="Home" arrow>   
                
                <Link to={ state ? "/" : "/signin" } className="brand-logo left">
                    <img 
                        style={{
                            height:'44px',
                            width:'44px',
                            marginRight:'10px',
                            marginBottom:'5px'

                        }}
                        src={postgramlogo} 
                        alt="Postgram"
                    />
                    PostGram
                </Link>
            </BootstrapTooltip> 
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>


            {/* Search model ------------------------------- */}
            <div 
                id="modal1"
                className="modal"
                ref={searchModal}
                style={{color:"black"}}
                
            >

                <span className="modal-close material-icons modelbtn"
                    onClick={()=>{
                        setSearch('');
                        setUserDetails([]);
                    }}
                >
                        cancel
                </span>

                <div className="modal-content">
                    
                    <input
                        id="search-text-box"
                        type="text"
                        placeholder="Search Users.."
                        
                        value={search}
                        onChange={(e)=>fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails.map((item,index)=>{
                            return (
                                <div className="collection-item" key={index}>
                                    <h5 className="post-header" style={{display:"flex"}}
                                        onClick={()=>{
                                            M.Modal.getInstance(searchModal.current).close()
                                            setSearch('');
                                            setUserDetails([]);
                                        }}
                                    > {/* for navigating to profile of user */}
                                        <BootstrapTooltip placement="right" title="Visit Profile" arrow>
                                            <Link 
                                                style={{display:"flex"}}
                                                className="username" 
                                                key = {item._id}
                                                to = { "/profile/" + (item._id !== state._id ? item._id : "")}
                                            >   
                                                <Avatar alt={item.name} className="useravatar" src={item.pic} />
                                                <span className="username">{item.name}</span>
                                                
                                            </Link>
                                        </BootstrapTooltip> 
                                    </h5>


                                {
                                /* 
                                    <Link 
                                        key = {item._id}
                                        to = { "/profile/" + (item._id !== state._id ? item._id : "")}
                                        >
                                        <h5
                                            
                                            onClick={()=>{
                                                M.Modal.getInstance(searchModal.current).close()
                                                setSearch('');
                                                setUserDetails([]);
                                            }}
                                        >
                                            {item.name}
                                        </h5>
                                    </Link>  
                                    */
                                }
                                {/* <p>{item.email}</p> */}
                                </div>
                            )
                        })}    
                    </ul>
                </div>

                
            </div>

            {/* Search model ------------------------------- */}


            {/* CHATS MODAL------------------------------------------------------------------- */}
            <div
                id="chats-modal"
                className="modal"
                ref={chatsModal}
                style={{
                    color:"black",
                    width: "100vw",
                    minHeight: "100vh",
                    marginTop: "0px"
                }}
            >   
                <span id="chatclose" className="modal-close material-icons chatclose"
                    onClick={()=>{
                    // setSearch('');
                    // setUserDetails([]);
                    }}
                >
                    cancel
                </span>
                

                <div className="modal-content chatmodalcontent">
                    
                    <ChatScreen />
                </div>
                {/* <div className="modal-footer">
                    <button
                        className="modal-close waves-effect waves-light btn"
                        onClick={()=>{}}
                    >
                        close
                    </button>
                </div> */}
            </div>
            {/* CHATS MODAL------------------------------------------------------------------- */}
        </nav>

        </>
    )

}

export default Navbar;