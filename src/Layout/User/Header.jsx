import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const nav = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("LOGOUT SUCCESSFULLY")
      setTimeout(() => {
        nav('/');
      }, 500);
      setUser(null);
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  return (
    <>
      <>
        {/* Topbar Start */}
        <div className="container-fluid bg-dark px-5 d-none d-lg-block">
          <div className="row gx-0">
            <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
              <div
                className="d-inline-flex align-items-center"
                style={{ height: 45 }}
              >
                <small className="me-3 text-light">
                  <i className="fa fa-map-marker-alt me-2" />
                  123 Street, New York, USA
                </small>
                <small className="me-3 text-light">
                  <i className="fa fa-phone-alt me-2" />
                  +012 345 6789
                </small>
                <small className="text-light">
                  <i className="fa fa-envelope-open me-2" />
                  info@example.com
                </small>
              </div>
            </div>
            <div className="col-lg-4 text-center text-lg-end">
              <div
                className="d-inline-flex align-items-center"
                style={{ height: 45 }}
              >
                <a
                  className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                  href=""
                >
                  <i className="fab fa-twitter fw-normal" />
                </a>
                <a
                  className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                  href=""
                >
                  <i className="fab fa-facebook-f fw-normal" />
                </a>
                <a
                  className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                  href=""
                >
                  <i className="fab fa-linkedin-in fw-normal" />
                </a>
                <a
                  className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                  href=""
                >
                  <i className="fab fa-instagram fw-normal" />
                </a>
                <a
                  className="btn btn-sm btn-outline-light btn-sm-square rounded-circle"
                  href=""
                >
                  <i className="fab fa-youtube fw-normal" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Topbar End */}
        {/* Navbar & Carousel Start */}
        <div className="container-fluid position-relative p-0">
          <nav className="navbar navbar-expand-lg navbar-dark px-5 py-3 py-lg-0">
            <a href="index.html" className="navbar-brand p-0">
              <h1 className="m-0">
                <i className="fa fa-user-tie me-2" />
                FounderLink
              </h1>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars" />
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav ms-auto py-0">
                <Link to={"/"} className="nav-item nav-link active">
                  Home
                </Link>


                <Link to={"/about"} className="nav-item nav-link" >
                  About
                </Link>



                <Link to={"/viewIdeas"} className="nav-item nav-link">
                  ViewIdeas

                </Link>
                
                

                {/* <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              Pages
            </a>
            <div className="dropdown-menu m-0">
              <a href="price.html" className="dropdown-item">
                Pricing Plan
              </a>
              <a href="feature.html" className="dropdown-item">
                Our features
              </a>
              <a href="team.html" className="dropdown-item">
                Team Members
              </a>
              <a href="testimonial.html" className="dropdown-item">
                Testimonial
              </a>
              <a href="quote.html" className="dropdown-item">
                Free Quote
              </a>
            </div>
          </div> */}


                <Link to={"/contact"} className="nav-item nav-link">
                  Contact
                </Link>

            {user ? (
              <>
               <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    StartUpIdeas
                  </a>
                  <div className="dropdown-menu m-0">

                    <Link to={"/addstartup"} className="dropdown-item">
                      AddStartupIdeas
                    </Link>

                    <Link to={"/managestartupideas"} className="dropdown-item">
                      ManageStartupIdeas
                    </Link>
                  </div>
                </div>
                     <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Requests
                  </a>
                  <div className="dropdown-menu m-0">

                    <Link to={"/myinvestments"} className="dropdown-item">
                     Investments
                    </Link>

                    <Link to={"/viewrequests"} className="dropdown-item">
                      Manage Requests
                    </Link>
                  </div>
                </div>
              </>
            ):(
              <>
              
              </>
            )}


              </div>




              {user ? (
                <>
                  &nbsp;&nbsp;
                  <Link onClick={handleLogout} className="btn btn-danger py-2 px-4 d-none d-lg-block">Logout</Link>
                </>
              ) : (
                <>
                  <Link to={"/register"} className="nav-item nav-link">
                    <button className="btn btn-success ms-2">Register</button>
                  </Link>

                  <Link to={"/login"} className="btn btn-primary py-2 px-4 d-none d-lg-block">Login</Link>
                  <Link to={"/adminlogin"} className="btn btn-primary py-2 px-4 d-none d-lg-block ms-3">Admin Login</Link>
                </>
              )}


            </div>
          </nav>

        </div>
        {/* Navbar & Carousel End */}
      </>



    </>
  )
}