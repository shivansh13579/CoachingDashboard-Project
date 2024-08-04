import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BatchList from "./pages/batches/BatchList";
import AddBatch from "./pages/batches/AddBatch";
import EditBatch from "./pages/batches/EditBatch";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import StudentList from "./pages/students/StudentList";
import AddStudent from "./pages/students/AddStudent";
import EditStudent from "./pages/students/EditStudent";
import StudentFeesList from "./pages/studentFees/StudentFeesList";
import AddStudentFees from "./pages/studentFees/AddStudentFees";
import EditStudentFees from "./pages/studentFees/EditStudentFees";
import ViewStudent from "./pages/students/ViewStudent";
import StudentFee from "./pages/students/StudentFee";
import ViewStudentsFees from "./pages/studentFees/ViewStudentsFees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Batch */}
        <Route path="/batches" element={<BatchList />} />
        <Route path="/batches/add" element={<AddBatch />} />
        <Route path="/batches/edit/:id" element={<EditBatch />} />

        {/* student */}
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route path="/students/edit/:id" element={<EditStudent />} />
        <Route path="/students/view/:id" element={<ViewStudent />} />
        <Route path="/students/payment/:id" element={<StudentFee />} />

        {/* Student Fees */}
        <Route path="/studentFees" element={<StudentFeesList />} />
        <Route path="/studentFees/add" element={<AddStudentFees />} />
        <Route path="/studentFees/edit/:id" element={<EditStudentFees />} />
        <Route path="/studentFees/view/:id" element={<ViewStudentsFees />} />

        {/* login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
