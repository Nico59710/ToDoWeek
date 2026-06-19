import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import TasksPage from './pages/Task';
import PlanningPage from './pages/Planning';
import MembersPage from './pages/Membres';
import DashboardPage from './pages/Dashboard';
import RewardsPage from './pages/Rewards';
import SettingsPage from './pages/Settings';
import Navbar from './components/Navbar/Index';
import { AuthProvider } from "./Contexte/AuthProvider";

function App() {


  return (
    <AuthProvider>
      <Router >
        <div style={{ display: "flex" }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/planning" element={<PlanningPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </Router >
    </AuthProvider>
  );
}

export default App;
