import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Firebase";

export default function Dashboard(){
   const [userCount, setUserCount] = useState(0);
 
  const [IdeasCount, setIdeasCount] = useState(0);
 
  const[queriesCount,setqueriesCount]=useState(0);
  const[load,setLoad]=useState(false);

  // setTimeout(() => {
  //   setLoad(false);
  // }, 500);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUserCount(usersSnapshot.size);

      
        const IdeasSnapshot = await getDocs(collection(db, 'StartupIdeas'));
        setIdeasCount(IdeasSnapshot.size);

        const queriesSnapshot = await getDocs(collection(db, 'queries'));
        setqueriesCount(queriesSnapshot.size);
      } catch (error) {
        console.error("Error fetching document counts: ", error);
      }
    };

    fetchCounts();
  }, []);
    return(
        <>
          <div
  className="container-fluid bg-primary py-5 bg-header"
  style={{ marginBottom: 90 }}
>
  <div className="row py-5">
    <div className="col-12 pt-lg-5 mt-lg-5 text-center">
      <h1 className="display-4 text-white animated zoomIn">Dashboard</h1>
      <a href="" className="h5 text-white">
        Home
      </a>
      <i className="far fa-circle text-white px-2" />
      <a href="" className="h5 text-white">
        Dashboard
      </a>
    </div>
  </div>
</div>
<h1 style={{color:"blue", textAlign:"center", fontWeight:"bolder",fontSize:"50px"}}>WELCOME ADMIN</h1>
  {/* Service Start */}
  <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
    <div className="container py-5">
    
      <div className="row g-5">
        <div className="col-lg-4 col-md-6 wow zoomIn" data-wow-delay="0.3s">
          <div className="service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
            <div className="service-icon">
              <i className="fa fa-shield-alt text-white" />
            </div>
            <h4 className="mb-3">View Startup Ideas</h4>
            <h1>{IdeasCount}</h1>
           
          </div>
        </div>
       
        <div className="col-lg-4 col-md-6 wow zoomIn" data-wow-delay="0.9s">
          <div className="service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
            <div className="service-icon">
             <i class="bi bi-info text-white"></i>
            </div>
            <h4 className="mb-3">Manage Enquiries</h4>
            <h1>{queriesCount}</h1>
            
          </div>
        </div>
        <div className="col-lg-4 col-md-6 wow zoomIn" data-wow-delay="0.3s">
          <div className="service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
            <div className="service-icon">
              <i class="bi bi-person   text-white" ></i>
            </div>
            <h4 className="mb-3">Manage Users</h4>
            <h1>{userCount}</h1>
          </div>
        </div>
       
      
      </div>
    </div>
  </div>
  {/* Service End */}
</>
    )
}