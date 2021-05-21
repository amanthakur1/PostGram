import   React      , { useState } from 'react'           ;
import { useHistory, useParams}    from 'react-router-dom';
import   M                         from 'materialize-css' ;

const NewPassword = ()=>{


    const  history                = useHistory(  )
    const [password, setPassword] = useState  ("")
    const {token   }              = useParams (  );

    // console.log(token);

    const PostData = ()=>{

        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
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
                type="password"
                placeholder="Enter New Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="waves-effect waves-light btn" onClick={() => PostData()} >Update Password</button>
                
            </div>    

        </div>
 
    )

}

export default NewPassword;
