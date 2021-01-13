import React,{useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'

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


const Profile = ()=>{

    const [mypics,setPics] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [image,setImage] = useState("")
    // const [url, setUrl] = useState("");

    // fetching profile from the db---------------
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result);
            setPics(result.mypost);
        })
    },[])
    // fetching profile from the db---------------

    // Updating profile pic----------------------
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name","amanthakur")
            fetch("https://api.cloudinary.com/v1_1/amanthakur/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                // setUrl(data.url);
                // console.log(data);
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    // console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                    //window.location.reload()
                })
            
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },image)
    const updatePhoto = (file)=>{
        setImage(file)
    }
    // Updating profile pic----------------------


    return(
        <div style={{maxWidth:"850px", margin: "0px auto"}}>
            <div className= "details"
            style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid black"
            }}>
                <div>
                    <img
                        alt = ""
                        style={{
                            width:"160px", 
                            height:"160px", 
                            borderRadius:"80px",
                            border:"2px solid black"
                        }} 
                        src={state ? state.pic : "Loading.."}
                    />
                </div>
                <div className="info">
                    <h4> {/* name and update profile pic */}

                        {state ? state.name : "Loading..."}
                         
                        {/* <i className="followbtn material-icons" 
                            // onClick={ ()=>{ updatePhoto() } }
                            > add_a_photo
                        </i> */}
                        <div className="file-field">
                            <BootstrapTooltip placement="top" title="Upload Profile Pic" arrow> 
                                <span className="followbtn material-icons"> add_a_photo 
                                    <input type="file" onChange={(e)=> updatePhoto(e.target.files[0])}/> 
                                </span>
                            </BootstrapTooltip>
                        </div>
                    </h4>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"110%"
                    }}>
                        <h6>{mypics.length} Posts</h6>
                        <h6>{state ? state.followers.length : "Loading..."} Followers</h6>
                        <h6>{state ? state.following.length : "Loading..."} Following</h6>
                    </div>
                </div>

            </div>
                    
        
            <div className="gallary">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>

                        )
                    })
                }

                </div>
        </div>
    )

}

export default Profile;