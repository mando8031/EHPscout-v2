import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase";

const ScoutLogin = () => {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [name,setName] = useState("");
const [creating,setCreating] = useState(false);

async function handleLogin(e){


e.preventDefault();

try{

  await signInWithEmailAndPassword(auth,email,password);

  navigate("/dashboard");

}catch(err){

  alert(err.message);

}


}

async function handleCreateAccount(e){


e.preventDefault();

try{

  const result = await createUserWithEmailAndPassword(auth,email,password);

  const uid = result.user.uid;

  await setDoc(doc(db,"users",uid),{
    name:name,
    role:"scout",
    teamId:null
  });

  navigate("/team");

}catch(err){

  alert(err.message);

}


}

return (


<div style={{maxWidth:"400px",margin:"auto"}}>

  <h1>Scout Login</h1>

  {!creating && (

    <form onSubmit={handleLogin}>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={{width:"100%",padding:"10px",marginBottom:"10px"}}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        style={{width:"100%",padding:"10px",marginBottom:"10px"}}
      />

      <button style={{width:"100%",padding:"10px"}}>
        Login
      </button>

      <p style={{marginTop:"15px",cursor:"pointer"}} onClick={()=>setCreating(true)}>
        Create Account
      </p>

    </form>

  )}

  {creating && (

    <form onSubmit={handleCreateAccount}>

      <input
        placeholder="Scout Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        style={{width:"100%",padding:"10px",marginBottom:"10px"}}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={{width:"100%",padding:"10px",marginBottom:"10px"}}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        style={{width:"100%",padding:"10px",marginBottom:"10px"}}
      />

      <button style={{width:"100%",padding:"10px"}}>
        Create Account
      </button>

      <p style={{marginTop:"15px",cursor:"pointer"}} onClick={()=>setCreating(false)}>
        Back to Login
      </p>

    </form>

  )}

</div>


);

};

export default ScoutLogin;
