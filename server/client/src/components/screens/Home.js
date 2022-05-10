import React, { useState ,useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import M from 'materialize-css' ;
import Loader from '../loader/Loader';

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


const Home = () => {
    const [ data, setData ] = useState([]);
    const { state } = useContext(UserContext);
    const myInfo = JSON.parse(localStorage.getItem("user"));

    // Fecting post from database-------------------
    useEffect(() => {
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setData(result.posts);
        });
    },[]);

    // Fecting post from database-------------------
    const like_unlike_effect = (element_id, cssClass) => {
        const like_unlike_effect_icon = document.getElementById(element_id+"-like-effect");
        like_unlike_effect_icon.classList.toggle(cssClass);
        setTimeout(function() {
            like_unlike_effect_icon.classList.remove(cssClass);
        }, 1000);
    }

    // like -unlike -----------------------
    const likePost = (id) => {
        like_unlike_effect(id,"fade-red");
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const unlikePost = (id)=>{
        like_unlike_effect(id,"fade-white");
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // like -unlike -----------------------

    
    // comment ---------------------------
    const makeComment = (text, postId) => {
        if(!text){
            M.toast({html: `⚠️<span style="color:black" > Comment can't be Empty...</span>`, classes:"yellow red accent-2" })
            return;
        }

        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // comment ---------------------------

    // deleting Post ---------------------
    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result);
            const newData = data.filter(item=>{
                return item._id !== result._id;
            })
            setData(newData)
        })
    }

    // deleting Post ---------------------

    // deleting comment -------------------
    const deleteComment = (postid, commentid) => {
   
        fetch(`/deletecomment/${postid}/${commentid}`, {
          method: "delete",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => res.json())
        .then((result) =>{
            
            // console.log(result);
            const newData = data.map((item) => {
            if (item._id === result._id) {
                return result;
            } 
            else{
                return item;
            }
        });
        setData(newData);
        });
    };

    // deleting comment -------------------
    // const nameref = useRef([]);

    return(
        <div className="home">
                {
                    data.length ===0 &&
                    <Loader />
                }

                {
                    data.map((item, index)=>{
                        return(
                            <div className="card home-card" key={item._id}>
                                <h5 className="post-header" style={{display:"flex"}}> {/* for navigating to profile of user */}
                                        
                                        <BootstrapTooltip placement="right" title="Visit Profile" arrow>
                                            <Link style={{display:"flex"}}className="username" to={
                                                        item.postedBy._id === state._id // Post Owner
                                                        ? "/profile"
                                                        : "profile/"+item.postedBy._id // Not post owner - Navigate To User Profile
                                                    }
                                            >   
                                                <Avatar alt={item.postedBy.name} className="useravatar" src={item.postedBy.pic} />
                                                <span className="username">{item.postedBy.name}</span>
                                                
                                            </Link>
                                        </BootstrapTooltip>
                                    
                                        { // to show delete button-------------------------------------
                                            item.postedBy._id === state._id 
                                            &&  
                                            <BootstrapTooltip placement="left" title="Delete Post" arrow>
                                                <span className="material-icons deletepost"
                                                        onClick={()=>deletePost(item._id)}
                                                    >delete
                                                </span>
                                            </BootstrapTooltip>
                                        } 
                                    
                                </h5>
                                <div className="card-image">
                                    
                                        <i 
                                            className="material-icons"
                                            id = {item._id+"-like-effect"}
                                        >
                                            favorite
                                        </i>
                                    <img
                                        alt = ""
                                        src={item.photo}
                                        onDoubleClick={()=>{
                                            item.likes.includes(myInfo._id) ? unlikePost(item._id) : likePost(item._id)
                                        }}
                                    />
                                </div>
                                <div className="card-content">
                                    {/* <i className="material-icons">favorite</i> */}

                                    { //concept for stopping multiple likes--------------------------
                                        item.likes.includes(state._id)
                                        ?
                                        <BootstrapTooltip placement="left-start" title="Unlike" arrow>
                                            <i className="material-icons" onClick={
                                                ()=>{unlikePost(item._id)}
                                            }>favorite</i>
                                        </BootstrapTooltip>
                                        :
                                        <BootstrapTooltip placement="left" title="Like" arrow>
                                            <i className="material-icons" onClick={
                                                ()=>{likePost(item._id)}
                                            }>favorite_border </i>
                                        </BootstrapTooltip>

                                    }
                                    <span className="material-icons">message</span>
                                    
                                    <h6>{item.likes.length} Likes</h6>
                                    <h6>{item.title}</h6>
                                    <h6><span style={{fontWeight:"lighter"}}>{item.body}</span></h6>
                                    {/* <p style={{fontWeight:"lighter"}}></p> */}
                                    
                                    {/* <ul className="collapsible">
                                        <li>
                                            <div className="collapsible-header">
                                            <i className="material-icons">filter_drama</i>
                                            First
                                            <span className="new badge">4</span></div>
                                            <div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
                                        </li>
                                        <li>
                                            <div className="collapsible-header">
                                            <i className="material-icons">place</i>
                                            Second
                                            <span className="badge">1</span></div>
                                            <div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
                                        </li>
                                    </ul> */
                                    }
                                    


                                    {
                                        item.comments.map(record=>{

                                            return( // commments---------------------------------------
                                                <h6 key={record._id} >
                                                    <span>{record.postedBy.name}</span>  
                                                    <span style={{fontWeight:"lighter"}}> {record.text}</span> 
                                                    
                                                    { ((item.postedBy._id === state._id) || (state._id === record.postedBy._id))
                                                    // (record.postedBy._id  ||  item.postedBy._id) == state._id 
                                                        && (
                                                        <BootstrapTooltip placement="left" title="Delete Comment" arrow>   
                                                            <i
                                                            className="material-icons"
                                                            style={{
                                                            float: "right",
                                                            }}
                                                            onClick={() => deleteComment(item._id, record._id)}
                                                            >
                                                            remove_circle_outline
                                                            </i>
                                                        </BootstrapTooltip> 
                                                    )}
                                                </h6>
                                            )
                                        })
                                    }
                                    {/* <div className="commentbox" >
                                        <form 
                                            id="commentform"
                                            onSubmit={(e)=>{
                                            e.preventDefault();
                                            makeComment(e.target[0].value,item._id)
                                        }}>
                                            <input type="text" placeholder="Add a comment.... " />
                                            <button type="submit" form="commentform"> <span className="material-icons"> send </span></button>
                                        </form>

                                    </div> */}
                                    {/* <div className="commentbox">
                                        <input 
                                            type="text"  
                                            ref= {commentRef} 
                                            placeholder="Add a comment.... " 
                                            onChange={(e)=>{
                                                commentRef.current.value = e.target.value;
                                            }}
                                        />
                                        <span 
                                            className="material-icons"
                                            onClick={()=>{
                                                makeComment(commentRef.current.value, item._id);
                                                commentRef="";
                                            }}
                                        > send 
                                        </span>
                                         
                                    </div> */}
                                    <div className="commentbox">
                                        <input
                                            type="text"
                                            placeholder="Type a Comment here..."
                                            id={`comment-post-${item._id}`}
                                        />
                                        <BootstrapTooltip placement="left-start" title="Make Comment" arrow>
                                            <span
                                                className="material-icons"
                                                
                                                onClick={()=>{
                                                    makeComment(document.getElementById(`comment-post-${item._id}`).value, item._id);
                                                    document.getElementById(`comment-post-${item._id}`).value = "";
                                                }}
                                            >
                                                send
                                            </span>
                                        </BootstrapTooltip>   
                                    </div>
                                </div>
                            </div>

                        )
                    })
                }
            {/* </FadeIn> */}
           
        </div>

    )

}

export default Home;