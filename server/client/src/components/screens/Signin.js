import  React            , {useState, useContext} from 'react'                              ;
import {Link             , useHistory}            from 'react-router-dom'                  ;
import {UserContext, ChatContext}                         from '../../App'
import  M                                         from 'materialize-css'                    ;
import  CircularProgress                          from '@material-ui/core/CircularProgress';
import * as Validators from '../../utils/Validators';


const Signin = ()=>{

    // context 
    const { dispatch } = useContext(UserContext);
    const { chatDispatch } = useContext(ChatContext);

    // network req------------------------------
    const history = useHistory();
    const [ password, setPassword ] = useState("");
    const [ email   , setEmail] = useState("");
    const [ signinRequest, setSigninRequest ] = useState(false);

    const PostData = () => {
        setSigninRequest(true);
        if(Validators.isEmailInValid(email)){
            M.toast({html: `⚠️<span style="color:black" >&nbsp;Invalid Email Format...</span>`, classes:"yellow red accent-2"})
            setSigninRequest(false);
            return;
        }
        // Email regex ------

        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(res=>res.json())
        .then(data => {
            if(data.error){
                M.toast({html: `❌ ${data.error}`, classes:"#ff5252 red accent-2" })
                setSigninRequest(false);
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                history.push('/')
                dispatch({type: "USER", payload:data.user});
                chatDispatch({type: "INIT"});

                M.toast({html:`✔️ SignedIn Successful...`, classes:"#43a047 green darken-1" })
            }
            // console.log(data);
        }).catch(err => {
            console.log(err);
            M.toast({html: `⚠️<span style="color:black" >Something went wrong!!!</span>`, classes: "yellow red"});
            setSigninRequest(false);
        })
    }
    // network req------------------


    return(
        <div className="mycard">
            <div className="card auth-card input-field" style={{paddingBottom: "5px"}}>
                <h2>Sign In</h2>
                <input 
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                {
                    signinRequest === false ?
                        <button className="waves-effect waves-light btn mt-4" onClick={() => PostData()}>SignIn</button>
                    : <div align="center"><CircularProgress /></div>
                }
                <h6 style={{marginTop:"25px"}}>Don't have an Account? <Link to='/signup'>Register</Link></h6>
                <p><Link to="/reset" >Forgot Password?</Link></p>           
            </div>
        </div>
    )
}

export default Signin;