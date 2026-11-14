import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { db, styleObj } from "../Firebase";

export default function Payment() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [request, setRequest] = useState(null);

    const [load, setLoad] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState("card");

    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const [upiId, setUpiId] = useState("");

    const [processing, setProcessing] = useState(false);

    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [transactionId, setTransactionId] = useState("");

    const [disableCancel, setDisableCancel] = useState(false);

    useEffect(() => {

        const fetchRequest = async () => {

            try {

                const docRef = doc(db, "InvestmentRequests", id);

                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {

                    toast.error("Investment Request Not Found");

                    navigate("/myInvestmentRequests");

                    return;

                }

                setRequest({

                    id: docSnap.id,

                    ...docSnap.data(),

                });

            } catch (error) {

                console.log(error);

                toast.error("Something went wrong");

            } finally {

                setLoad(false);

            }

        };

        fetchRequest();

    }, [id]);



    const validatePayment = () => {

        if (paymentMethod === "card") {

            if (
                cardNumber.trim() === "" ||
                cardHolder.trim() === "" ||
                expiry.trim() === "" ||
                cvv.trim() === ""
            ) {

                toast.error("Please fill all card details.");

                return false;
            }

            const card = cardNumber.replace(/\s/g, "");

            if (!/^\d{16}$/.test(card)) {

                toast.error("Card number must contain exactly 16 digits.");

                return false;
            }

            if (!/^\d{3}$/.test(cvv)) {

                toast.error("CVV must contain exactly 3 digits.");

                return false;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiry)) {

                toast.error("Expiry should be in MM/YY format.");

                return false;
            }

        }

        if (paymentMethod === "upi") {

            if (upiId.trim() === "") {

                toast.error("Please enter UPI ID.");

                return false;
            }

            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(upiId)) {

                toast.error("Invalid UPI ID.");

                return false;
            }

        }

        return true;

    };

    const makePayment = async () => {

        if (!validatePayment()) return;

        try {

            setDisableCancel(true);

            setProcessing(true);

            await new Promise((resolve) => setTimeout(resolve, 3000));

            const txn =
                "FL" +
                Date.now() +
                Math.floor(Math.random() * 1000);

            setTransactionId(txn);

            await updateDoc(
                doc(db, "InvestmentRequests", request.id),
                {
                    requestStatus: "Paid",
                    transactionId: txn,
                    paidAt: new Date(),
                }
            );

            setProcessing(false);

            setPaymentSuccess(true);

            toast.success("Payment Successful", {
                position: "top-center",
            });

        } catch (error) {

            console.log(error);

            setProcessing(false);

            setDisableCancel(false);

            toast.error("Payment Failed", {
                position: "top-center",
            });

        }

    };



    const cancelPayment = () => {

        if (processing) return;

        navigate("/myinvestments");

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

    if (!request) {
        return (
            <RingLoader
                loading={true}
                cssOverride={styleObj}
                size={100}
                color="#65a0b7"
            />
        );
    }

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



    // Show Success Screen
    if (paymentSuccess && request) {


        return (

            <>
                <div
                    className="container-fluid bg-primary py-5 bg-header"
                    style={{ marginBottom: "60px" }}
                >
                    <div className="container py-5 text-center">

                        <div
                            className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow"
                            style={{
                                width: "110px",
                                height: "110px",
                            }}
                        >
                            <i
                                className="bi bi-check-circle-fill text-success"
                                style={{ fontSize: "60px" }}
                            ></i>
                        </div>

                        <h1 className="display-4 text-white fw-bold mt-4">
                            Payment Successful
                        </h1>

                        <p className="text-white fs-5">
                            Thank you for your investment.
                        </p>

                    </div>
                </div>

                <div className="container mb-5">

                    <div className="row justify-content-center">

                        <div className="col-lg-7">

                            <div className="card border-0 shadow-lg rounded-4">

                                <div className="card-body p-5">

                                    <div className="text-center mb-5">

                                        <i
                                            className="bi bi-patch-check-fill text-success"
                                            style={{
                                                fontSize: "90px",
                                            }}
                                        ></i>

                                        <h2 className="fw-bold mt-3">

                                            Payment Completed Successfully

                                        </h2>

                                        <p className="text-muted">

                                            Your investment request has been marked as
                                            <strong className="text-success">
                                                {" "}Paid
                                            </strong>

                                        </p>

                                    </div>

                                    <table className="table table-bordered">

                                        <tbody>

                                            <tr>

                                                <th width="40%">
                                                    Startup
                                                </th>

                                                <td>
                                                    {request?.startupTitle}
                                                </td>

                                            </tr>

                                            <tr>

                                                <th>
                                                    Amount Paid
                                                </th>

                                                <td className="text-success fw-bold">

                                                    ₹ {Number(request?.investmentAmount || 0).toLocaleString()}

                                                </td>

                                            </tr>

                                            <tr>

                                                <th>
                                                    Transaction ID
                                                </th>

                                                <td>

                                                    <code>
                                                        {transactionId}
                                                    </code>

                                                </td>

                                            </tr>

                                            <tr>

                                                <th>
                                                    Payment Method
                                                </th>

                                                <td>

                                                    {paymentMethod === "card"
                                                        ? "Debit / Credit Card"
                                                        : "UPI"}

                                                </td>

                                            </tr>

                                            <tr>

                                                <th>
                                                    Status
                                                </th>

                                                <td>

                                                    <span className="badge bg-success fs-6">

                                                        Paid

                                                    </span>

                                                </td>

                                            </tr>

                                            <tr>

                                                <th>
                                                    Date
                                                </th>

                                                <td>

                                                    {new Date().toLocaleString()}

                                                </td>

                                            </tr>

                                        </tbody>

                                    </table>

                                    <div className="alert alert-success mt-4">

                                        <i className="bi bi-info-circle-fill me-2"></i>

                                        Your investment has been recorded successfully.
                                        The startup owner can now view your payment status.

                                    </div>

                                    <div className="text-center mt-5">

                                        <button
                                            className="btn btn-primary btn-lg px-5"
                                            onClick={() =>
                                                navigate("/myinvestments")
                                            }
                                        >

                                            <i className="bi bi-arrow-left-circle me-2"></i>

                                            Back to My Investments

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </>

        );

    }
    return (
        <>
            {/* Header */}

            <div
                className="container-fluid bg-primary py-5 bg-header"
                style={{ marginBottom: "60px" }}
            >
                <div className="container py-5 text-center">

                    <div
                        className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow"
                        style={{
                            width: "90px",
                            height: "90px",
                        }}
                    >
                        <i
                            className="bi bi-credit-card-fill text-primary"
                            style={{ fontSize: "42px" }}
                        ></i>
                    </div>

                    <h1 className="display-4 text-white fw-bold mt-4">
                        FounderLink Payments
                    </h1>

                    <p className="text-white fs-5">
                        Secure Payment Gateway
                    </p>

                </div>
            </div>

            <div className="container mb-5">

                <div className="row justify-content-center">

                    <div className="col-lg-8">

                        <div className="card shadow-lg border-0 rounded-4">

                            <div className="card-header bg-dark text-white p-4">

                                <div className="d-flex justify-content-between align-items-center">

                                    <h3 className="mb-0">

                                        <i className="bi bi-shield-lock-fill me-2"></i>

                                        Secure Checkout

                                    </h3>

                                    <span className="badge bg-success fs-6">

                                        TEST MODE

                                    </span>

                                </div>

                            </div>

                            <div className="card-body p-5">

                                {/* Startup */}

                                <div className="text-center mb-4">

                                    <h2 className="fw-bold text-primary">

                                        {request?.startupTitle}

                                    </h2>

                                    <h1 className="display-5 text-success fw-bold">

                                        ₹ {Number(request?.investmentAmount || 0).toLocaleString()}

                                    </h1>

                                </div>

                                <hr />

                                {/* Payment Method */}

                                <div
                                    style={{
                                        opacity: processing ? 0.55 : 1,
                                        transition: "0.3s",
                                    }}
                                >
                                    <h4 className="mb-4">
                                        Choose Payment Method
                                    </h4>

                                    <div className="row mb-4">

                                        <div className="col-md-6">

                                            <div
                                                className={`card ${paymentMethod === "card" ? "border-primary border-3" : ""
                                                    } ${processing ? "opacity-50" : ""}`}
                                                style={{
                                                    cursor: processing ? "not-allowed" : "pointer",
                                                    pointerEvents: processing ? "none" : "auto",
                                                }}
                                                onClick={() => !processing && setPaymentMethod("card")}
                                            >

                                                <div className="card-body text-center">

                                                    <i
                                                        className="bi bi-credit-card display-4 text-primary"
                                                    ></i>

                                                    <h5 className="mt-3">

                                                        Card Payment

                                                    </h5>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div
                                                className={`card ${paymentMethod === "upi" ? "border-primary border-3" : ""
                                                    } ${processing ? "opacity-50" : ""}`}
                                                style={{
                                                    cursor: processing ? "not-allowed" : "pointer",
                                                    pointerEvents: processing ? "none" : "auto",
                                                }}
                                                onClick={() => !processing && setPaymentMethod("upi")}
                                            >

                                                <div className="card-body text-center">

                                                    <i
                                                        className="bi bi-phone display-4 text-success"
                                                    ></i>

                                                    <h5 className="mt-3">

                                                        UPI Payment

                                                    </h5>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* CARD FORM */}

                                    {paymentMethod === "card" && (

                                        <>

                                            <div className="mb-3">

                                                <label className="form-label">

                                                    Card Number

                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    disabled={processing}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                />

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">

                                                    Card Holder Name

                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="John Doe"
                                                    value={cardHolder}
                                                    disabled={processing}
                                                    onChange={(e) => setCardHolder(e.target.value)}
                                                />

                                            </div>

                                            <div className="row">

                                                <div className="col-md-6">

                                                    <div className="mb-3">

                                                        <label className="form-label">

                                                            Expiry

                                                        </label>

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="MM/YY"
                                                            value={expiry}
                                                            disabled={processing}
                                                            onChange={(e) => setExpiry(e.target.value)}
                                                        />

                                                    </div>

                                                </div>

                                                <div className="col-md-6">

                                                    <div className="mb-3">

                                                        <label className="form-label">

                                                            CVV

                                                        </label>

                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="123"
                                                            value={cvv}
                                                            disabled={processing}
                                                            onChange={(e) => setCvv(e.target.value)}
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        </>

                                    )}

                                    {/* UPI FORM */}

                                    {paymentMethod === "upi" && (

                                        <div className="mb-4">

                                            <label className="form-label">

                                                UPI ID

                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="example@upi"
                                                value={upiId}
                                                disabled={processing}
                                                onChange={(e) => setUpiId(e.target.value)}
                                            />

                                        </div>

                                    )}
                                </div>
                                <hr />

                                <div
                                    className={`alert ${processing ? "alert-info" : "alert-warning"
                                        } text-center`}
                                >

                                    {processing ? (

                                        <>
                                            <div className="spinner-border text-primary mb-3"></div>

                                            <h5>Processing Payment...</h5>

                                            <p className="mb-0">
                                                Please do not refresh or close this page.
                                            </p>
                                        </>

                                    ) : (

                                        <>
                                            <h5 className="mb-2">
                                                Review your payment details carefully.
                                            </h5>

                                            <p className="mb-0">
                                                Click <strong>Pay Now</strong> to complete the payment or
                                                <strong> Cancel Payment</strong> to return without making any payment.
                                            </p>
                                        </>

                                    )}

                                </div>

                                <div className="d-flex justify-content-center gap-3 mt-4">

                                    <button
                                        className="btn btn-success btn-lg px-5"
                                        onClick={makePayment}
                                        disabled={processing}
                                    >

                                        {processing ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-credit-card me-2"></i>

                                                Pay Now
                                            </>
                                        )}

                                    </button>

                                    <button
                                        className="btn btn-danger btn-lg px-5"
                                        onClick={cancelPayment}
                                        disabled={disableCancel}
                                    >

                                        <i className="bi bi-x-circle me-2"></i>

                                        Cancel Payment

                                    </button>

                                </div>



                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

