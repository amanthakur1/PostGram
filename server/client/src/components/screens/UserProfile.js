import React,{useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom';


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


const Profile = ()=>{

    const [userProfile,setProfile] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [showfollow, setShowFollow] = useState(true)
    useEffect(() => {
        setShowFollow(state && !state.following.includes(userid))
    }, state) // logic for follow unfollow button

    // console.log(userid);

    // fetching profile from the db for other person---------------
    useEffect(()=>{

        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result);
            setProfile(result);
        })
    },userid)
    // fetching profile from the db for other---------------

    // following peoples----------------------------
    const followUser = () =>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId: userid
            })
            
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data);
            dispatch({type:"UPDATE",payload:{following: data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })

    }
    // following peoples----------------------
    // unfollowing peoples----------------------------
    const unfollowUser = () =>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId: userid
            })
            
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data);
            dispatch({type:"UPDATE",payload:{following: data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id ) // filtering 
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
             setShowFollow(true)
        })

    }
    // unfollowing peoples----------------------



    return(
        <>
        { userProfile ? //loader for profile
            
            <div style={{maxWidth:"850px", margin: "0px auto"}}>
                <div className= "details"
                style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid black"
                }}>
                    <div>
                        <img style={{
                            width:"160px", 
                            height:"160px", 
                            borderRadius:"80px",
                            border:"2px solid black "
                            }} 
                            src={userProfile.user.pic}
                        />
                    </div>
                    <div className="info">
                        <h4>   
                            {userProfile.user.name}
                            {
                                showfollow // check for following
                                ?
                                <BootstrapTooltip placement="right" title="Follow User" arrow>
                                    <i className="followbtn material-icons" onClick={
                                        ()=>{followUser()}
                                        }> person_add
                                    </i>
                                </BootstrapTooltip>
                                :
                                <BootstrapTooltip placement="right" title="UnFollow User" arrow>
                                    <i className="followbtn material-icons" onClick={
                                            ()=>{unfollowUser()}
                                        }> person_remove
                                    </i>
                                </BootstrapTooltip>

                            }
                        </h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{
                            display:"flex",
                            justifyContent:"space-between",
                            width:"110%"
                        }}>
                            <h6>{userProfile.posts.length} Posts</h6>
                            <h6>{userProfile.user.followers.length} Followers</h6>
                            <h6>{userProfile.user.following.length} Following</h6>
                        </div>

                        
                    
                    </div>

                </div>
                        
            
                <div className="gallary">
                    {
                        userProfile.posts.map(item=>{
                            return(
                                <img key={item._id} className="item" src={item.photo} alt={item.title}/>

                            )
                        })
                    }

                    </div>
            </div>
            
        : <h2 className="profileloading">Loading ....</h2>
        }  
        </>
    )

}

export default Profile;