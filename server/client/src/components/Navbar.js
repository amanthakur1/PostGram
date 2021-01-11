import React,{useContext} from 'react';
import { Link,useHistory } from "react-router-dom";
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

    // using context in navbar ----------------
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();

    const logOutFunction = () =>{
        resetSocket();
        localStorage.clear();
        dispatch({type:"CLEAR"});
        history.push('/signin');
    }

    const renderList = ()=>{ // render list in NAVBAR using state login or not
        if(state){
            return[
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
        </nav>
        {/* <Fab color="primary" aria-label="add">
            <AddIcon />
        </Fab> */}
        </>
    )

}

export default Navbar;