import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { get } from "../../utils/api";
import { toast } from "react-toastify";
import moment from "moment";

function StudentFeesList() {
  const [studentFees, setStudentFees] = useState([]);
  const [fullPaymentStudent, setFullPaymentStudent] = useState([]);
  const [remaningPaymentOfStudent, setRemaningPaymentOfStudent] = useState([]);
  const [isDeleted, setIsDeleted] = useState(true);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // const [toggleFilterSection, setToggleFilterSection] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 10,
    totalRecords: 10,
  });

  // getAllBatches
  const getAllBaches = async () => {
    try {
      const apiData = await get(`/batches`, true);
      if (apiData.status === 200) {
        setBatches(apiData.body);
      } else {
        toast.error(apiData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllBaches();
  }, []);
  // getAllData
  const getAllData = async () => {
    try {
      let url = `/studentFees/allStudent?page=${pagination.page}&limit=10`;
      if (selectedBatch) url += `&batch=${selectedBatch}`;
      const apiData = await get(url, true);
      console.log("apiData", apiData);
      if (apiData.status === 200) {
        setStudentFees(apiData.body);
        fullPaymentStudent(apiData.studentFullPayment);
        remaningPaymentOfStudent(apiData.studentRemaningFees);
        setPagination({
          page: apiData?.page,
          totalPages: apiData?.totalPageOfStudent,
          totalRecords: apiData?.totalRecordsOfStudent[0]?.count,
        });
      } else {
        toast.error(apiData.messgae);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllData();
  }, [isDeleted, pagination.page, selectedBatch]);

  useEffect(() => {
    const studentFees = JSON.parse(localStorage.getItem("studentFees"));
    if (studentFees && studentFees.length > 0) {
      setStudentFees(studentFees);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studentFees", JSON.stringify(studentFees));
  }, [studentFees]);

  // handleNextPage
  function handleNextPage() {
    if (pagination.page < pagination.totalPages) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    }
  }

  // handlePreviousPage
  function handlePreviousPage() {
    if (pagination.page > 1) {
      setPagination({ ...pagination, page: pagination.page - 1 });
    }
  }

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="card-title">Student Payments</p>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control custom-form-control"
                      onChange={(evt) => {
                        setSelectedBatch(evt.target.value);
                      }}
                      value={selectedBatch}
                    >
                      <option value="">Select batch</option>
                      {batches.map((batch) => {
                        return (
                          <option value={batch._id} key={batch._id}>
                            {batch.batchName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="d-flex gap-5">
                    <div>
                      <input
                        className="form-check-input mx-2"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckDefault"
                      >
                        Full Payment
                      </label>
                    </div>
                    <div>
                      <input
                        className="form-check-input mx-2"
                        type="checkbox"
                        value=""
                        id="flexCheckChecked"
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckChecked"
                      >
                        Remaning Payment
                      </label>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Student Name</th>
                        <th>Batch</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentFees && studentFees.length > 0
                        ? studentFees.map((value, index) => {
                            return (
                              <tr key={value.student._id}>
                                <td>{index + 1}</td>
                                <td>{`${value?.student?.firstName}  ${value?.student?.lastName}`}</td>
                                <td>{value?.student?.batch?.batchName}</td>
                                <td>Rs {value?.amount}</td>
                                <td>
                                  {" "}
                                  {moment(value.student.createdAt).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>

                                <td className="d-flex gap-1">
                                  <Link
                                    to={`/studentFees/edit/${value?._id}`}
                                    className="btn btn-info p-2 text-light"
                                  >
                                    <i class="fa-solid fa-pen-to-square"></i>
                                  </Link>
                                  <Link
                                    to={`/students/view/${value.student._id}`}
                                    className="btn btn-warning p-2 text-light"
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(value?._id)}
                                    className="btn btn-danger p-2 text-light"
                                  >
                                    <i class="fa-solid fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
              </div>
              <div aria-label="Page navigation example ">
                {/* <ul className="pagination justify-content-end mt-2">
                  <li
                    className={`page-item ${
                      pagination.page == 1 ? "disabled" : null
                    }`}
                  >
                    <button onClick={handlePreviousPage} className="page-link">
                      Previous
                    </button>
                  </li>

                  <li
                    className={`page-item ${
                      pagination.page == pagination.totalPages
                        ? "disabled"
                        : null
                    }`}
                  >
                    <button className="page-link" onClick={handleNextPage}>
                      Next
                    </button>
                  </li>
                </ul> */}
                <div className="d-flex item-center justify-content-center gap-5 my-2">
                  <div
                    className={`btn btn-danger ${
                      pagination.page === 1 ? "disabled" : null
                    }`}
                    onClick={handlePreviousPage}
                  >
                    Prev
                  </div>
                  <div
                    className={`btn btn-danger ${
                      pagination.page == pagination.totalPages
                        ? "disabled"
                        : null
                    }`}
                    onClick={handleNextPage}
                  >
                    Next
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

export default StudentFeesList;
