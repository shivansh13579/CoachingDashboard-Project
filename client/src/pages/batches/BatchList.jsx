import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import Config from "../../config/Config";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert"; // Import
import { get } from "../../utils/api";
import { toast } from "react-toastify";

export default function BatchList() {
  const [batches, setBatches] = useState([]);
  const [isDeleted, setIsDeleted] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 10,
    totalRecords: 10,
  });

  // getAllData
  const getAllData = async () => {
    try {
      const apiData = await get(
        `/batches?page=${pagination.page}&limit=5`,
        true
      );
      console.log("apiData", apiData);
      if (apiData.status === 200) {
        setBatches(apiData.body);
        setPagination({
          page: parseInt(apiData.page),
          totalPages: apiData.totalPages,
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
    getAllData();
  }, [isDeleted, pagination.page]);

  useEffect(() => {
    const batches = JSON.parse(localStorage.getItem("batches"));
    if (batches && batches.length > 0) {
      setBatches(batches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("batches", JSON.stringify(batches));
  }, [batches]);

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
                `${Config.SERVER_URL}/batches/${id}`,
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
                toast.success(apiData.message);
              } else {
                toast.error(apiData.messgae);
              }
            } catch (error) {
              toast.error(error.messgae);
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
      setPagination((old) => ({
        ...old,
        page: old.page + 1,
      }));
    }
  }

  // handlePreviousPage
  function handlePreviousPage() {
    if (pagination.page > 1) {
      setPagination((prevPage) => ({ ...prevPage, page: prevPage.page - 1 }));
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
                  <p className="card-title mt-1">Batch List</p>

                  <Link to={"/batches/add"} className="card-title nav-link">
                    <i className="fa-solid fa-plus"></i>
                    <span>Add Batch</span>
                  </Link>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Batch Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Student Limit</th>
                        <th>Fee</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches && batches.length > 0
                        ? batches.map((value, index) => {
                            return (
                              <tr key={value.id}>
                                <td>{index + 1}</td>
                                <td>{value.batchName}</td>
                                <td>
                                  {moment(value.batchStartDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>
                                  {moment(value.batchEndingTime).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>
                                  {moment(value.batchStartTime, "h:mm").format(
                                    "hh:mm a"
                                  )}
                                </td>
                                <td>
                                  {moment(value.batchEndingTime, "h:mm").format(
                                    "hh:mm a"
                                  )}
                                </td>
                                <td>{value.studentLimit}</td>
                                <td>Rs {value.batchFee}</td>
                                <td className="d-flex gap-1">
                                  <Link
                                    to={`/batches/edit/${value.id}`}
                                    className="btn btn-info p-2 text-light"
                                  >
                                    <i class="fa-solid fa-pen-to-square"></i>
                                  </Link>
                                  <button
                                    className="btn btn-danger p-2 text-light"
                                    onClick={() => {
                                      handleDelete(value.id);
                                    }}
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

                <div className="d-flex justify-content-center gap-5 mt-3">
                  <div
                    className={`${pagination.page == 1 ? "disabled" : null}`}
                  >
                    <button
                      onClick={handlePreviousPage}
                      className="btn btn-danger"
                    >
                      Prev
                    </button>
                  </div>
                  <div
                    className={`${
                      pagination.page == pagination.totalPages
                        ? "disabled"
                        : null
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
      </div>
    </Layout>
  );
}
