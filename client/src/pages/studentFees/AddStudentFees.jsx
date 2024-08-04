import React, { useEffect, useState } from "react";
import AddStudentFeesSchema from "../../validationSchemas/AddStudentFeesSchema";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { get, post } from "../../utils/api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function AddStudentFees() {
  const { id } = useParams();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const [initialValues, setInitialValues] = useState({
    amount: "",
    student: "",
    batch: "",
  });

  const {
    values,
    setValues,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues,
    validationSchema: AddStudentFeesSchema,
    onSubmit: async (values, helper) => {
      console.log("values", values);
      setLoading(true);
      try {
        const apiData = await post("/studentFees", values, true);
        if (apiData.status == 200) {
          toast.success(apiData.message);
          // store token to localStorage variable
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

  //   get All Student Data
  const getStudentData = async (id) => {
    try {
      const apiData = await get(`/students/${id}`, true);
      console.log("apiData", apiData.body);
      if (apiData.status === 200) {
        setStudents(apiData.body);

        setValues({
          ...values,
          student: apiData.body.id,
          batch: apiData?.body?.batch?.id,
        });
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
                    onClick={() => {
                      navigation(-1);
                    }}
                    className="card-title nav-link"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span className="pl-1">Add Payment</span>
                  </Link>
                </div>

                <div class="col-md-8 grid-margin stretch-card mx-auto">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title"> Payment Details</h4>
                      {/* <p class="card-description">Basic form layout</p> */}
                      <form onSubmit={handleSubmit} class="forms-sample">
                        <div className="row">
                          <div class="form-group ">
                            <label for="amount">Payment Amount</label>
                            <input
                              name="amount"
                              value={values.amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="number"
                              class="form-control"
                              id="amount"
                              placeholder="Payment Amount"
                            />
                            {errors.amount && touched.amount ? (
                              <p className="text-danger"> {errors.amount}</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="row">
                          <div class="form-group col-md-6">
                            <label for="student">Student Name</label>
                            <input
                              readOnly
                              value={`${students?.firstName} ${students?.lastName}`}
                              name="student"
                              type="text"
                              class="form-control"
                              id="student"
                              placeholder="Student Name"
                            />
                          </div>

                          <div class="form-group ">
                            <label for="batch">Batch Name</label>
                            <input
                              readOnly
                              name="batch"
                              className="form-control form-select form-select-sm"
                              value={students?.batch?.batchName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              id="batch"
                              placeholder="Batch Name"
                            />
                          </div>
                        </div>

                        <button
                          disabled={loading ? true : false}
                          type="submit"
                          class="btn btn-primary me-2 mt-3"
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
                        <button class="btn btn-light mt-3" type="reset">
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

export default AddStudentFees;
