import { BrowserRouter, Routes, Route } from "react-router-dom";
import RatePage from "./pages/RatePage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdmin from "./pages/SuperAdmin";
import SuperAdminLogin from "./pages/SuperAdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rate/:restaurantId" element={<RatePage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="*" element={<div className='min-h-screen flex items-center justify-center'>Page non trouvée</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
