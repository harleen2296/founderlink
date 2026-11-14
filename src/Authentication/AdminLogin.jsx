import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, styleObj } from "../Firebase";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";

export default function AdminLogin(){
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.userType === "Admin") {
          toast.success("Login Successful", {
            position: "top-center"
          });
          setTimeout(() => {
            nav("/admin");
          }, 500);
        } else {
          // If not admin, sign the user out
          await signOut(auth);
          toast.error("Access Denied: Not an Admin", {
            position: "top-center"
          });
          setLoad(false);
        }
      } else {
        toast.error("User data not found", {
          position: "top-center"
        });
        setLoad(false);
      }
    } catch (error) {
      setLoad(false);
      toast.error("Invalid Credentials", {
        position: "top-center"
      });
      console.log(error);
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
              <h1 className="display-4 text-white animated zoomIn"> Admin Login Here!</h1>
              <a href="" className="h5 text-white">
                Home
              </a>
              <i className="far fa-circle text-white px-2" />
              <a href="" className="h5 text-white">
                Admin Login
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
}