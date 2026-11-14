import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db, styleObj } from "../Firebase";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { RingLoader } from "react-spinners";



export default function AddStartupIdeas() {
    const [title, settitle] = useState("");
    const [fundingRequired, setfundingRequired] = useState("");
    const [ownerId, setownerId] = useState("");
    const [location, setlocation] = useState("");
    const [equity, setequity] = useState("");
    const [description, setdescription] = useState("");

    const [load, setLoad] = useState(false);


    const navigate = useNavigate();

    const AddStartupIdeas = async (e) => {
        e.preventDefault();
        setLoad(true);
        if (title === "" || description === "" || fundingRequired === "" || location === "" || equity === "") {
            toast.error("All Fields are mandatory", {
                position: "top-center",
            });
            setLoad(false);
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            console.log("Current User:", user);

            if (!user) {
                console.log("User is null");
                toast.error("User not logged in");
                return;
            }

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                toast.error("User details not found", {
                    position: "top-center",
                });
                setLoad(false);
                return;
            }

            const userData = userDoc.data();

            console.log("User Document:", userData);
            console.log("Name:", userData.name);
            console.log("Email:", userData.email);
            console.log("Contact:", userData.contact);

            const StartupIdeasRef = collection(db, "StartupIdeas");


            const q = query(StartupIdeasRef, where("title", "==", title));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.error("title already exists", {
                    position: "top-center",
                });
                setLoad(false);
                return;
            }


            const newStartupIdeas = {
                title,
                description,
                fundingRequired,
                ownerId: user.uid,
                ownerName: userData.name,
                ownerEmail: userData.email,
                ownerContact: userData.contact,
                location,
                equity,
                status: "Pending",
                created_at: Timestamp.now(),
            };

            console.log("Ideas:", newStartupIdeas);
            await addDoc(StartupIdeasRef, newStartupIdeas);
            toast.success("Data Added successfully", {
                position: "top-center",
            });
            setTimeout(() => {
                navigate("/manageStartupIdeas");
                setLoad(false)
            }, 500);
        } catch (error) {
            toast.error("Something Went Wrong", {
                position: "top-center"
            });
            setTimeout(() => {
                setLoad(false);
            }, 500);
            console.log(error);
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
                            <h1 className="display-4 text-white animated zoomIn">Add StartupIdeas</h1>
                            <a href="" className="h5 text-white">
                                Home
                            </a>
                            <i className="far fa-circle text-white px-2" />
                            <a href="" className="h5 text-white">
                                Add StartupIdeas
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8">
                                <div className="bg-primary rounded p-5 shadow">
                                    <form onSubmit={AddStartupIdeas}>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="form-control bg-light border-0"
                                                    placeholder="Your Title"
                                                    style={{ height: "55px" }}
                                                    value={title}
                                                    onChange={(e) => settitle(e.target.value)}
                                                />
                                            </div>



                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="form-control bg-light border-0"
                                                    placeholder="Funding Required"
                                                    style={{ height: "55px" }}
                                                    value={fundingRequired}
                                                    onChange={(e) => setfundingRequired(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="number"
                                                    className="form-control bg-light border-0"
                                                    placeholder="Equity %"
                                                    style={{ height: "55px" }}
                                                    value={equity}
                                                    onChange={(e) => setequity(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="form-control bg-light border-0"
                                                    placeholder="Your Location"
                                                    style={{ height: "55px" }}
                                                    value={location}
                                                    onChange={(e) => setlocation(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <textarea
                                                    className="form-control border-0 bg-light px-4 py-3"
                                                    rows={4}
                                                    placeholder="description"

                                                    value={description}
                                                    onChange={(e) => setdescription(e.target.value)}
                                                />
                                            </div>


                                            <div className="col-12">
                                                <button
                                                    className="btn btn-dark w-100 py-3"
                                                    type="submit"
                                                >
                                                    Save
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