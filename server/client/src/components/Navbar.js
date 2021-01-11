import React,{useContext, useRef,useState, useEffect} from 'react';
import { Link,useHistory } from "react-router-dom";
import M from 'materialize-css';
import {UserContext, resetSocket} from '../App'
// code for tool tip--------------
import { makeStyles } from '@material-ui/core/styles';
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

    const logOutFunction = () =>{
        resetSocket();
        localStorage.clear();
        dispatch({type:"CLEAR"});
        history.push('/signin');
    }

    const renderList = ()=>{ // render list in NAVBAR using state login or not
        if(state){
            return[
                <li> <i data-target="modal1" className="material-icons modal-trigger">search</i>  </li>,
                <li key={0}><Link to="/myfeed" ><i className="material-icons">explore </i></Link></li>,
                <li key={1}><Link to="/chats"  ><i className="material-icons">chat    </i></Link></li>,
                <li key={2}><Link to="/create" ><i className="material-icons">post_add</i></Link></li>,
                <li key={3}><Link to="/profile"><i className="material-icons">person  </i></Link></li>,
                <li key={4}>
                    {/* <button className="logoutbtn"> */}
                    <BootstrapTooltip placement="bottom" title="Logout" arrow>
                        <i className="material-icons logoutbtn" onClick={()=>{
                            logOutFunction();
                        }}>power_settings_new
                        </i>
                    </BootstrapTooltip>
                    {/* </button> */}
                </li>
            ]
        }
        else{
            return[
                <li key={0}><Link to="/reset" ><i className="material-icons left">settings</i>Reset </Link></li>,
                <li key={1}><Link to="/signin"><i className="material-icons left">login   </i>SignIn</Link></li>,
                <li key={2}><Link to="/signup"><i className="material-icons left">input   </i>SignUp</Link></li>
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
                <Link to={ state ? "/" : "/signin" } className="brand-logo left">PostGram</Link>
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