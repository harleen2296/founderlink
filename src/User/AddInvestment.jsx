import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    Timestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { db, styleObj } from "../Firebase";

export default function AddInvestment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Startup Details
    const [startup, setStartup] = useState(null);

    // Logged In User Details
    const [investor, setInvestor] = useState(null);

    // Form Fields
    const [investmentAmount, setInvestmentAmount] = useState("");
    const [occupation, setOccupation] = useState("");
    const [company, setCompany] = useState("");
    const [experience, setExperience] = useState("");
    const [reason, setReason] = useState("");
    const [valueAddition, setValueAddition] = useState("");

    const [load, setLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                // User must be logged in
                if (!currentUser) {
                    toast.error("Please login first.");
                    navigate("/login");
                    return;
                }

                // Fetch Startup Details
                const startupRef = doc(db, "StartupIdeas", id);
                const startupSnap = await getDoc(startupRef);

                if (!startupSnap.exists()) {
                    toast.error("Startup not found.");
                    navigate("/viewIdeas");
                    return;
                }

                const startupData = {
                    id: startupSnap.id,
                    ...startupSnap.data(),
                };

                setStartup(startupData);

                // Prevent Owner from investing
                if (startupData.ownerId === currentUser.uid) {
                    toast.error("You cannot invest in your own startup.");
                    navigate("/viewIdeas");
                    return;
                }

                // Fetch Investor Details
                const investorRef = doc(db, "users", currentUser.uid);
                const investorSnap = await getDoc(investorRef);

                if (!investorSnap.exists()) {
                    toast.error("Investor profile not found.");
                    navigate("/viewIdeas");
                    return;
                }

                setInvestor(investorSnap.data());

            } catch (error) {
                console.log(error);
                toast.error("Something went wrong.");
            } finally {
                setLoad(false);
            }
        };

        fetchData();
    }, [id]);

    const submitInvestment = async (e) => {
        e.preventDefault();

        if (
            investmentAmount === "" ||
            occupation === "" ||
            company === "" ||
            experience === "" ||
            reason === "" ||
            valueAddition === ""
        ) {
            toast.error("Please fill all mandatory fields.", {
                position: "top-center",
            });
            return;
        }

        if (Number(investmentAmount) <= 0) {
            toast.error("Investment amount must be greater than 0.");
            return;
        }

        try {

            // Prevent Duplicate Request

            const q = query(
                collection(db, "InvestmentRequests"),
                where("startupId", "==", startup.id),
                where("investorId", "==", currentUser.uid)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                toast.warning(
                    "You have already sent an investment request for this startup."
                );
                return;
            }

            // Fetch Startup Owner Details

            const ownerRef = doc(db, "users", startup.ownerId);
            const ownerSnap = await getDoc(ownerRef);

            if (!ownerSnap.exists()) {
                toast.error("Startup owner details not found.", {
                    position: "top-center",
                });
                return;
            }

            const owner = ownerSnap.data();

            // Save Request

            const investmentRequest = {

                startupId: startup.id,
                startupTitle: startup.title,

                ownerId: startup.ownerId,
                ownerName: owner.name,
                ownerEmail: owner.email,
                ownerContact: owner.contact,

                investorId: currentUser.uid,
                investorName: investor.name,
                investorEmail: investor.email,
                investorContact: investor.contact,

                investmentAmount: Number(investmentAmount),

                occupation,
                company,
                experience,

                reason,
                valueAddition,

                requestStatus: "Pending",

                created_at: Timestamp.now(),
            };

            await addDoc(
                collection(db, "InvestmentRequests"),
                investmentRequest
            );

            toast.success(
                "Investment request submitted successfully.",
                {
                    position: "top-center",
                }
            );

            navigate("/viewIdeas");

        } catch (error) {

            console.log(error);

            toast.error(
                "Something went wrong.",
                {
                    position: "top-center",
                }
            );

        }
    };

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

    if (!startup || !investor) {
        return (
            <div className="container py-5 text-center">
                <h2>Data Not Found</h2>
            </div>
        );
    }
    return (
        <>
            {/* Hero Section */}

            <div
                className="container-fluid bg-primary py-5 bg-header"
                style={{ marginBottom: "70px" }}
            >
                <div className="container py-5">
                    <div className="text-center">

                        <div
                            className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow"
                            style={{
                                width: "100px",
                                height: "100px",
                            }}
                        >
                            <i
                                className="bi bi-cash-coin text-success"
                                style={{ fontSize: "45px" }}
                            ></i>
                        </div>

                        <h1 className="display-4 text-white fw-bold mt-4">
                            Invest in Startup
                        </h1>

                        <p className="text-white fs-5">
                            Submit your investment request to the startup owner.
                        </p>

                    </div>
                </div>
            </div>

            <div className="container mb-5">

                <form onSubmit={submitInvestment}>

                    <div className="row">

                        {/* LEFT SIDE */}

                        <div className="col-lg-8">

                            {/* Startup Summary */}

                            <div className="card shadow-lg border-0 rounded-4 mb-4">

                                <div className="card-header bg-primary text-white">

                                    <h4 className="mb-0">
                                        Startup Details
                                    </h4>

                                </div>

                                <div className="card-body">

                                    <div className="row">

                                        <div className="col-md-6 mb-3">
                                            <strong>Startup</strong>
                                            <p>{startup.title}</p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <strong>Funding Required</strong>
                                            <p>₹ {startup.fundingRequired}</p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <strong>Equity Offered</strong>
                                            <p>{startup.equity}%</p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <strong>Location</strong>
                                            <p>{startup.location}</p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* Investment Details */}

                            <div className="card shadow-lg border-0 rounded-4">

                                <div className="card-header bg-success text-white">

                                    <h4 className="mb-0">
                                        Investment Details
                                    </h4>

                                </div>

                                <div className="card-body">

                                    <div className="row">

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label">
                                                Investment Amount (₹)
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                value={investmentAmount}
                                                onChange={(e) =>
                                                    setInvestmentAmount(e.target.value)
                                                }
                                            />

                                        </div>

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label">
                                                Occupation
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={occupation}
                                                onChange={(e) =>
                                                    setOccupation(e.target.value)
                                                }
                                            />

                                        </div>

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label">
                                                Company
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={company}
                                                onChange={(e) =>
                                                    setCompany(e.target.value)
                                                }
                                            />

                                        </div>

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label">
                                                Experience (Years)
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                value={experience}
                                                onChange={(e) =>
                                                    setExperience(e.target.value)
                                                }
                                            />

                                        </div>



                                        <div className="col-12 mb-4">

                                            <label className="form-label">
                                                Why do you want to invest?
                                            </label>

                                            <textarea
                                                rows="4"
                                                className="form-control"
                                                value={reason}
                                                onChange={(e) =>
                                                    setReason(e.target.value)
                                                }
                                            />

                                        </div>

                                        <div className="col-12">

                                            <label className="form-label">
                                                What value can you bring besides money?
                                            </label>

                                            <textarea
                                                rows="4"
                                                className="form-control"
                                                value={valueAddition}
                                                onChange={(e) =>
                                                    setValueAddition(e.target.value)
                                                }
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDE */}

                        <div className="col-lg-4">

                            <div
                                className="card shadow-lg border-0 rounded-4 sticky-top"
                                style={{ top: "120px" }}
                            >

                                <div className="card-header bg-dark text-white">

                                    <h4 className="mb-0">
                                        Investor Details
                                    </h4>

                                </div>

                                <div className="card-body">

                                    <div className="text-center mb-4">

                                        <div
                                            className="rounded-circle bg-primary text-white mx-auto d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                fontSize: "34px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {investor.name.charAt(0).toUpperCase()}
                                        </div>

                                        <h4 className="mt-3">
                                            {investor.name}
                                        </h4>

                                    </div>

                                    <div className="mb-3">

                                        <label>Name</label>

                                        <input
                                            className="form-control"
                                            value={investor.name}
                                            readOnly
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>Email</label>

                                        <input
                                            className="form-control"
                                            value={investor.email}
                                            readOnly
                                        />

                                    </div>

                                    <div className="mb-4">

                                        <label>Contact</label>

                                        <input
                                            className="form-control"
                                            value={investor.contact}
                                            readOnly
                                        />

                                    </div>

                                    <div className="alert alert-info">

                                        <small>

                                            <i className="bi bi-info-circle me-2"></i>

                                            Your investment request will be sent to the startup owner.
                                            You can track your request in Track Requests Section.

                                        </small>

                                    </div>

                                    <div className="d-grid gap-2 mt-4">

                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg"
                                        >
                                            <i className="bi bi-send me-2"></i>

                                            Submit Request
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-lg"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </>
    );
}