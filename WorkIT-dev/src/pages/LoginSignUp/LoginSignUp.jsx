import { useContext, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import './LoginSignUp.css'

import { 
    signInWithEmailAndPassword, createUserWithEmailAndPassword,signInWithPopup
  } from 'firebase/auth';
  import {auth,database,provider} from '../../database/firebaseConfig';
  import {UserContext} from "../../context/userContext";

import company_logo from '../../assets/images/workit logo 1.svg';
import google_logo from '../../assets/images/google.png';
import { LoaderContext } from '../../context/loaderContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginSignUp = () =>{

    const mrLoader = useContext(LoaderContext);
    const userInstance = useContext(UserContext);
    const [isFunctionLoading,setIsFunctionLoading] = useState(false);
    const [action, setAction] = useState("Sign Up");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPasssword,setConfirmPassword] = useState("");
    const [submitButtonDisable,setsubmitButtonDisable] = useState(false);


    useEffect(()=>{
        mrLoader.setIsLoading(true);
        if(userInstance.user){
            if(!isFunctionLoading){
                window.location.href="/shop";
            }
            
        }else{
            mrLoader.setIsLoading(false);
        }

    },[userInstance.user]);

    
    const signIn = ()=>{
        if(password==="" || email===""){
            alert( "Please fill out all the fields.");
        }else{

            mrLoader.setIsLoading(true);

            setsubmitButtonDisable(true)
            signInWithEmailAndPassword(auth,email, password)
            .then((response) =>{
                setsubmitButtonDisable(false) 
                alert("Successfully  Logged In");
                window.location.href = '/shop';

                
                setEmail("")
                setConfirmPassword("")
                setName("")
                setPassword("")
            })
            .then(()=>{
                mrLoader.setIsLoading(false);
            })
            .catch((err) =>{
                setsubmitButtonDisable(false) 
                alert(err.message);
                setEmail("")
                setConfirmPassword("")
                setName("")
                setPassword("")
            })
        }
    }
    const signUp = () => {
        if (name === "" || password === "" || email === "") {
            alert("Please fill out all the fields.");
        }
        else if (password !== confirmPasssword) {
            alert("Both Password fields must be the same.");
        }
        else {
            setIsFunctionLoading(true);
            mrLoader.setIsLoading(true);
            setsubmitButtonDisable(true);

            createUserWithEmailAndPassword(auth, email, password)
                .then(async (response) => {
                    return createUserProfile(response.user.uid, name, email);
                })
                .then(() => {
                    setsubmitButtonDisable(false);
                    alert("Account created");
                    // Redirect after user profile is created
                    window.location.href = '/shop';
                    setEmail("");
                    setConfirmPassword("");
                    setName("");
                    setPassword("");
                    setIsFunctionLoading(false);
                    mrLoader.setIsLoading(false);
                })
                .catch((err) => {
                    setsubmitButtonDisable(false);
                    alert(err.message);
                    setEmail("");
                    setConfirmPassword("");
                    setName("");
                    setPassword("");
                });
        }
    };
    
    
    const handleClick = ()=>{
        setIsFunctionLoading(true);
        mrLoader.setIsLoading(true);
        signInWithPopup(auth,provider).then(async (data) =>{
            const docSnap =await  getDoc(doc(database,"users",data.user.uid));
            console.log("user google",docSnap)
            if(!docSnap.data()){
                console.log("new User...");
                console.log("info",data.user.uid,data.user.displayName,data.user.email);
                return createUserProfile(data.user.uid,data.user.displayName,data.user.email);
            }else{
                return 1;
            }
            
        }).then(()=>{
            alert("Google  Account Connected Successfully!");
            window.location.href = '/shop';
            setIsFunctionLoading(false);
            mrLoader.setIsLoading(false);
        })
        .catch((err) =>{
            alert(err.message);
            // setIsFunctionLoading(false);
            
        })
    }

    const createUserProfile = async (uid,userName,userEmail)=>{
        const docRef = doc(database,"users",uid);
        try{
            await setDoc(docRef,{
                id: uid,
                name: userName,
                email: userEmail
            })
        }catch(err){
            console.log("profile creation error: ",err);
        }
       
    }

    return (
    <> 
    <div className='sign-in-container'>
        <motion.div className='logo'
            initial={{opacity:0, scale:0.5}} 
            animate={{opacity:1, scale:1}}
            transition={{
                ease: "linear",
                duration: 0.35,
                x: { duration: 0.5 }
            }}>
            <img src={company_logo} alt="Logo"/>
        </motion.div>
        <motion.div className="conatiner"
                initial={{opacity:0, scale:0.5}} 
                animate={{opacity:1, scale:1}}
                transition={{
                    type:"spring",
                    stiffness:100,
                    delay:0.5,
        }}>
            <div className="inputs">
                <div className="toggle-switch" >
                    <div className="toggle" >
                        <div className={action === "Sign Up" ? "Login-signUp gray" : "Login-signUp" } onClick={() => {
                            setAction("Login")
                            setEmail("")
                            setConfirmPassword("")
                            setName("")
                            setPassword("")
                            }}>Login
                        </div>
                        <div className={action === "Login" ? "Login-signUp gray" : "Login-signUp" } onClick={() => {
                            setAction("Sign Up")
                            setEmail("")
                            setConfirmPassword("")
                            setName("")
                            setPassword("")
                            }}>Sign Up
                            </div>
                    </div>
                </div>
                <div className="form">

                    {action === "Login" ? <div></div> : <><p>Name</p>
                    <div className="input">
                        <input type="text" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div></>}

                    <p>Email</p>
                    <div className="input">
                        <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <p>Password</p>
                    <div className="input">
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    {action === "Login" ? <div></div> : <> <p>Confirm Password</p>
                    <div className="input">
                        <input type="password" placeholder="Confirm Password" value={confirmPasssword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div></>}

                </div>

            <div className="submit-container">
                <button className="submit"
                    onClick={action === "Login" ? signIn : signUp }
                    disabled={submitButtonDisable}>
                        {action}
                </button>
                <button className= "googlebtn" onClick={handleClick}> 
                    <img src={google_logo} alt="google"/>
                    <p>Continue with <br /> <span>Google</span> </p>
                </button>

            </div>
            </div>
        </motion.div>    
    </div>
    </>
    )
}
export default LoginSignUp