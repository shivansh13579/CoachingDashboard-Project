import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { get } from "../../utils/api";
import moment from "moment";

function ViewStudent() {
  const navigation = useNavigate();
  // const [loading, setLoading] = useState(false);
  // const [batches, setBatches] = useState([]);
  const [studentDetails, setStudentDetails] = useState("");
  const [studentFee, setStudentFee] = useState([]);
  const [payment, setPayment] = useState([]);

  let { id } = useParams();

  // getStudentData
  const getStudentData = async (id) => {
    try {
      const apiData = await get(`/students/${id}`, true);

      if (apiData.status === 200) {
        setStudentDetails(apiData.body);
      } else {
        toast.error(apiData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getStudentData(id);
  }, [id]);

  // TotalPaymentByStudent
  const getTotalPaymentByStudent = async (id) => {
    try {
      const apiData = await get(`/studentFees?student=${id}`, true);
      if (apiData.status === 200) {
        setPayment(apiData.totalAmount);
      } else {
        toast.error("Please Add Payment");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getTotalPaymentByStudent(id);
  }, []);

  // StudentFeesData
  const getStudentFeesData = async (id) => {
    try {
      const apiData = await get(`/studentFees/payment?student=${id}`, true);
      console.log("api", apiData);
      if ((apiData.status === 200) & (apiData.body.length > 0)) {
        setStudentFee(apiData.body);
      } else {
        toast.error("Please Add Payment");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getStudentFeesData(id);
  }, [id]);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex">
                  <Link
                    to={"#"}
                    className="card-title nav-link"
                    onClick={() => {
                      navigation(-1);
                    }}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span className="pl-1"> View Student</span>
                  </Link>
                </div>

                {/* <div class="col-md-8 grid-margin stretch-card mx-auto">
                  <div class="card">
                    <div class="card-body"> */}
                <div className="d-flex gap-2">
                  <div class="col-lg-6 grid-margin stretch-card">
                    <div class="card">
                      <div class="card-body">
                        <h4 class="card-title d-flex text-black ">
                          {" "}
                          Student Details
                        </h4>

                        <div class="table-responsive">
                          <table class="table">
                            <tbody>
                              <tr>
                                <td>Name:-</td>
                                <td>
                                  {" "}
                                  {`${studentDetails.firstName} ${studentDetails.lastName}`}
                                </td>
                              </tr>
                              <tr>
                                <td>Father Name:- </td>
                                <td>{studentDetails.fatherName}</td>
                              </tr>
                              <tr>
                                <td>Batch Name:- </td>
                                <td>{studentDetails.batch?.batchName}</td>
                              </tr>
                              <tr>
                                <td>Mobile:- </td>
                                <td>{studentDetails.mobile}</td>
                              </tr>
                              <tr>
                                <td>Parent Mobile:- </td>
                                <td>{studentDetails.parentMobile}</td>
                              </tr>
                              <tr>
                                <td> Joining Date: - </td>
                                <td>
                                  {moment(studentDetails.createdAt).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-6 grid-margin stretch-card">
                    <div class="card">
                      <div class="card-body">
                        <h4 class="card-title d-flex text-black">
                          {" "}
                          Payment Details
                        </h4>

                        <div class="table-responsive">
                          <table class="table">
                            <thead></thead>
                            <tbody>
                              {studentFee && studentFee.length > 0
                                ? studentFee.map((value) => {
                                    return (
                                      <tr value={value.id}>
                                        <td>
                                          {moment(value.createdAt).format(
                                            "dddd, Do MMM YYYY"
                                          )}
                                        </td>
                                        <td>
                                          Rs.
                                          {value?.amount}
                                        </td>
                                      </tr>
                                    );
                                  })
                                : null}
                              <tr>
                                <td>Total Amount</td>
                                <td>Rs {payment > 0 ? payment : 0}</td>
                              </tr>
                            </tbody>
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
  );
}

export default ViewStudent;
