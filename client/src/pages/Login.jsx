import React, { useEffect, useState } from "react";
import Config from "../config/Config";
import { useFormik } from "formik";
import { loginSchema } from "../validationSchemas/LoginSchema";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  });

  const { values, errors, touched, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, helper) => {
        setLoading(true);
        try {
          const apiResponse = await fetch(`${Config.SERVER_URL}/admins/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          const apiData = await apiResponse.json();

          if (apiData.status === 200) {
            // store token to localStorage variable
            localStorage.setItem("token", apiData.token);
            navigation("/");
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
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src="../../images/logo.svg" alt="logo" />
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>

                {/* {errors && (
                  <div className="alert alert-danger">
                    Login failed. Please try again.
                  </div>
                )} */}
                <form onSubmit={handleSubmit} className="pt-3">
                  <div className="form-group">
                    <input
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="email"
                      className="form-control form-control-lg"
                      id="exampleInputEmail1"
                      placeholder="Email"
                    />
                    {errors.email && touched.email ? (
                      <p className="text-danger"> {errors.email} </p>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <input
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="password"
                      className="form-control form-control-lg"
                      id="exampleInputPassword1"
                      placeholder="Password"
                    />
                    {errors.password && touched.password ? (
                      <p className="text-danger"> {errors.password} </p>
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <button
                      disabled={loading ? true : false}
                      type="submit"
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn text-light"
                      style={{ width: "150px" }}
                    >
                      {loading ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="sr-only"></span>
                        </div>
                      ) : (
                        "LOGIN"
                      )}
                    </button>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />
                        Keep me signed in
                      </label>
                    </div>
                    <a href="#" className="auth-link text-black">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- content-wrapper ends --> */}
      </div>
      {/* <!-- page-body-wrapper ends --> */}
    </div>
  );
}

export default Login;
