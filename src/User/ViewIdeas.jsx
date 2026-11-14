import { RingLoader } from "react-spinners";
import { db, styleObj } from "../Firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function ViewIdeas() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);


    setTimeout(() => {
        setLoad(false);
    }, 2000);

    useEffect(() => {
        const StartupIdeasRef = collection(db, "StartupIdeas");

        const q = query(
            StartupIdeasRef,
            where("status", "==", "Approved")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const startup = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setData(startup);
        });

        return () => unsubscribe();
    }, []);
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
                            <h1 className="display-4 text-white animated zoomIn">View StartupIdeas</h1>
                            <a href="" className="h5 text-white">
                                Home
                            </a>
                            <i className="far fa-circle text-white px-2" />
                            <a href="" className="h5 text-white">
                                View StartupIdeas
                            </a>
                        </div>
                    </div>
                </div>


                <div className="row g-5">
                    {data.map((el, index) => (
                        <>

                            <div className="col-lg-4 col-md-6 wow zoomIn" data-wow-delay="0.6s">
                                <div className="service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
                                    <div className="service-icon">
                                        <i class="bi bi-star"></i>
                                    </div>
                                    <h4 className="mb-3">{el.title}</h4>
                                    <p className="m-0">
                                        {el.description}
                                    </p>
                                    <Link to={'/idea-description/' + el.id} className="btn btn-lg btn-primary rounded" >
                                        <i className="bi bi-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}