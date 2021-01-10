import React,{useContext} from 'react';
import { Link,useHistory } from "react-router-dom";
import {UserContext} from '../App'

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

    // using context in navbar ----------------
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();


    const renderList = ()=>{ // render list in NAVBAR using state login or not
        if(state){
            return[
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
        </nav>
        {/* <Fab color="primary" aria-label="add">
            <AddIcon />
        </Fab> */}
        </>
    )

}

export default Navbar;