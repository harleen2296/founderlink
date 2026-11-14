
import { RingLoader } from "react-spinners";
import { db, styleObj } from "../Firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom"; export default function Home() {
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
      <>

        <div
          id="header-carousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">

            {/* Slide 1 */}
            <div className="carousel-item active">
              <img className="w-100" src="img/carousel-1.jpg" alt="FounderLink" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: 900 }}>
                  <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                    Connect • Innovate • Invest
                  </h5>

                  <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                    Turn Innovative Ideas Into Successful Startups
                  </h1>

                  <p className="fs-5 text-white mb-4 animated fadeInUp">
                    FounderLink connects entrepreneurs and investors, enabling founders
                    to showcase innovative startup ideas and helping investors discover
                    promising business opportunities.
                  </p>

                  <a
                    href="/startupideas"
                    className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft"
                  >
                    Explore Ideas
                  </a>

                  <a
                    href="/addstartupideas"
                    className="btn btn-outline-light py-md-3 px-md-5 animated slideInRight"
                  >
                    Submit Your Idea
                  </a>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="carousel-item">
              <img className="w-100" src="img/carousel-2.jpg" alt="Investment" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: 900 }}>
                  <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                    Empowering Entrepreneurs
                  </h5>

                  <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                    Discover, Invest & Grow Together
                  </h1>

                  <p className="fs-5 text-white mb-4 animated fadeInUp">
                    Browse verified startup ideas, connect directly with founders,
                    submit investment requests, and build partnerships that drive
                    innovation and business growth.
                  </p>

                  <a
                    href="/investmentrequests"
                    className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft"
                  >
                    Invest Now
                  </a>

                  <a
                    href="/contact"
                    className="btn btn-outline-light py-md-3 px-md-5 animated slideInRight"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        {/* Full Screen Search Start */}
        <div className="modal fade" id="searchModal" tabIndex={-1}>
          <div className="modal-dialog modal-fullscreen">
            <div
              className="modal-content"
              style={{ background: "rgba(9, 30, 62, .7)" }}
            >
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn bg-white btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body d-flex align-items-center justify-content-center">
                <div className="input-group" style={{ maxWidth: 600 }}>
                  <input
                    type="text"
                    className="form-control bg-transparent border-primary p-3"
                    placeholder="Type search keyword"
                  />
                  <button className="btn btn-primary px-4">
                    <i className="bi bi-search" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Full Screen Search End */}
        {/* Facts Start */}
        <div className="container-fluid facts py-5 pt-lg-0">
          <div className="container py-5 pt-lg-0">
            <div className="row gx-0">

              <div className="col-lg-4 wow zoomIn" data-wow-delay="0.1s">
                <div
                  className="bg-primary shadow d-flex align-items-center justify-content-center p-4"
                  style={{ height: 150 }}
                >
                  <div
                    className="bg-white d-flex align-items-center justify-content-center rounded mb-2"
                    style={{ width: 60, height: 60 }}
                  >
                    <i className="fa fa-lightbulb text-primary" />
                  </div>

                  <div className="ps-4">
                    <h5 className="text-white mb-0">Startup Ideas</h5>
                    <h1 className="text-white mb-0" data-toggle="counter-up">
                      500+
                    </h1>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 wow zoomIn" data-wow-delay="0.3s">
                <div
                  className="bg-light shadow d-flex align-items-center justify-content-center p-4"
                  style={{ height: 150 }}
                >
                  <div
                    className="bg-primary d-flex align-items-center justify-content-center rounded mb-2"
                    style={{ width: 60, height: 60 }}
                  >
                    <i className="fa fa-users text-white" />
                  </div>

                  <div className="ps-4">
                    <h5 className="text-primary mb-0">Registered Founders</h5>
                    <h1 className="mb-0" data-toggle="counter-up">
                      1200+
                    </h1>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 wow zoomIn" data-wow-delay="0.6s">
                <div
                  className="bg-primary shadow d-flex align-items-center justify-content-center p-4"
                  style={{ height: 150 }}
                >
                  <div
                    className="bg-white d-flex align-items-center justify-content-center rounded mb-2"
                    style={{ width: 60, height: 60 }}
                  >
                    <i className="fa fa-handshake text-primary" />
                  </div>

                  <div className="ps-4">
                    <h5 className="text-white mb-0">Successful Investments</h5>
                    <h1 className="text-white mb-0" data-toggle="counter-up">
                      350+
                    </h1>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* Facts End */}
        {/* About Start */}
        <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
          <div className="container py-5">
            <div className="row g-5">

              <div className="col-lg-7">

                <div className="section-title position-relative pb-3 mb-5">
                  <h5 className="fw-bold text-primary text-uppercase">
                    About FounderLink
                  </h5>

                  <h1 className="mb-0">
                    Connecting Innovative Entrepreneurs with Visionary Investors
                  </h1>
                </div>

                <p className="mb-4">
                  FounderLink is a collaborative platform where entrepreneurs can
                  showcase their startup ideas, connect with investors, and build
                  meaningful partnerships. Investors can explore innovative business
                  concepts, review funding opportunities, and invest in startups with
                  strong growth potential.
                </p>

                <div className="row g-0 mb-3">

                  <div className="col-sm-6 wow zoomIn" data-wow-delay="0.2s">

                    <h5 className="mb-3">
                      <i className="fa fa-check text-primary me-3"></i>
                      Share Startup Ideas
                    </h5>

                    <h5 className="mb-3">
                      <i className="fa fa-check text-primary me-3"></i>
                      Connect with Investors
                    </h5>

                  </div>

                  <div className="col-sm-6 wow zoomIn" data-wow-delay="0.4s">

                    <h5 className="mb-3">
                      <i className="fa fa-check text-primary me-3"></i>
                      Secure Investment Opportunities
                    </h5>

                    <h5 className="mb-3">
                      <i className="fa fa-check text-primary me-3"></i>
                      Grow Through Collaboration
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
                    <i className="fa fa-envelope text-white"></i>
                  </div>

                  <div className="ps-4">
                    <h5 className="mb-2">Need Help?</h5>
                    <h4 className="text-primary mb-0">
                      support@founderlink.com
                    </h4>
                  </div>
                </div>

                <a
                  href="/startupideas"
                  className="btn btn-primary py-3 px-5 mt-3 wow zoomIn"
                  data-wow-delay="0.9s"
                >
                  Explore Startup Ideas
                </a>

              </div>

              <div className="col-lg-5" style={{ minHeight: 500 }}>
                <div className="position-relative h-100">
                  <img
                    className="position-absolute w-100 h-100 rounded wow zoomIn"
                    data-wow-delay="0.9s"
                    src="img/about.jpg"
                    alt="FounderLink"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* About End */}
        {/* Features Start */}
        <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
          <div className="container py-5">
            <div
              className="section-title text-center position-relative pb-3 mb-5 mx-auto"
              style={{ maxWidth: 650 }}
            >
              <h5 className="fw-bold text-primary text-uppercase">
                Why Choose FounderLink
              </h5>

              <h1 className="mb-0">
                Empowering Entrepreneurs and Connecting Them with the Right Investors
              </h1>
            </div>

            <div className="row g-5">

              {/* Left Features */}
              <div className="col-lg-4">

                <div className="row g-5">

                  <div className="col-12 wow zoomIn" data-wow-delay="0.2s">
                    <div
                      className="bg-primary rounded d-flex align-items-center justify-content-center mb-3"
                      style={{ width: 60, height: 60 }}
                    >
                      <i className="fa fa-lightbulb text-white"></i>
                    </div>

                    <h4>Showcase Innovative Ideas</h4>

                    <p className="mb-0">
                      Present your startup ideas to a community of entrepreneurs and
                      investors looking for innovative business opportunities.
                    </p>
                  </div>

                  <div className="col-12 wow zoomIn" data-wow-delay="0.6s">
                    <div
                      className="bg-primary rounded d-flex align-items-center justify-content-center mb-3"
                      style={{ width: 60, height: 60 }}
                    >
                      <i className="fa fa-search-dollar text-white"></i>
                    </div>

                    <h4>Discover Investment Opportunities</h4>

                    <p className="mb-0">
                      Investors can explore verified startup ideas and identify
                      businesses with strong growth potential.
                    </p>
                  </div>

                </div>

              </div>

              {/* Center Image */}

              <div
                className="col-lg-4 wow zoomIn"
                data-wow-delay="0.9s"
                style={{ minHeight: 350 }}
              >
                <div className="position-relative h-100">
                  <img
                    className="position-absolute w-100 h-100 rounded"
                    src="img/feature.jpg"
                    alt="FounderLink"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              {/* Right Features */}

              <div className="col-lg-4">

                <div className="row g-5">

                  <div className="col-12 wow zoomIn" data-wow-delay="0.4s">
                    <div
                      className="bg-primary rounded d-flex align-items-center justify-content-center mb-3"
                      style={{ width: 60, height: 60 }}
                    >
                      <i className="fa fa-handshake text-white"></i>
                    </div>

                    <h4>Build Strong Partnerships</h4>

                    <p className="mb-0">
                      Connect founders and investors to collaborate, fund innovative
                      ventures, and grow successful businesses together.
                    </p>
                  </div>

                  <div className="col-12 wow zoomIn" data-wow-delay="0.8s">
                    <div
                      className="bg-primary rounded d-flex align-items-center justify-content-center mb-3"
                      style={{ width: 60, height: 60 }}
                    >
                      <i className="fa fa-shield-alt text-white"></i>
                    </div>

                    <h4>Secure & Transparent Platform</h4>

                    <p className="mb-0">
                      All startup ideas and investment requests are reviewed to provide
                      a reliable and trustworthy collaboration environment.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
        {/* Features End */}
        {/* Service Start */}
        <div className="row g-5">
          {data.slice(0,12)?.map((el, index) => (
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
        {/* Service End */}




      </>


    </>
  )
}