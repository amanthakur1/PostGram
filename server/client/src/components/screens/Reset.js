import  React , {useState, useContext} from 'react'           ;
import {Link  , useHistory}            from 'react-router-dom';
import  M                              from 'materialize-css' ;

const Reset = ()=>{


    // network req------------------------------
    const  history            = useHistory(  )
    const [email  , setEmail] = useState  ("")

    const PostData = ()=>{

        // Email regex ------
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email Format...", classes:"#ff5252 red accent-2"})
            return;
        }
        // Email regex ------

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
            console.log(data);

            if(data.error){
                M.toast({html: data.error, classes:"#ff5252 red accent-2" })
            }
            else{
                M.toast({html:data.message, classes:"#43a047 green darken-1" })
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
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                
                <button className="waves-effect waves-light btn" onClick={() => PostData()} >Reset</button>

                <h6>Don't want to Change? <Link to='/signin'>SignIn</Link></h6>

                
            </div>    

        </div>
 
    )

}

export default Reset;