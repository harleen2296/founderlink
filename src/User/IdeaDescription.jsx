import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { RingLoader } from "react-spinners";
import { getAuth } from "firebase/auth";
import { db, styleObj } from "../Firebase";

export default function IdeaDescription() {
    const { id } = useParams();
    const navigate = useNavigate();

    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [idea, setIdea] = useState(null);
    const [owner, setOwner] = useState(null);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch Startup Idea
                const startupRef = doc(db, "StartupIdeas", id);
                const startupSnap = await getDoc(startupRef);

                if (!startupSnap.exists()) {
                    setLoad(false);
                    return;
                }

                const startupData = {
                    id: startupSnap.id,
                    ...startupSnap.data(),
                };

                setIdea(startupData);

                // Fetch Owner Details
                const ownerRef = doc(db, "users", startupData.ownerId);
                const ownerSnap = await getDoc(ownerRef);

                if (ownerSnap.exists()) {
                    setOwner(ownerSnap.data());
                }

            } catch (error) {
                console.log(error);
            } finally {
                setLoad(false);
            }
        };

        fetchData();
    }, [id]);

    if (load) {
        return (
            <RingLoader
                loading={load}
                cssOverride={styleObj}
                size={100}
                color="#65a0b7"
            />
        );
    }

    if (!idea) {
        return (
            <div className="container py-5 text-center">
                <h2>Startup Idea Not Found</h2>
            </div>
        );
    }

    const showInvestButton =
        currentUser && currentUser.uid !== idea.ownerId;
return (
    <>
        {/* Hero Section */}
        <div
            className="container-fluid bg-primary py-5 bg-header"
            style={{ marginBottom: "70px" }}
        >
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">

                        <div
                            className="bg-white rounded-circle shadow mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: "100px", height: "100px" }}
                        >
                            <i
                                className="bi bi-lightbulb-fill text-primary"
                                style={{ fontSize: "45px" }}
                            ></i>
                        </div>

                        <h1 className="display-4 fw-bold text-white mt-4">
                            {idea.title}
                        </h1>

                        <p className="text-white fs-5">
                            Turn Innovation into Reality 🚀
                        </p>

                    </div>
                </div>
            </div>
        </div>

        <div className="container mb-5">

            <div className="row">

                {/* LEFT SIDE */}

                <div className="col-lg-8">

                    <div className="card border-0 shadow-lg rounded-4">

                        <div className="card-body p-5">

                            <h2 className="fw-bold mb-4">
                                Startup Overview
                            </h2>

                            <div className="row g-4">

                                <div className="col-md-4">

                                    <div className="border rounded-4 p-4 text-center h-100">

                                        <i className="bi bi-cash-stack text-success display-5"></i>

                                        <h6 className="mt-3">
                                            Funding Required
                                        </h6>

                                        <h3 className="text-success">
                                            ₹ {idea.fundingRequired}
                                        </h3>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="border rounded-4 p-4 text-center h-100">

                                        <i className="bi bi-pie-chart-fill text-warning display-5"></i>

                                        <h6 className="mt-3">
                                            Equity Offered
                                        </h6>

                                        <h3 className="text-warning">
                                            {idea.equity}%
                                        </h3>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="border rounded-4 p-4 text-center h-100">

                                        <i className="bi bi-geo-alt-fill text-danger display-5"></i>

                                        <h6 className="mt-3">
                                            Location
                                        </h6>

                                        <h4 className="text-danger">
                                            {idea.location}
                                        </h4>

                                    </div>

                                </div>

                            </div>

                            <hr className="my-5" />

                            <h3 className="fw-bold mb-4">

                                <i className="bi bi-file-earmark-text-fill text-primary me-2"></i>

                                Startup Description

                            </h3>

                            <p
                                className="text-secondary"
                                style={{
                                    fontSize: "18px",
                                    lineHeight: "2",
                                    textAlign: "justify",
                                }}
                            >
                                {idea.description}
                            </p>

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="col-lg-4">

                    <div
                        className="card border-0 shadow-lg rounded-4 sticky-top"
                        style={{ top: "120px" }}
                    >

                        <div className="card-body">

                            <div className="text-center">

                                <div
                                    className="rounded-circle bg-primary text-white mx-auto d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        fontSize: "38px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {owner?.name?.charAt(0).toUpperCase()}
                                </div>

                                <h3 className="mt-3">
                                    {owner?.name}
                                </h3>

                                <span className="badge bg-success px-3 py-2">
                                    Startup Owner
                                </span>

                            </div>

                            <hr />

                            <div className="mb-3">

                                <h6 className="text-muted">
                                    Email
                                </h6>

                                <p className="mb-0">
                                    {owner?.email}
                                </p>

                            </div>

                            <div className="mb-3">

                                <h6 className="text-muted">
                                    Contact
                                </h6>

                                <p className="mb-0">
                                    {owner?.contact}
                                </p>

                            </div>

                            <div className="mb-4">

                                <h6 className="text-muted">
                                    User Type
                                </h6>

                                <span className="badge bg-primary">
                                    {owner?.userType}
                                </span>

                            </div>

                            <div className="d-grid gap-3">

                                {showInvestButton && (

                                    <button
                                        className="btn btn-success btn-lg rounded-pill"
                                        onClick={() =>
                                            navigate(`/add-investment/${idea.id}`)
                                        }
                                    >
                                        <i className="bi bi-cash-coin me-2"></i>

                                        Invest Now
                                    </button>

                                )}

                                <Link
                                    to="/viewIdeas"
                                    className="btn btn-outline-primary btn-lg rounded-pill"
                                >
                                    <i className="bi bi-arrow-left me-2"></i>

                                    Back to Ideas
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </>
);
}