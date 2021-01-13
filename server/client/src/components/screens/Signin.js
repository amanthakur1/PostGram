import  React       , {useState, useContext} from 'react'           ;
import {Link        , useHistory}            from 'react-router-dom';
import {UserContext}                         from '../../App'
import  M                                    from 'materialize-css' ;

const Signin = ()=>{

    // context 
    const {state, dispatch} = useContext(UserContext);

    // network req------------------------------
    const  history                = useHistory(  )
    const [password, setPassword] = useState  ("")
    const [email   , setEmail]    = useState  ("")

    const PostData = ()=>{

        // Email regex ------
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegex.test(email)){
            M.toast({html: "Invalid Email Format...", classes:"#ff5252 red accent-2"})
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
        .then(data=>{
            // console.log(data);

            if(data.error){
                M.toast({html: data.error, classes:"#ff5252 red accent-2" })
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                history.push('/')
                dispatch({type: "USER", payload:data.user});

                M.toast({html:"SignedIn Successful...", classes:"#43a047 green darken-1" })
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
                <button className="waves-effect waves-light btn" onClick={() => PostData()} >SignIn</button>

                <h6>Don't have an Account? <Link to='/signup'>SignUp</Link></h6>

                
            </div>    

        </div>
 
    )

}

export default Signin;