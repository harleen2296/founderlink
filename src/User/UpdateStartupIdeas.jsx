import { RingLoader } from "react-spinners";
import { db, styleObj } from "../Firebase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

export default function UpdateStartupIdeas() {
    const [title, settitle] = useState("");
    const [fundingRequired, setfundingRequired] = useState("");
    const [ownerId, setownerId] = useState("");
    const [location, setlocation] = useState("");
    const [equity, setequity] = useState("");
    const [description, setdescription] = useState("");
    const [load, setLoad] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoad(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchStartupData = async () => {
            try {
                const docRef = doc(db, "StartupIdeas", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const StartupData = docSnap.data();
                    settitle(StartupData.title);
                    setfundingRequired(StartupData.fundingRequired);
                    setownerId(StartupData.ownerId);
                    setlocation(StartupData.location);
                    setequity(StartupData.equity);
                    setdescription(StartupData.description)
                } else {
                    toast.error(" Startup Ideas not found", { position: "top-center" });
                }
            } catch (error) {
                toast.error("Failed to fetch startup data", { position: "top-center" });
                console.error("Error fetching startup data: ", error);
            }
        };-

        fetchStartupData();
    }, [id]);

    const updateStartup = async (e) => {
        setLoad(true)
        e.preventDefault();

        if (title === "" || description === "" || fundingRequired === "" || ownerId === "" || location === "" || equity === "") {
            toast.error("All Fields are mandatory", { position: "top-center" });
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                toast.error(" User is not authenticated", { position: "top-center" });
                return;
            }

            const StartupIdeasRef = collection(db, "StartupIdeas");
            const q = query(StartupIdeasRef, where("title", "==", title), where("__name__", "!=", id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.error(" title already exists", { position: "top-center" });
                return;
            }
           


            const docRef = doc(db, "StartupIdeas", id);
            await updateDoc(docRef, {
                title,
                fundingRequired,
                location,
                description,
                equity,
                status: "active",
                updated_at: Timestamp.now(),
            });

            toast.success("Data updated successfully", { position: "top-center" });

            setTimeout(() => {
                navigate("/managestartupideas");
                setLoad(false)
            }, 1000);

        } catch (error) {
            toast.error("Something Went Wrong", { position: "top-center" });
            console.error("Error updating property: ", error);
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
                            <h1 className="display-4 text-white animated zoomIn">Update StartupIdeas</h1>
                            <a href="" className="h5 text-white">
                                Home
                            </a>
                            <i className="far fa-circle text-white px-2" />
                            <a href="" className="h5 text-white">
                                Update StartupIdeas
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8">
                                <div className="bg-primary rounded p-5 shadow">
                                    <form onSubmit={updateStartup}>
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