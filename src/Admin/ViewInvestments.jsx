import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
    collection,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { db, styleObj } from "../Firebase";

export default function ViewInvestments() {

    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [requests, setRequests] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {

        if (!currentUser) {
            toast.error("Please Login");
            setLoad(false);
            return;
        }

       const q = collection(db, "InvestmentRequests");

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setRequests(data);
                setLoad(false);

            },
            (error) => {

                console.log(error);

                toast.error("Unable to fetch requests");

                setLoad(false);

            }
        );

        return () => unsubscribe();

    }, []);

    const updateStatus = async (id, status) => {

        setLoad(true)
        try {

            await updateDoc(
                doc(db, "InvestmentRequests", id),
                {
                    requestStatus: status,
                }
            );

            toast.success(`Request ${status}`);
            setTimeout(() => {
                setLoad(false);
            }, 2000);
        } catch (error) {

            console.log(error);

            toast.error("Something went wrong");
            setTimeout(() => {
                setLoad(false);
            }, 2000);
        }

    };

    const getBadge = (status) => {

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
                            className="bi bi-briefcase-fill text-primary"
                            style={{ fontSize: "45px" }}
                        ></i>
                    </div>

                    <h1 className="display-4 fw-bold text-white mt-4">
                        Investment Requests
                    </h1>

                    <p className="text-white fs-5">
                        Review investment requests received on your startup ideas.
                    </p>

                </div>

            </div>
        </div>
        <RingLoader loading={load} cssOverride={styleObj} size={100} color={"#65a0b7"} />

            <div className={load ? "d-none" : ""}>
        <div className="container mb-5">

            {requests.length === 0 ? (

                <div className="text-center py-5">

                    <i
                        className="bi bi-inbox display-1 text-secondary"
                    ></i>

                    <h2 className="mt-4">
                        No Investment Requests Yet
                    </h2>

                    <p className="text-muted">
                        Investors haven't submitted any requests yet.
                    </p>

                </div>

            ) : (

                <div className="card shadow-lg border-0 rounded-4">

                    <div className="card-header bg-primary text-white">

                        <h3 className="mb-0">
                            All Investment Requests
                        </h3>

                    </div>

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover align-middle text-center mb-0">

                            <thead className="table-dark">

                                <tr>

                                    <th>Sr.</th>

                                    <th>Startup</th>
                                    <th>Owner</th>

                                    <th>Investor</th>

                                    <th>Contact</th>

                                    <th>Investment</th>

                                    <th>Occupation</th>

                                    <th>Company</th>

                                    <th>Experience</th>

                                    <th>Reason</th>

                                    <th>Value Addition</th>

                                    <th>Status</th>

                                   

                                </tr>

                            </thead>

                            <tbody>

                                {requests.map((item, index) => (

                                    <tr key={item.id}>

                                        <td>{index + 1}</td>

                                        <td>

                                            <strong>
                                                {item.startupTitle}
                                            </strong>

                                        </td>
                                        <td>

                                            <div>

                                                <strong>
                                                    {item.ownerName}
                                                </strong>

                                                <br />

                                                <small>
                                                    {item.ownerEmail}
                                                </small>

                                            </div>

                                        </td>

                                        <td>

                                            <div>

                                                <strong>
                                                    {item.investorName}
                                                </strong>

                                                <br />

                                                <small>
                                                    {item.investorEmail}
                                                </small>

                                            </div>

                                        </td>

                                        <td>
                                            {item.investorContact}
                                        </td>

                                        <td>

                                            <span className="fw-bold text-success">

                                                ₹ {Number(item.investmentAmount).toLocaleString()}

                                            </span>

                                        </td>

                                        <td>
                                            {item.occupation}
                                        </td>

                                        <td>
                                            {item.company}
                                        </td>

                                        <td>
                                            {item.experience} Years
                                        </td>

                                        <td
                                            style={{
                                                minWidth: "220px",
                                                textAlign: "left",
                                            }}
                                        >
                                            {item.reason}
                                        </td>

                                        <td
                                            style={{
                                                minWidth: "220px",
                                                textAlign: "left",
                                            }}
                                        >
                                            {item.valueAddition}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge bg-${getBadge(item.requestStatus)} px-3 py-2`}
                                            >
                                                {item.requestStatus}
                                            </span>

                                        </td>

                                        

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
        </div>

    </>
);
}