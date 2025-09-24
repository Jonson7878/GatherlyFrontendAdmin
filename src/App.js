import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import { CompanyProvider } from "./components/CompanyContext";
import Home from './pages/Home'
import Login from "./pages/Login";
import ResetLink from './pages/ResetLink';
import ResetPassword from './pages/ResetPassword';
import Dashboard from "./pages/Dashboard";
import CompanyTable from "./pages/tables/CompanyTable";
import UserTable from "./pages/tables/UserTable";
import EventTable from "./pages/tables/EventTable";
import OrderTable from "./pages/tables/OrderTable"
import EventDetails from "./pages/tables/EventDetail";
import Authenticator from "./pages/Authenticator";

function App() {
  return (
    <Router>
      <UserProvider>
        <CompanyProvider>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/authenticator" element={<Authenticator />} />
          <Route path="/resetlink" element={<ResetLink />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <Navigate
                to={`/${localStorage.getItem('lastDashboardView') || 'company'}/dashboard`}
                replace
              />
            }
          />
          <Route path="/:view/dashboard" element={<Dashboard />} />
          <Route path="/company-table" element={<CompanyTable />} />
          <Route path="/user-table" element={<UserTable />} />
          <Route path="/event-table" element={<EventTable />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/order-table" element={<OrderTable />} />
          </Routes>
        </CompanyProvider>
      </UserProvider>
    </Router>
  );
}

export default App;