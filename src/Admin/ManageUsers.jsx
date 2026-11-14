import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, styleObj } from "../Firebase";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";

export default function ManageUsers(){
     const [users, setUsers] = useState([]);
  const[load,setLoad]=useState(true);

  setTimeout(() => {
    setLoad(false);
  }, 1000);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const filteredUsers = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.userType === 'user');

        setUsers(filteredUsers);
      },
      (error) => {
        console.error('Error fetching users data: ', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleBlockUser = async (userId) => {
    setLoad(true);
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        status: 'blocked', 
      });
      toast.success("User Status Updated Sucessfully",{
        position:"top-center"
      })
      setTimeout(() => {
        setLoad(false);
      }, 2000);
      console.log('User Status Updated successfully');
    } catch (error) {
      console.error('Error blocking user: ', error);
    }
  };
  const handleActiveUser = async (userId) => {
    setLoad(true);
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        status: 'active', 
      });
      toast.success("User Status Updated Successfully",{
        position:"top-center"
      })
      setTimeout(() => {
        setLoad(false);
      }, 2000);
      console.log('User active successfully');
    } catch (error) {
      console.error('Error blocking user: ', error);
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
                <h1 className="display-4 text-white animated zoomIn">Manage Users</h1>
                <a href="" className="h5 text-white">
                  Home
                </a>
                <i className="far fa-circle text-white px-2" />
                <a href="" className="h5 text-white">
                  Manage Users
                </a>
              </div>
            </div>
          </div>
                {/* Table Section */}
                <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center py-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12">
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
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Contact</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                    
                                                </tr>
                                            </thead>

                                           <tbody  style={{
                                                   
                                                    color: "rgb(232, 226, 226)",
                                                }}>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.contact}</td>
                      <td>{user.status}</td>
                      {user.status==="active" ? (
                        <>
                        <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleBlockUser(user.id)}
                        >
                          Block
                        </button>
                      </td>
                        </>
                      ):(
                        <>
                         <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleActiveUser(user.id)}
                        >
                          Active
                        </button>
                      </td>
                        </>
                      )}
                      
                    </tr>
                  ))}
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