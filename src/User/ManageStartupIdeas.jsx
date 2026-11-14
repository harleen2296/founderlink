import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import { auth, db, styleObj } from "../Firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ManageStartupIdeas() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const auth = getAuth();
    const user = auth.currentUser;


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoad(false);
        }, 1000);

        if (!user) {
            setLoad(false);
            return;
        }
        
       // console.log("uid is :" + user.uid)

        const StartupIdeasRef = query(
            collection(db, "StartupIdeas"),
            where("ownerId", "==", user.uid)
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
    }, [user]);

    const handleDelete = async (id) => {
        setLoad(true);

        try {
            const StartupDoc = doc(db, "StartupIdeas", id);
            await deleteDoc(StartupDoc);

            toast.success("Startup Idea Deleted Successfully", {
                position: "top-center",
            });

            setData((prevData) =>
                prevData.filter((startup) => startup.id !== id)
            );
        } catch (error) {
            console.error(error);

            toast.error("Something went wrong", {
                position: "top-center",
            });
        } finally {
            setTimeout(() => {
                setLoad(false);
            }, 1000);
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
                    className="container-fluid bg-primary bg-header p-5"
                    style={{ marginBottom: "50px" }}
                >
                    <div className="row py-5">
                        <div className="col-12 text-center">
                            <h1 className="display-4 text-white">
                                Manage Startup Ideas
                            </h1>

                            <span className="text-white">Home</span>
                            <i className="far fa-circle text-white px-2" />
                            <span className="text-white">
                                Manage Startup Ideas
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="container-fluid min-vh-50 d-flex justify-content-center align-items-center py-5">
                    <div className="container mt-5 mb-5">
                        <h1 className="text-center mb-5">MANAGE YOUR IDEAS</h1>
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
                                                    <th>Title</th>
                                                    <th>Funding Required</th>
                                                    <th>Equity (%)</th>
                                                    <th>Location</th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                    <th>Update</th>
                                                    <th>Delete</th>
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
                                                            <td>{startup.fundingRequired}</td>
                                                            <td>{startup.equity}</td>
                                                            <td>{startup.location}</td>
                                                            <td>{startup.description}</td>
                                                            <td>{startup.status}</td>

                                                            <td>
                                                                <Link
                                                                    to={`/updateStartup/${startup.id}`}
                                                                >
                                                                    <button className="btn btn-success btn-sm">
                                                                        Update
                                                                    </button>
                                                                </Link>
                                                            </td>

                                                            <td>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleDelete(startup.id)
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="9"
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
    );
}