import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { db, styleObj } from "../Firebase";
import { RingLoader } from "react-spinners";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [load, setLoad] = useState(true);

  setTimeout(() => {
    setLoad(false);
  }, 500);

  const addQueries = async (e) => {
    e.preventDefault();
    setLoad(true);

    if (name === "" || email === "" || subject === "" || message === "") {
      toast.error("All Fields are mandatory", {
        position: "top-center",
      });
      return;
    }

    try {
      const queryRef = collection(db, "queries");

      const newQuery = {
        name,
        email,
        subject,
        message,
        status: "active",
        created_at: Timestamp.now(),
      };

      await addDoc(queryRef, newQuery);

      toast.success("Message Sent Successfully", {
        position: "top-center",
      });
      setTimeout(() => {
        setLoad(false);
      }, 2000);

    } catch (error) {
      toast.error("Something Went Wrong", {
        position: "top-center"
      });
      setTimeout(() => {
        setLoad(false);
      }, 2000);
      console.log(error);
    }
  };
  return (
    <>
      <>
      
        <RingLoader loading={load} cssOverride={styleObj} size={100} color={"#65a0b7"} />

        <div className={load ? "d-none" : ""}>
          <div
            className="container-fluid bg-primary py-5 bg-header"
            style={{ marginBottom: 90 }}
          >
            <div className="row py-5">
              <div className="col-12 pt-lg-5 mt-lg-5 text-center">
                <h1 className="display-4 text-white animated zoomIn">Contact us!</h1>
                <a href="" className="h5 text-white">
                  Home
                </a>
                <i className="far fa-circle text-white px-2" />
                <a href="" className="h5 text-white">
                  Contact us
                </a>
              </div>
            </div>
          </div>
          <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                  <div className="bg-primary rounded p-5 shadow">
                    <form onSubmit={addQueries}>
                      <div className="row g-3">
                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Your Name"
                            style={{ height: "55px" }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div className="col-12">
                          <input
                            type="email"
                            className="form-control bg-light border-0"
                            placeholder="Your Email"
                            style={{ height: "55px" }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>



                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Your Subject"
                            style={{ height: "55px" }}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>

                        <div className="col-12">
                          <textarea
                            className="form-control border-0 bg-light px-4 py-3"
                            rows={4}
                            placeholder="Message"

                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>



                        <div className="col-12">
                          <button
                            className="btn btn-dark w-100 py-3"
                            type="submit"
                          >
                            Submit
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


    </>
  )
}