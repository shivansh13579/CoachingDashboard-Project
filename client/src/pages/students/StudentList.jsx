import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import Config from "../../config/Config";
import { confirmAlert } from "react-confirm-alert";
import { get } from "../../utils/api";
import { toast } from "react-toastify";
import moment from "moment";

function StudentList() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentPayment, setStudentPayment] = useState([]);
  const [isDeleted, setIsDeleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [toggleFilterSection, setToggleFilterSection] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 10,
    totalRecords: 10,
  });

  // getAllBaches
  const getAllBaches = async () => {
    try {
      const apiData = await get(`/batches?limit=100`, true);

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

  // get AllStudent List
  const getAllStudents = async () => {
    try {
      let url = `/students?page=${pagination.page}&limit=10&searchQuery=${searchQuery}`;
      if (selectedBatch) url += `&batch=${selectedBatch}`;
      const apiData = await get(url, true);

      if (apiData.status == 200) {
        setStudents(apiData.body);
        console.log("apiData", apiData.body);
        setPagination({
          page: apiData.page,
          totalPages: apiData.totalPage,
          totalRecords: apiData.totalRecords,
        });
      } else {
        toast.error(apiData.messgae);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, [isDeleted, pagination.page, searchQuery, selectedBatch]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem("students"));
    if (students && students.length > 0) {
      setStudents(students);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // handleDelete
  async function handleDelete(id) {
    confirmAlert({
      title: `Delete`,
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const apiResponse = await fetch(
                `${Config.SERVER_URL}/students/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              const apiData = await apiResponse.json();

              if (apiData.status === 200) {
                setIsDeleted(!isDeleted);
              } else {
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  // handleNextPage
  function handleNextPage() {
    if (pagination.page < pagination.totalPages) {
      setPagination((old) => ({ ...old, page: old.page + 1 }));
    }
  }

  // handlePreviousPage
  function handlePreviousPage() {
    if (pagination.page > 1) {
      setPagination((prevPage) => ({ ...prevPage, page: prevPage.page - 1 }));
    }
  }

  // handleToggleFilterContent
  function handleToggleFilterContent() {
    setToggleFilterSection(!toggleFilterSection);
  }

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <p className="card-title mt-1">Student List</p>
                  <div className="d-flex gap-2">
                    <Link to={"/students/add"} className="card-title nav-link">
                      <i className="fa-solid fa-plus"></i>
                      <span className="pl-1"> Add Student</span>
                    </Link>

                    <div className="pt-1">
                      <button
                        className="btn p-1"
                        onClick={handleToggleFilterContent}
                      >
                        <i
                          className={`fa-solid ${
                            toggleFilterSection
                              ? "fa-filter-circle-xmark"
                              : "fa-filter"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Filter Section */}
                {toggleFilterSection && (
                  <div className="row">
                    <div className="form-group col-md-3">
                      <input
                        type="search"
                        name="serrchQuery"
                        placeholder="Search here..."
                        className="form-control custom-form-control"
                        onChange={(evt) => {
                          setSearchQuery(evt.target.value);
                        }}
                        value={searchQuery}
                      />
                    </div>

                    <div className="form-group col-md-2">
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

                    <div className="form-group col-md-2">
                      <select
                        className="form-control custom-form-control"
                        // onChange={(evt) => {
                        //   setSelectedBatch(evt.target.value);
                        // }}
                        // value={selectedBatch}
                      >
                        <option value="">Select Student</option>
                        <option value="">All Student</option>
                        <option value="">Fee Paid Student</option>
                        <option value="">Without Paid Student</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Student Name</th>
                        <th>Father Name</th>
                        <th>Batch</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students && students.length > 0
                        ? students.map((value, index) => {
                            return (
                              <tr key={value.id} value={value.id}>
                                <td>{index + 1}</td>
                                <td>
                                  {value.firstName} {value.lastName}
                                </td>
                                <td>{value.fatherName}</td>

                                <td>{value.batch.batchName}</td>
                                <td>
                                  {moment(value.createdAt).format("DD-MM-YYYY")}
                                </td>
                                <td className="d-flex gap-1">
                                  {/* edit */}
                                  <Link
                                    to={`/students/edit/${value.id}`}
                                    className="btn btn-info p-2 text-light"
                                  >
                                    <i class="fa-solid fa-pen-to-square"></i>
                                  </Link>
                                  {/* view */}
                                  <Link
                                    to={`/students/view/${value.id}`}
                                    className="btn btn-warning p-2 text-light"
                                  >
                                    <i class="fa-solid fa-eye"></i>
                                  </Link>

                                  {/* Payment */}
                                  <Link
                                    to={`/students/payment/${value.id}`}
                                    className="btn btn-primary p-2 text-light"
                                  >
                                    <i class="fa-solid fa-indian-rupee-sign"></i>
                                  </Link>
                                  {/* delete */}
                                  <button
                                    onClick={() => handleDelete(value.id)}
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
              </div>
              {/* Pagination */}
              <div className="d-flex justify-content-center gap-5 my-3">
                <div className={`${pagination.page == 1 ? "disabled" : null}`}>
                  <button
                    onClick={handlePreviousPage}
                    className="btn btn-danger"
                  >
                    Prev
                  </button>
                </div>
                <div
                  className={`${
                    pagination.page == pagination.totalPages ? "disabled" : null
                  }`}
                >
                  <button onClick={handleNextPage} className="btn btn-danger">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StudentList;
