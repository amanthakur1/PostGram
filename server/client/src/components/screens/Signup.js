import React, { useState } from 'react';
import { Link , useHistory } from "react-router-dom";
import M from 'materialize-css';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Validators from '../../utils/Validators';

const Signup = () => {
    const history = useHistory();
    const [ name, setName ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ signupRequest, setSignupRequest ] = useState(false);

    // network req------------------
    const PostData = ()=>{
        setSignupRequest(true);
        if(Validators.isEmailInValid(email)){
            M.toast({html: `⚠️<span style="color:black" > Invalid Email Format...</span>`, classes:"yellow red accent-2" })
            setSignupRequest(false);
            return;
        }
        // Email regex ------

        if(password !== confirmPassword){
            M.toast({html: `⚠️<span style="color:black" > Passwords did not match...</span>`, classes:"yellow red accent-2" })
            setSignupRequest(false);
            return;
        }

        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: `❌ ${data.error}`, classes:"#ff5252 red accent-2" })
                setSignupRequest(false);
            }else{
                M.toast({html:`✔️ ${data.message}`, classes:"#43a047 green darken-1" })
                history.push('/signin')
            }
            // console.log(data);
        }).catch(err=>{
            console.log(err);
            setSignupRequest(false);
        })
    }
    // network req------------------

    return(
        <div className="mycard">
            <div className="card auth-card input-field" >
                <h2>Sign Up</h2>
                <input 
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value = {password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <input
                    type = "password"
                    placeholder = "Confirm Password"
                    value = {confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    style = {{marginBottom: "25px"}}
                />
                
                {
                    signupRequest ? 
                        <p><CircularProgress /></p>
                    :
                        <button className="waves-effect waves-light btn" onClick={()=>PostData()}>
                            SignUp
                        </button>
                }
                <h6>Already have an Account? <Link to='/signin'>SignIn</Link></h6>
            </div>    

        </div>
        
    )
    

}

export default Signup;