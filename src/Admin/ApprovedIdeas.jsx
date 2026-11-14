

 import { RingLoader } from "react-spinners";



import { db, styleObj } from "../Firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

export default function ApprovedIdeas(){
    const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const nav=useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 1000);
  
    // Query only Pending documents
    const StartupIdeasRef = query(
      collection(db, "StartupIdeas"),
      where("status", "==", "Approved")
    );
  
    const unsubscribe = onSnapshot(StartupIdeasRef, (snapshot) => {
      const StartupIdeas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setData(StartupIdeas);
    });
  
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

 
  const rejectIdea = async (ideaId) => {
    setLoad(true)
    try {
      const ideaDocRef = doc(db, "StartupIdeas", ideaId);

      await updateDoc(ideaDocRef, {
        status: "Rejected",
      });

      toast.success("Idea Rejected Successfully!");
       setTimeout(() => {
                nav("/admin/rejectedideas")
                setLoad(false)
            }, 500);
    } catch (error) {
      console.error("Error rejecting idea:", error);
      toast.error("Failed to reject the idea.");
      setTimeout(() => {
        setLoad(false)
      }, 500);
    }
  };
   
   
   

 
    return(
        <>
          <RingLoader
        loading={load}
        cssOverride={styleObj}
        size={100}
        color="#65a0b7"
      />

      <div className={load ? "d-none" : ""}>
   
        <div
          className="container-fluid p-5 bg-primary bg-header"
          style={{ marginBottom: "50px" }}
        >
          <div className="row py-5">
            <div className="col-12 text-center">
              <h1 className="display-4 text-white">
                Approved Startup Ideas
              </h1>

              <span className="text-white">Home</span>
              <i className="far fa-circle text-white px-2"></i>
              <span className="text-white">Approved Startup Ideas</span>
            </div>
          </div>
        </div>

      
        <div className="container-fluid min-vh-50 d-flex justify-content-center align-items-center py-5">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-12 mb-5">
                <div
                  className="shadow rounded p-4"
                  style={{
                    backgroundColor: "#0d6efd",
                  }}
                >
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover text-center mb-0">
                      <thead
                        style={{
                          backgroundColor: "#084298",
                          color: "#fff",
                        }}
                      >
                        <tr>
                          <th>Sr No.</th>
                          <th>Title</th>
                          <th>Owner ID</th>
                          <th>Funding Required</th>
                          <th>Equity (%)</th>
                          <th>Location</th>
                          <th>Description</th>
                          <th>Status</th> 
                          <th>Reject</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.length > 0 ? (
                          data.map((startup, index) => (
                            <tr
                              key={startup.id}
                              style={{
                                backgroundColor: "#0d6efd",
                                color: "#fff",
                              }}
                            >
                              <td>{index + 1}</td>
                              <td>{startup.title}</td>
                              <td>{startup.ownerId}</td>
                              <td>{startup.fundingRequired}</td>
                              <td>{startup.equity}</td>
                              <td>{startup.location}</td>
                              <td>{startup.description}</td>
                              <td>{startup.approvalStatus || "Approved"}</td>

                             

                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    rejectIdea(startup.id)
                                  }
                                >
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="10"
                              className="text-center text-white"
                            >
                              No Startup Ideas Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
        
        </>
    )
}




