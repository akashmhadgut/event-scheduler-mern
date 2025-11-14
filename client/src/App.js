import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventsListPage from "./pages/EventsListPage";
 import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import EventDetails from "./pages/EventDetails";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventsListPage />} />
<Route path="/events/:id" element={<EventDetails />} />
           <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <ToastContainer position="top-right" theme="light" autoClose={1000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
