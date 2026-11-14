import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, styleObj } from "../Firebase";
import { RingLoader } from "react-spinners";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoad(true)


    setTimeout(() => {
      setLoad(false)

    }, 700);
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (name === "" || email === "" || password === "" || contact === "") {
      setLoad(false);
      toast.error("All Fields are mandatory", {
        position: "top-center",
      });
    } else if (password.length < 6) {
      setLoad(false);
      toast.error("Password should contain at least 6 characters");
    } else {
      try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;

        const newUser = {
          name,
          email,
          contact,
          uid: user.uid,
          userType: "user",
          status: "active",
          created_at: Timestamp.now(),
        };

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, newUser);


        toast.success("User registered successfully", {
          position: "top-center",
        });
        setLoad(false);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setLoad(false);
          toast.error("Email already exists", {
            position: "top-center",
          });

        } else {
          setLoad(false);
          toast.error("Something went wrong!!!", {
            position: "top-center",
          });
          console.log("Error details:", error);
        }
      }
    }
  };

  return (
    <>
      <RingLoader loading={load} cssOverride={styleObj} size={100} color={"#65a0b7"} />

      <div className={load ? "d-none" : ""}>
        <div
          className="container-fluid bg-primary py-5 bg-header"
          style={{ marginBottom: 90 }}
        >
          <div className="row py-5">
            <div className="col-12 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-4 text-white animated zoomIn">Register Now!</h1>
              <a href="" className="h5 text-white">
                Home
              </a>
              <i className="far fa-circle text-white px-2" />
              <a href="" className="h5 text-white">
                Register
              </a>
            </div>
          </div>
        </div>
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="bg-primary rounded p-5 shadow">
                  <form onSubmit={handleRegister}>
                    <div className="row g-3">
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          placeholder="Your Name"
                          style={{ height: "55px" }}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

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
                        <input
                          type="number"
                          className="form-control bg-light border-0"
                          placeholder="Your Contact"
                          style={{ height: "55px" }}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <button
                          className="btn btn-dark w-100 py-3"
                          type="submit"
                        >
                          Register
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