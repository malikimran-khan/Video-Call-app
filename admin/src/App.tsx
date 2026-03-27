import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Broadcast from "./pages/Broadcast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/broadcast" element={<Broadcast />} />
          <Route path="/settings" element={<Settings />} />
          {/* Add more admin routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
