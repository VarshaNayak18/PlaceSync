import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>PlaceSync</h1>} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/register" element={<h1>Register</h1>} />
        <Route
          path="/student/dashboard"
          element={<h1>Student Dashboard</h1>}
        />
        <Route
          path="/admin/dashboard"
          element={<h1>Admin Dashboard</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;