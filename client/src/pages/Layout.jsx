import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

function Layout({ children }) {
  return (
    <>
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            {children}
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
