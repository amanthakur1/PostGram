import   React       ,{useContext, useRef,useState, useEffect} from 'react'            ;
import { Link        ,useHistory }                             from "react-router-dom" ;
import   M                                                     from 'materialize-css'  ;
import { UserContext}                                          from '../App'           ;
// code for tool tip--------------
import { makeStyles } from '@material-ui/core/styles' ;
import   Tooltip      from '@material-ui/core/Tooltip';
import ChatScreen, {GlobalSocket} from './screens/ChatScreen';

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
            <i data-target="modal1" className="material-icons modal-trigger">search</i>,
            <Link to="/myfeed" ><i className="material-icons">explore </i></Link>,
            <i data-target="chats-modal" className="material-icons modal-trigger">chat</i>,
            <Link to="/create" ><i className="material-icons">post_add</i></Link>,
            <Link to="/profile"><i className="material-icons">person  </i></Link>,
            <BootstrapTooltip placement="bottom" title="Logout" arrow>
                <i className="material-icons logoutbtn" onClick={()=>{
                    logOutFunction();
                }}>power_settings_new
                </i>
            </BootstrapTooltip>
        ]
        
        let signedOutNavbar = [
            <Link to="/reset" ><i className="material-icons left">settings</i>Reset </Link>,
            <Link to="/signin"><i className="material-icons left">login   </i>SignIn</Link>,
            <Link to="/signup"><i className="material-icons left">input   </i>SignUp</Link>
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
            <div className="nav-wrapper black">
            <BootstrapTooltip placement="bottom" title="Home" arrow>   
                <Link to={ state ? "/" : "/signin" } className="brand-logo left">PostGram</Link>
            </BootstrapTooltip> 
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>


            {/* Search model ------------------------------- */}
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="Search Users.."
                        value={search}
                        onChange={(e)=>fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails.map(item=>{
                            return (
                                <Link 
                                    key = {item._id}
                                    to = { "/profile/" + (item._id !== state._id ? item._id : "")}
                                >
                                    <li
                                        className="collection-item"
                                        onClick={()=>{
                                            M.Modal.getInstance(searchModal.current).close()
                                            setSearch('');
                                            setUserDetails([]);
                                        }}
                                    >
                                        <h5>{item.name}</h5>
                                        <p>{item.email}</p>
                                    </li>
                                </Link> 
                            )
                        })}    
                    </ul>
                </div>
                <div className="modal-footer">
                    <button
                        className="modal-close waves-effect waves-light btn"
                        onClick={()=>{
                            setSearch('');
                            setUserDetails([]);
                        }}
                    >
                        close
                    </button>
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
                <div className="modal-content">
                    <ChatScreen />
                </div>
                <div className="modal-footer">
                    <button
                        className="modal-close waves-effect waves-light btn"
                        onClick={()=>{}}
                    >
                        close
                    </button>
                </div>
            </div>
            {/* CHATS MODAL------------------------------------------------------------------- */}
        </nav>

        </>
    )

}

export default Navbar;