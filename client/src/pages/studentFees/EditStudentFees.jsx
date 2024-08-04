import React, { useEffect, useState } from "react";
import Config from "../../config/Config";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import AddStudentFeesSchema from "../../validationSchemas/AddStudentFeesSchema";
import { useFormik } from "formik";
import { get } from "../../utils/api";

function EditStudentFees() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState({
    studentFees: "",
    student: "",
    batch: "",
  });

  //   get All Student Data
  // const getAllStudentData = async () => {
  //   try {
  //     const apiResponse = await fetch(`${Config.SERVER_URL}/students`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     const apiData = await apiResponse.json();

  //     if (apiData.status === 200) {
  //       setStudents(apiData.body);
  //       console.log("dff", apiData.body);
  //     } else {
  //       console.log(apiData.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // getStudentData
  const getStudentFeesData = async (id) => {
    try {
      const apiData = await get(`/studentFees/${id}`, true);
      console.log("apiData", apiData);

      if (apiData.status === 200) {
        let data = apiData.body;

        delete data.admin;
        delete data.createdAt;
        delete data.id;
        delete data.status;
        delete data.updatedAt;
        delete data._id;

        setValues(data);
      } else {
        console.log(apiData.messgae);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getAllStudentData();
  // }, []);

  useEffect(() => {
    getStudentFeesData(id);
  }, []);

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
    validationSchema: AddStudentFeesSchema,
    onSubmit: async (values, helper) => {
      setLoading(true);
      try {
        const apiResponse = await fetch(
          `${Config.SERVER_URL}/studentFees/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(values),
          }
        );

        const apiData = await apiResponse.json();

        if (apiData.status == 200) {
          // store token to localStorage variable
          navigation(-1);
        } else {
          helper.setErrors(apiData.errors);
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
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
                <div className="d-flex justify-content-between">
                  <h4 className="card-title">Edit Student Fees</h4>
                  <button
                    className="btn btn-info"
                    to={"/studentFees/edit"}
                    onClick={() => {
                      navigation(-1);
                    }}
                  >
                    Go Back
                  </button>
                </div>

                <div class="col-md-8 grid-margin stretch-card mx-auto">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Student Fees Details</h4>
                      {/* <p class="card-description">Basic form layout</p> */}
                      <form onSubmit={handleSubmit} class="forms-sample">
                        <div className="row">
                          <div class="form-group ">
                            <label for="studentFees">Student Fees</label>
                            <input
                              name="studentFees"
                              value={values.amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="number"
                              id="studentFees"
                              placeholder="Student Fees"
                            />
                            {errors.studentFees && touched.studentFees ? (
                              <p className="text-danger">
                                {" "}
                                {errors.studentFees}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div class="form-group">
                          <label for="student">Student</label>
                          <input
                            name="student"
                            className="form-control"
                            value={values.student}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            id="student"
                          >
                            {students && students.length > 0
                              ? students.map((value, index) => {
                                  return (
                                    <option key={value.id} value={value.id}>
                                      {`${value.firstName} ${value.lastName}`}
                                    </option>
                                  );
                                })
                              : null}
                          </input>

                          {errors.student && touched.student ? (
                            <p className="text-danger"> {errors.student} </p>
                          ) : null}
                        </div>

                        <div class="form-group">
                          <label for="batch">Batch</label>
                          <input
                            name="batch"
                            className="form-control form-select form-select-sm"
                            value={values.batch}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            id="batch"
                          />
                          {/* <option value="">Select Batch</option>
                            {batches && batches.length > 0
                              ? batches.map((value, index) => {
                                  return (
                                    <option key={value.id} value={value.id}>
                                      {value.batchName}
                                    </option>
                                  );
                                })
                              : null} */}

                          {errors.batch && touched.batch ? (
                            <p className="text-danger"> {errors.batch} </p>
                          ) : null}
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
                            "Update"
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

export default EditStudentFees;
