import React from "react";
import Layout from "./Layout";

const Home = () => {
  return (
    <>
      <Layout>
        <div className="content-wrapper">
          <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="font-weight-bold mb-0">RoyalUI Dashboard</h4>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary btn-icon-text btn-rounded"
                  >
                    <i className="ti-clipboard btn-icon-prepend"></i>Report
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <p className="card-title text-md-center text-xl-left">
                    Sales
                  </p>
                  <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                    <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                      34040
                    </h3>
                    <i className="ti-calendar icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i>
                  </div>
                  <p className="mb-0 mt-2 text-danger">
                    0.12%
                    <span className="text-black ms-1">
                      <small>(30 days)</small>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <p className="card-title text-md-center text-xl-left">
                    Revenue
                  </p>
                  <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                    <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                      47033
                    </h3>
                    <i className="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i>
                  </div>
                  <p className="mb-0 mt-2 text-danger">
                    0.47%
                    <span className="text-black ms-1">
                      <small>(30 days)</small>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <p className="card-title text-md-center text-xl-left">
                    Downloads
                  </p>
                  <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                    <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                      40016
                    </h3>
                    <i className="ti-agenda icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i>
                  </div>
                  <p className="mb-0 mt-2 text-success">
                    64.00%
                    <span className="text-black ms-1">
                      <small>(30 days)</small>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <p className="card-title text-md-center text-xl-left">
                    Returns
                  </p>
                  <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                    <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                      61344
                    </h3>
                    <i className="ti-layers-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i>
                  </div>
                  <p className="mb-0 mt-2 text-success">
                    23.00%
                    <span className="text-black ms-1">
                      <small>(30 days)</small>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card position-relative">
                <div className="card-body">
                  <p className="card-title">Detailed Reports</p>
                  <div className="row">
                    <div className="col-md-12 col-xl-3 d-flex flex-column justify-content-center">
                      <div className="ml-xl-4">
                        <h1>33500</h1>
                        <h3 className="font-weight-light mb-xl-4">Sales</h3>
                        <p className="text-muted mb-2 mb-xl-0">
                          The total number of sessions within the date range. It
                          is the period time a user is actively engaged with
                          your website, page or app, etc
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-9">
                      <div className="row">
                        <div className="col-md-6 mt-3 col-xl-5">
                          <canvas id="north-america-chart"></canvas>
                          <div id="north-america-legend"></div>
                        </div>
                        <div className="col-md-6 col-xl-7">
                          <div className="table-responsive mb-3 mb-md-0">
                            <table className="table table-borderless report-table">
                              <tr>
                                <td className="text-muted">Illinois</td>
                                <td className="w-100 px-0">
                                  <div className="progress progress-md mx-4">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: "70%" }}
                                      aria-valuenow="70"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                                <td>
                                  <h5 className="font-weight-bold mb-0">524</h5>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-muted">Washington</td>
                                <td className="w-100 px-0">
                                  <div className="progress progress-md mx-4">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: "30%" }}
                                      aria-valuenow="30"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                                <td>
                                  <h5 className="font-weight-bold mb-0">722</h5>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-muted">Mississippi</td>
                                <td className="w-100 px-0">
                                  <div className="progress progress-md mx-4">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: "95%" }}
                                      aria-valuenow="95"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                                <td>
                                  <h5 className="font-weight-bold mb-0">173</h5>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-muted">California</td>
                                <td className="w-100 px-0">
                                  <div className="progress progress-md mx-4">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: "60%" }}
                                      aria-valuenow="60"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                                <td>
                                  <h5 className="font-weight-bold mb-0">945</h5>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-muted">Maryland</td>
                                <td className="w-100 px-0">
                                  <div className="progress progress-md mx-4">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: "40%" }}
                                      aria-valuenow="40"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                                <td>
                                  <h5 className="font-weight-bold mb-0">553</h5>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-muted">Alaska</td>
                                <td className="w-100 px-0">
                                  <div className="progress progress-md mx-4">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: "75%" }}
                                      aria-valuenow="75"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                                <td>
                                  <h5 className="font-weight-bold mb-0">912</h5>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
