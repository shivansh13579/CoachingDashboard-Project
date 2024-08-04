import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import Config from "../../config/Config";
import { useFormik } from "formik";
import AddBatchSchema from "../../validationSchemas/AddBatchSchema";
import moment from "moment";
import { toast } from "react-toastify";

function EditBatch() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  let { id } = useParams();

  const [initialValues, setInitialValues] = useState({
    batchName: "",
    studentLimit: "",
    batchFee: "",
    batchStartDate: "",
    batchEndingDate: "",
    batchStartTime: "",
    batchEndingTime: "",
    description: "",
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: AddBatchSchema,
    onSubmit: async (values, helper) => {
      setLoading(true);
      try {
        const apiResponse = await fetch(`${Config.SERVER_URL}/batches/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        });

        const apiData = await apiResponse.json();

        if (apiData.status == 200) {
          // store token to localStorage variable
          navigation(-1);
        } else {
          helper.setErrors(apiData.errors);
        }

        setLoading(false);
      } catch (error) {
        toast.error(api.messgae);
        setLoading(false);
      }
    },
  });

  // getBatchData
  const getBatchData = async (id) => {
    try {
      const apiResponse = await fetch(`${Config.SERVER_URL}/batches/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const apiData = await apiResponse.json();
      if (apiData.status === 200) {
        let data = apiData.body;

        delete data.admin;
        delete data.createdAt;
        delete data.id;
        delete data.status;
        delete data.updatedAt;
        delete data._id;

        data.batchStartDate = moment(data.batchStartDate).format("YYYY-MM-DD");
        data.batchEndingDate = moment(data.batchEndingDate).format(
          "YYYY-MM-DD"
        );

        setValues(data);
      } else {
        toast.error(apiData.messgae);
      }
    } catch (error) {
      toast.error(error.messgae);
    }
  };

  useEffect(() => {
    getBatchData(id);
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
                    <span className="pl-1">Edit Batch</span>
                  </Link>
                </div>

                <div class="col-md-8 grid-margin stretch-card mx-auto">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Batch Details</h4>
                      {/* <p class="card-description">Basic form layout</p> */}
                      <form onSubmit={handleSubmit} class="forms-sample">
                        <div class="form-group">
                          <label for="batchName">Batch Name</label>
                          <input
                            name="batchName"
                            value={values.batchName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            class="form-control"
                            id="batchName"
                            placeholder="Batch Name"
                          />
                          {errors.batchName && touched.batchName ? (
                            <p className="text-danger"> {errors.batchName} </p>
                          ) : null}
                        </div>
                        <div class="form-group">
                          <label for="description">Description</label>
                          <input
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            class="form-control"
                            id="description"
                            placeholder="Description"
                          />
                          {errors.description && touched.description ? (
                            <p className="text-danger">{errors.description}</p>
                          ) : null}
                        </div>

                        <div class="form-group">
                          <label for="studentLimit">Student Limit</label>
                          <input
                            value={values.studentLimit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            class="form-control"
                            id="studentLimit"
                            placeholder="Student Limit"
                          />
                          {errors.studentLimit && touched.studentLimit ? (
                            <p className="text-danger">{errors.studentLimit}</p>
                          ) : null}
                        </div>

                        <div className="row">
                          <div class="form-group col-md-6">
                            <label for="batchStartDate">Batch Start Date</label>
                            <input
                              value={values.batchStartDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="date"
                              class="form-control"
                              id="batchStartDate"
                            />
                            {errors.batchStartDate && touched.batchStartDate ? (
                              <p className="text-danger">
                                {errors.batchStartDate}
                              </p>
                            ) : null}
                          </div>

                          <div class="form-group col-md-6">
                            <label for="batchEndingDate">Batch End Date</label>
                            <input
                              value={values.batchEndingDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="date"
                              class="form-control"
                              id="batchEndingDate"
                            />
                            {errors.batchEndingDate &&
                            touched.batchEndingDate ? (
                              <p className="text-danger">
                                {errors.batchEndingDate}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="row">
                          <div class="form-group col-md-6">
                            <label for="batchStartTime">Batch Start Time</label>
                            <input
                              value={values.batchStartTime}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="time"
                              class="form-control"
                              id="batchStartTime"
                            />
                            {errors.batchStartTime && touched.batchStartTime ? (
                              <p className="text-danger">
                                {errors.batchStartTime}
                              </p>
                            ) : null}
                          </div>

                          <div class="form-group col-md-6">
                            <label for="batchEndingTime">Batch End Time</label>
                            <input
                              value={values.batchEndingTime}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="time"
                              class="form-control"
                              id="batchEndingTime"
                            />
                            {errors.batchEndingTime &&
                            touched.batchEndingTime ? (
                              <p className="text-danger">
                                {errors.batchEndingTime}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div class="form-group">
                          <label for="batchFee">Batch Fees</label>
                          <input
                            value={values.batchFee}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            class="form-control"
                            id="batchFee"
                            placeholder="Batch Fees"
                          />
                          {errors.batchFee && touched.batchFee ? (
                            <p className="text-danger"> {errors.batchFee} </p>
                          ) : null}
                        </div>

                        <button
                          disabled={loading ? true : false}
                          type="submit"
                          class="btn btn-primary me-2 text-light"
                        >
                          {loading ? (
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="sr-only"></span>
                            </div>
                          ) : (
                            "Update"
                          )}
                        </button>
                        <button class="btn btn-light" type="reset">
                          Cancel
                        </button>
                      </form>
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

export default EditBatch;
