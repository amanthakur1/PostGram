import React , {useState, useEffect} from 'react';
import { useHistory} from 'react-router-dom';
import M from 'materialize-css';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// code for tool tip--------------
import { makeStyles } from '@material-ui/core/styles' ;
import   Tooltip      from '@material-ui/core/Tooltip';

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
// code for tool tip--------------
// <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title="Add">
{/* <LinearProgressWithLabel value={progress} /> */}
// </Tooltip>
function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };


const CreatePost = () =>{

    const  history            = useHistory(  );
    const [title  , setTitle] = useState  ("");
    const [body   , setBody]  = useState  ("");
    const [image  , setImage] = useState  ("");
    const [url    , setUrl]   = useState  ("");
    const [progress, setProgress] = useState(0);


    useEffect(() => { // waiting for url to fetch from cloudinary
        if(url){
            // Req for server -------------------------------
            setProgress(60);
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")

                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                    
                })
            })
            .then(res=>res.json())
            .then(data=>{
                // console.log(data);

                if(data.error){
                    setProgress(0);
                    M.toast({html: `❌ ${data.error}`, classes:"#ff5252 red accent-2" })
                }
                else{
                    setProgress(100);
                    M.toast({html:"✔️ Post Uploaded...", classes:"#43a047 green darken-1" })
                    history.push('/')
                }
                // console.log(data);
            }).catch(err=>{
                setProgress(0);
                console.log(err);
                M.toast({html: `⚠️<span style="color:black" > Something went Wrong...</span>`, classes:"yellow red accent-2" })
            })
        }

    }, [url])


    // Posting image to cloudinary ---------------------
    const postDetails = () =>{

        if(!title || !body){
            M.toast({html: `⚠️<span style="color:black" > Please provide suitable title & description...</span>`, classes:"yellow red accent-2" })
            return;
        }

        setProgress(10);

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
            setUrl(data.url);
            setProgress(50);
            // console.log(data);
        })
        .catch(err=>{
            setProgress(0);
            console.log(err);
            M.toast({html: `⚠️<span style="color:black" > Something went Wrong...</span>`, classes:"yellow red accent-2" })
        })
        
    }
        // Posting image to cloudinary ---------------------
        


    return(

        <div className="card input-field" style={{
            margin:"7rem auto",
            maxWidth:"750px",
            padding: "20px",
            textAlign:"center"
        }}>
            <input type="text" placeholder="Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />
            <input type="text" placeholder="Caption"
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            />


            <div className="file-field input-field">
                
                <BootstrapTooltip placement="right-start" title="Add Image" arrow>
                    <span className="material-icons btncls"> add_a_photo 
                        <input type="file" onChange={(e)=> setImage(e.target.files[0])}/> 
                    </span>
                </BootstrapTooltip>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" maxLength="100" size='100' />
                </div>
            </div>
            {
                !progress 
                ? 
                    <BootstrapTooltip placement="top" title="Upload Post" arrow>
                        <button className="waves-effect waves-light btn" onClick={()=>postDetails()} >Upload</button>
                    </BootstrapTooltip>   

                :
                
                    <LinearProgressWithLabel value={progress} />


            }    

        </div>

    )

}
export default CreatePost;