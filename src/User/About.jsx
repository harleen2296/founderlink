import { useState } from "react";
import { RingLoader } from "react-spinners";
import { styleObj } from "../Firebase";

export default function About(){
   const [load, setLoad] = useState(false);

    return(
        <>
        <>
          <RingLoader loading={load} cssOverride={styleObj} size={100} color={"#65a0b7"} />
        <div
  className="container-fluid bg-primary py-5 bg-header"
  style={{ marginBottom: 90 }}
>
  <div className="row py-5">
    <div className="col-12 pt-lg-5 mt-lg-5 text-center">
      <h1 className="display-4 text-white animated zoomIn">About Us</h1>
      <a href="" className="h5 text-white">
        Home
      </a>
      <i className="far fa-circle text-white px-2" />
      <a href="" className="h5 text-white">
        About
      </a>
    </div>
  </div>
</div>

  {/* About Start */}
  <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-7">
          <div className="section-title position-relative pb-3 mb-5">
            <h5 className="fw-bold text-primary text-uppercase">About Us</h5>
            <h1 className="mb-0">
              The Best IT Solution With 10 Years of Experience
            </h1>
          </div>
          <p className="mb-4">
            Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor
            sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem
            et sit, sed stet no labore lorem sit. Sanctus clita duo justo et
            tempor eirmod magna dolore erat amet
          </p>
          <div className="row g-0 mb-3">
            <div className="col-sm-6 wow zoomIn" data-wow-delay="0.2s">
              <h5 className="mb-3">
                <i className="fa fa-check text-primary me-3" />
                Award Winning
              </h5>
              <h5 className="mb-3">
                <i className="fa fa-check text-primary me-3" />
                Professional Staff
              </h5>
            </div>
            <div className="col-sm-6 wow zoomIn" data-wow-delay="0.4s">
              <h5 className="mb-3">
                <i className="fa fa-check text-primary me-3" />
                24/7 Support
              </h5>
              <h5 className="mb-3">
                <i className="fa fa-check text-primary me-3" />
                Fair Prices
              </h5>
            </div>
          </div>
          <div
            className="d-flex align-items-center mb-4 wow fadeIn"
            data-wow-delay="0.6s"
          >
            <div
              className="bg-primary d-flex align-items-center justify-content-center rounded"
              style={{ width: 60, height: 60 }}
            >
              <i className="fa fa-phone-alt text-white" />
            </div>
            <div className="ps-4">
              <h5 className="mb-2">Call to ask any question</h5>
              <h4 className="text-primary mb-0">+012 345 6789</h4>
            </div>
          </div>
          <a
            href="quote.html"
            className="btn btn-primary py-3 px-5 mt-3 wow zoomIn"
            data-wow-delay="0.9s"
          >
            Request A Quote
          </a>
        </div>
        <div className="col-lg-5" style={{ minHeight: 500 }}>
          <div className="position-relative h-100">
            <img
              className="position-absolute w-100 h-100 rounded wow zoomIn"
              data-wow-delay="0.9s"
              src="img/about.jpg"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* About End */}
</>

        </>
    )
}