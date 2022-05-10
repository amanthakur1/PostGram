import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import * as Validators from '../../utils/Validators';

const Reset = () => {
    const history = useHistory();
    const [ email, setEmail ] = useState("");

    const PostData = () => {
        if(Validators.isEmailInValid(email)){
            M.toast({html: `⚠️<span style="color:black" > Invalid Email Format...</span>`, classes:"yellow red accent-2" })
            return;
        }

        fetch('/reset-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email                
            })
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data);

            if(data.error){
                M.toast({html: `❌ ${data.error}`, classes:"#ff5252 red accent-2" })
            }
            else{
                M.toast({html:`✔️ ${data.message}`, classes:"#43a047 green darken-1" })
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
                <h2>PostGram</h2>
                <input 
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    style = {{marginBottom: "20px"}}
                />
                
                <button className="waves-effect waves-light btn" onClick={() => PostData()} >Reset</button>

                <h6><Link to='/signin'>SignIn</Link></h6>

                
            </div>    

        </div>
 
    )

}

export default Reset;