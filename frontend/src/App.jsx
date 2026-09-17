import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentJobs from "./pages/StudentJobs";
import StudentApplications from "./pages/StudentApplications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>PlaceSync</h1>} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
  path="/student/profile"
  element={<StudentProfilePage />}
/>

<Route
  path="/student/jobs"
  element={
    <StudentJobs />
  }
/> 

<Route
  path="/student/applications"
  element={
    <StudentApplications />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;