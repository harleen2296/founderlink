import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, styleObj } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    setLoad(true);

    const timer = setTimeout(() => {
      setLoad(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are mandatory", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoad(true);

      // Login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      console.log("Logged In User UID:", user.uid);

      // Fetch user document from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await signOut(auth);

        toast.error("User data not found", {
          position: "top-center",
        });

        return;
      }

      const userData = userDoc.data();

      console.log("Firestore User Data:", userData);

      if (
        userData.userType === "user" &&
        userData.status === "active"
      ) {
        toast.success("Login Successful", {
          position: "top-center",
        });

        nav("/");
      } else {
        await signOut(auth);

        toast.error(
          "Access Denied: Your account is inactive or unauthorized",
          {
            position: "top-center",
          }
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      switch (error.code) {
        case "auth/user-not-found":
          toast.error("User not found");
          break;

        case "auth/wrong-password":
          toast.error("Incorrect password");
          break;

        case "auth/invalid-email":
          toast.error("Invalid email address");
          break;

        case "auth/invalid-credential":
          toast.error("Invalid email or password");
          break;

        default:
          toast.error(error.message);
      }
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <RingLoader
        loading={load}
        cssOverride={styleObj}
        size={100}
        color="#65a0b7"
      />

      <div className={load ? "d-none" : ""}>
        {/* Header */}
        <div
          className="container-fluid bg-primary py-5 bg-header"
          style={{ marginBottom: "90px" }}
        >
          <div className="row py-5">
            <div className="col-12 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-4 text-white">Login Here!</h1>

              <span className="h5 text-white">Home</span>
              <i className="far fa-circle text-white px-2"></i>
              <span className="h5 text-white">Login</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="bg-primary rounded p-5 shadow">
                  <form onSubmit={handleLogin}>
                    <div className="row g-3">
                      <div className="col-12">
                        <input
                          type="email"
                          className="form-control bg-light border-0"
                          placeholder="Your Email"
                          style={{ height: "55px" }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <input
                          type="password"
                          className="form-control bg-light border-0"
                          placeholder="Your Password"
                          style={{ height: "55px" }}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-dark w-100 py-3"
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



















{/* import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  auth, db, googleProvider, styleObj } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import GoogleButton from "react-google-button";

export default function Login(){
   const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [load, setLoad] = useState(false);
    const nav = useNavigate();

     useEffect(() =>{
  setLoad(true)
 

  setTimeout(() => {
    setLoad(false)
    
  }, 700);
},[])


 const handleLogin = async (e) => {
      e.preventDefault();
      setLoad(true);
      if (email === "" || password === "") {
        toast.error("All fields are mandatory", {
          position: "top-center"
        });
      } else {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
  
          // Fetch the user's role from Firestore
          const userDocRef = doc(db, "users", user.uid); // Assuming users are stored in "users" collection
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.userType === "user" && userData.status==="active") {
              toast.success("Login Successful",{
                position:"top-center"
              });
              
              setTimeout(() => {
                nav("/");
                setLoad(false);
              }, 500);
              
            } else {
              await signOut(auth);
              toast.error("Access Denied: You are not supposed to access this pannel", {
                position: "top-center"
              });
              setTimeout(() => {
                
                setLoad(false);
              }, 500);
            }
          } else {
            toast.error("User data not found", {
              position: "top-center"
            });
            setTimeout(() => {
              setLoad(false);
            }, 500);
          }
        } catch (error) {
          toast.error("Invalid Credentials", {
            position: "top-center"
          });
          setTimeout(() => {
            setLoad(false);
          }, 1000);
          console.log(error);
        }
      }
    };
  
 
   
  return(
    <>

      <RingLoader loading={load} cssOverride={styleObj} size={100} color={"#65a0b7"} />

      <div className={load ? "d-none" : ""}>
        <div
          className="container-fluid bg-primary py-5 bg-header"
          style={{ marginBottom: 90 }}
        >
          <div className="row py-5">
            <div className="col-12 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-4 text-white animated zoomIn">Login Here!</h1>
              <a href="" className="h5 text-white">
                Home
              </a>
              <i className="far fa-circle text-white px-2" />
              <a href="" className="h5 text-white">
                Login
              </a>
            </div>
          </div>
        </div>
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="bg-primary rounded p-5 shadow">
                  <form onSubmit={handleLogin}>
                    <div className="row g-3">
                     
                      <div className="col-12">
                        <input
                          type="email"
                          className="form-control bg-light border-0"
                          placeholder="Your Email"
                          style={{ height: "55px" }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>



                      <div className="col-12">
                        <input
                          type="password"
                          className="form-control bg-light border-0"
                          placeholder="Your Password"
                          style={{ height: "55px" }}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <button
                          className="btn btn-dark w-100 py-3"
                          type="submit"
                        >
                        Login
                        </button>
                      </div>
                    
    
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
   
    
    </>
  )
}*/}


