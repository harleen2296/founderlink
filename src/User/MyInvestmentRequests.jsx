import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
    collection,
    onSnapshot,
    query,
    where,
    getDocs,
    doc,
    getDoc,
} from "firebase/firestore";
import { RingLoader } from "react-spinners";
import { db, styleObj } from "../Firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function MyInvestmentRequests() {

    const auth = getAuth();
    const user = auth.currentUser;

    const [requests, setRequests] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {

        if (!user) {
            toast.error("Please login first.");
            setLoad(false);
            return;
        }

        // const q = query(
        //     collection(db, "InvestmentRequests"),
        //     where("investorId", "==", user.uid),
        //     orderBy("created_at", "desc")
        // );

        const q = query(
            collection(db, "InvestmentRequests"),
            where("investorId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(
            q,
            async (snapshot) => {

                const data = await Promise.all(

                    snapshot.docs.map(async (requestDoc) => {

                        const request = {
                            id: requestDoc.id,
                            ...requestDoc.data(),
                        };

                        let owner = null;

                        try {

                            const ownerRef = doc(db, "users", request.ownerId);

                            const ownerSnap = await getDoc(ownerRef);

                            if (ownerSnap.exists()) {

                                owner = ownerSnap.data();

                            }

                        } catch (error) {

                            console.log(error);

                        }

                        return {

                            ...request,

                            owner,

                        };

                    })

                );

                setRequests(data);
                setLoad(false);
            },
            (error) => {
                console.log(error);
                toast.error("Unable to fetch investment requests.");
                setLoad(false);
            }
        );

        return () => unsubscribe();

    }, []);

    const getStatusBadge = (status) => {

        switch (status) {

            case "Approved":
                return "success";

            case "Rejected":
                return "danger";

            case "Paid":
                return "primary";

            default:
                return "warning";
        }

    };

    const getBorderColor = (status) => {

        switch (status) {

            case "Approved":
                return "#198754";

            case "Rejected":
                return "#dc3545";

            case "Paid":
                return "#0d6efd";

            default:
                return "#ffc107";

        }

    };

    const formatDate = (timestamp) => {

        if (!timestamp) return "";

        return timestamp
            .toDate()
            .toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });

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
    return (
        <>
            {/* Header */}

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
                                className="bi bi-wallet2 text-primary"
                                style={{ fontSize: "45px" }}
                            ></i>
                        </div>

                        <h1 className="display-4 fw-bold text-white mt-4">
                            My Investment Requests
                        </h1>

                        <p className="text-white fs-5">
                            Track every investment request you've submitted.
                        </p>

                    </div>

                </div>
            </div>

            <div className="container mb-5">

                {requests.length === 0 ? (

                    <div className="text-center py-5">

                        <i
                            className="bi bi-folder-x text-secondary"
                            style={{ fontSize: "90px" }}
                        ></i>

                        <h2 className="mt-4">
                            No Investment Requests Found
                        </h2>

                        <p className="text-muted">
                            You haven't invested in any startup yet.
                        </p>

                    </div>

                ) : (

                    <div className="row">

                        {requests.map((item) => (

                            <div
                                className="col-lg-6 mb-4"
                                key={item.id}
                            >

                                <div
                                    className="card border-0 shadow-lg h-100"
                                    style={{
                                        borderLeft: `8px solid ${getBorderColor(item.requestStatus)}`,
                                        transition: "0.3s",
                                        borderRadius: "18px",
                                    }}
                                >

                                    <div className="card-body p-4">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <h3 className="fw-bold text-primary">

                                                <i className="bi bi-lightbulb-fill me-2"></i>

                                                {item.startupTitle}

                                            </h3>

                                            <span
                                                className={`badge bg-${getStatusBadge(item.requestStatus)} fs-6 px-3 py-2`}
                                            >
                                                {item.requestStatus}
                                            </span>

                                        </div>

                                        <hr />

                                        <div className="row">

                                            <div className="col-md-6 mb-3">

                                                <strong>
                                                    <i className="bi bi-cash-stack text-success me-2"></i>

                                                    Investment
                                                </strong>

                                                <p className="mb-0">
                                                    ₹ {Number(item.investmentAmount).toLocaleString()}
                                                </p>

                                            </div>

                                            <div className="col-md-6 mb-3">

                                                <strong>

                                                    <i className="bi bi-building me-2"></i>

                                                    Company

                                                </strong>

                                                <p className="mb-0">
                                                    {item.company}
                                                </p>

                                            </div>

                                            <div className="col-md-6 mb-3">

                                                <strong>

                                                    <i className="bi bi-person-workspace me-2"></i>

                                                    Occupation

                                                </strong>

                                                <p className="mb-0">
                                                    {item.occupation}
                                                </p>

                                            </div>

                                            <div className="col-md-6 mb-3">

                                                <strong>

                                                    <i className="bi bi-award me-2"></i>

                                                    Experience

                                                </strong>

                                                <p className="mb-0">
                                                    {item.experience} Years
                                                </p>

                                            </div>

                                            <div className="col-12 mb-3">

                                                <strong>

                                                    <i className="bi bi-chat-left-text me-2"></i>

                                                    Why I Want to Invest

                                                </strong>

                                                <p className="text-secondary">

                                                    {item.reason}

                                                </p>

                                            </div>

                                            <div className="col-12 mb-3">

                                                <strong>

                                                    <i className="bi bi-stars me-2 text-warning"></i>

                                                    Value I Can Bring

                                                </strong>

                                                <p className="text-secondary">

                                                    {item.valueAddition}

                                                </p>

                                            </div>

                                            <div className="col-md-6">

                                                <strong>

                                                    <i className="bi bi-calendar-event me-2"></i>

                                                    Applied On

                                                </strong>

                                                <p>

                                                    {formatDate(item.created_at)}

                                                </p>

                                            </div>

                                            <div className="col-12 mt-3">

                                                <div
                                                    className="card border-0 shadow-sm"
                                                    style={{
                                                        background: "#f8f9fa",
                                                        borderRadius: "15px",
                                                    }}
                                                >

                                                    <div className="card-body">

                                                        <h5 className="text-primary fw-bold mb-4">

                                                            <i className="bi bi-person-circle me-2"></i>

                                                            Startup Owner

                                                        </h5>

                                                        <div className="row align-items-center">

                                                            <div className="col-md-2 text-center">

                                                                <div
                                                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                                                                    style={{
                                                                        width: "70px",
                                                                        height: "70px",
                                                                        fontSize: "30px",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
                                                                    {item.owner?.name?.charAt(0)?.toUpperCase()}
                                                                </div>

                                                            </div>

                                                            <div className="col-md-10">

                                                                <div className="row">

                                                                    <div className="col-md-4">

                                                                        <strong>Name</strong>

                                                                        <p className="mb-2">
                                                                            {item.owner?.name}
                                                                        </p>

                                                                    </div>

                                                                    <div className="col-md-4">

                                                                        <strong>Email</strong>

                                                                        <p className="mb-2">
                                                                            {item.owner?.email}
                                                                        </p>

                                                                    </div>

                                                                    <div className="col-md-4">

                                                                        <strong>Contact</strong>

                                                                        <p className="mb-2">
                                                                            {item.owner?.contact}
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                        {item.requestStatus === "Approved" && (

                                            <div className="alert alert-success mt-3">

                                                <i className="bi bi-check-circle-fill me-2"></i>

                                                Congratulations! Your request has been approved.

                                                <br />

                                                <Link
                                                    to={`/payment/${item.id}`}
                                                    className="btn btn-success mt-3"
                                                >
                                                    <i className="bi bi-credit-card me-2"></i>

                                                    Pay Now

                                                </Link>

                                            </div>

                                        )}

                                        {item.requestStatus === "Rejected" && (

                                            <div className="alert alert-danger mt-3">

                                                <i className="bi bi-x-circle-fill me-2"></i>

                                                Your investment request has been rejected by the startup owner.

                                            </div>

                                        )}

                                        {item.requestStatus === "Pending" && (

                                            <div className="alert alert-warning mt-3">

                                                <i className="bi bi-hourglass-split me-2"></i>

                                                Waiting for the startup owner to review your request.

                                            </div>

                                        )}

                                        {item.requestStatus === "Paid" && (

                                            <div className="alert alert-primary mt-3">

                                                <i className="bi bi-patch-check-fill me-2"></i>

                                                Payment completed successfully.

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </>
    );
}