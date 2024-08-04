import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddStudentSchema from "../../validationSchemas/AddStudentSchema";
import { useFormik } from "formik";
import Layout from "../Layout";
import { toast } from "react-toastify";
import { get, post } from "../../utils/api";

function AddStudent() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [batch, setBatch] = useState([]);

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    mobile: "",
    parentMobile: "",
    batch: "",
  });

  // getAllBatchData
  const getAllBatchData = async () => {
    try {
      const apiData = await get(`/batches?limit=100`, true);

      if (apiData.status === 200) {
        setBatch(apiData.body);
      } else {
        toast.error(apiData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllBatchData();
  }, []);

  const { values, errors, touched, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues,
      validationSchema: AddStudentSchema,
      onSubmit: async (values, helper) => {
        setLoading(true);

        try {
          const apiData = await post("/students", values, true);

          if (apiData.status == 200) {
            toast.success(apiData.message);
            navigation(-1);
          } else {
            helper.setErrors(apiData.errors);
            toast.error(apiData.message);
          }

          setLoading(false);
        } catch (error) {
          toast.error(error.message);
          setLoading(false);
        }
      },
    });

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
                    <span className="pl-1">Add Student</span>
                  </Link>
                </div>

                <div class="col-md-8 grid-margin stretch-card mx-auto">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Student Details</h4>
                      {/* <p class="card-description">Basic form layout</p> */}
                      <form onSubmit={handleSubmit} class="forms-sample">
                        <div className="row">
                          <div class="form-group col-md-6">
                            <label for="firstName">First Name</label>
                            <input
                              name="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              class="form-control"
                              id="firstName"
                              placeholder="First Name"
                            />
                            {errors.firstName && touched.firstName ? (
                              <p className="text-danger">
                                {" "}
                                {errors.firstName}{" "}
                              </p>
                            ) : null}
                          </div>
                          <div class="form-group col-md-6">
                            <label for="lastName">Last Name</label>
                            <input
                              name="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              class="form-control"
                              id="lastName"
                              placeholder="Last Name"
                            />
                            {errors.lastName && touched.lastName ? (
                              <p className="text-danger">{errors.lastName}</p>
                            ) : null}
                          </div>
                        </div>
                        <div class="form-group">
                          <label for="fatherName">Father Name</label>
                          <input
                            name="fatherName"
                            value={values.fatherName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            class="form-control"
                            id="fatherName"
                            placeholder="Father Name"
                          />
                          {errors.fatherName && touched.fatherName ? (
                            <p className="text-danger">{errors.fatherName}</p>
                          ) : null}
                        </div>
                        <div className="row">
                          <div class="form-group col-md-6">
                            <label for="mobile">Mobile</label>
                            <input
                              name="mobile"
                              value={values.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="number"
                              class="form-control"
                              id="mobile"
                              placeholder="Mobile"
                            />
                            {errors.mobile && touched.mobile ? (
                              <p className="text-danger">{errors.mobile}</p>
                            ) : null}
                          </div>

                          <div class="form-group col-md-6">
                            <label for="parentMobile">Parent Mobile</label>
                            <input
                              name="parentMobile"
                              value={values.parentMobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="number"
                              class="form-control"
                              id="parentMobile"
                              placeholder="parentMobile"
                            />
                            {errors.parentMobile && touched.parentMobile ? (
                              <p className="text-danger">
                                {errors.parentMobile}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div class="form-group">
                          <label for="batch">Batch</label>
                          <select
                            name="batch"
                            class="form-control form-select form-select-sm"
                            value={values.batch}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id="batch"
                          >
                            <option value="">Select Batch</option>
                            {batch && batch.length > 0
                              ? batch.map((value) => {
                                  return (
                                    <option value={value._id}>
                                      {value.batchName}
                                    </option>
                                  );
                                })
                              : null}
                          </select>

                          {errors.batch && touched.batch ? (
                            <p className="text-danger"> {errors.batch} </p>
                          ) : null}
                        </div>
                        <button
                          disabled={loading ? true : false}
                          type="submit"
                          class="btn btn-primary me-2"
                        >
                          {loading ? (
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="sr-only"></span>
                            </div>
                          ) : (
                            "Submit"
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

export default AddStudent;
