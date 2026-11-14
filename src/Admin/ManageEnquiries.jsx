import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, styleObj } from "../Firebase";
import { RingLoader } from "react-spinners";

export default function ManageEnquiries() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);

    setTimeout(() => {
        setLoad(false);
    }, 1000);

    useEffect(() => {
        const getQueries = () => {
            const queryRef = collection(db, "queries");

            const unsubscribe = onSnapshot(queryRef, (snapshot) => {
                const queries = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setData(queries);
            });

            return () => unsubscribe();
        };

        getQueries();
    }, []);

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
                    className="container-fluid bg-primary bg-header"
                    style={{ marginBottom: "50px" }}
                >
                    <div className="row py-5">
                        <div className="col-12 text-center">
                            <h1 className="display-4 text-white">
                                Manage Enquiries
                            </h1>

                            <span className="text-white">Home</span>
                            <i className="far fa-circle text-white px-2" />
                            <span className="text-white">
                                Manage Enquiries
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
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
                                                    color: "rgb(255, 255, 255)",
                                                }}
                                            >
                                                <tr>
                                                    <th>Sr No.</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Subject</th>
                                                    <th>Message</th>
                                                    <th>Reply</th>

                                                </tr>
                                            </thead>

                                            <tbody  style={{
                                                   
                                                    color: "rgb(232, 226, 226)",
                                                }}>
                                                {data.map((el, index) => (
                                                    <tr key={el.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{el.name}</td>
                                                        <td>{el.email}</td>
                                                        <td>{el.subject}</td>
                                                        <td>{el.message}</td>
                                                         <td>
                                <a
                                  href={`https://mail.google.com/mail/?view=cm&to=${el.email}&su=Replying to your enquiry&body=Hi ${el.name},`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  
                                    <button className="btn btn-info">Reply</button>

                                </a>
                              </td>
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