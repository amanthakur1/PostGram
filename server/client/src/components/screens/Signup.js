import React, {useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import M from 'materialize-css';

const Signup = ()=>{

    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    // network req------------------
    const PostData = ()=>{

        // Email regex ------
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email Format...", classes:"#ff5252 red accent-2"})
            return;
        }
        // Email regex ------

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
                M.toast({html: data.error, classes:"#ff5252 red accent-2" })
            }
            else{
                M.toast({html: data.message, classes:"#43a047 green darken-1" })
                history.push('/signin')
            }
            // console.log(data);
        }).catch(err=>{
            console.log(err);
        })
    }
    // network req------------------

    return(
        <div className="mycard">
            <div className="card auth-card input-field" >
                <h2>Instagram</h2>
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
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="waves-effect waves-light btn" onClick={()=>PostData()}>SignUp</button>
                <h6>Already have an Account? <Link to='/signin'>SignIn</Link></h6>
                
            </div>    

        </div>
        
    )
    

}

export default Signup;