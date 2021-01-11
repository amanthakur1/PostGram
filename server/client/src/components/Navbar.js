import React,{useContext, useRef,useState, useEffect} from 'react';
import { Link,useHistory } from "react-router-dom";
import {UserContext} from '../App'
import M from 'materialize-css';
// code for tool tip--------------
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

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
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])

    // using context in navbar ----------------
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const renderList = ()=>{ // render list in NAVBAR using state login or not
        if(state){
            return[
                <li> <i data-target="modal1" className="material-icons modal-trigger">search</i>  </li>,
                <li><i className="material-icons">explore</i></li>,
                <li><Link to="/myfeed">My Feed</Link></li>,
                <li><Link to="/chats"><i className="material-icons">chat</i></Link></li>,
                <li><i className="material-icons">post_add</i></li>,
                <li><Link to="/create">Add Post</Link></li>,
                <li><i className="material-icons">person</i></li>,
                <li><Link to="/profile">Profile</Link></li>,
                <li>
                    {/* <button className="logoutbtn"> */}
                    <BootstrapTooltip placement="bottom" title="Logout" arrow>
                        <i className="material-icons logoutbtn" onClick={()=>{
                            localStorage.clear();
                            dispatch({type:"CLEAR"});
                            history.push('/signin')
                        }}>power_settings_new
                        </i>
                    </BootstrapTooltip>
                    {/* </button> */}
                </li>
            ]
        }
        else{
            return[
                <li><i className="material-icons">settings</i></li>,
                <li><Link to="/reset">Reset</Link></li>,
                <li><i className="material-icons">login</i></li>,
                <li><Link to="/signin">SignIn</Link></li>,
                <li><i className="material-icons">input</i></li>,
                <li><Link to="/signup">SignUp</Link></li>
            ]
        }
    }

    // fetching user on search-------------------
    const fetchUsers = (query)=>{
        setSearch(query)
        if(query != ""){
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
                    <Link to={ state ? "/" : "/signin" } className="brand-logo left">Instagram</Link>
                </BootstrapTooltip> 
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>


            {/* Search model ------------------------------- */}
            <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
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
                                <Link to={ "/profile/" + (item._id !== state._id ? item._id : "")}>
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
        </nav>

        </>
    )

}

export default Navbar;