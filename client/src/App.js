import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Clubs from './pages/dashboard/Clubs';
import LostFound from './pages/dashboard/LostFound';
import StudyGroups from './pages/dashboard/StudyGroups';
import ExamTrends from './pages/dashboard/ExamTrends';
import DocReader from './pages/dashboard/DocReader';
import Activities from './pages/dashboard/Activities';
import SmartSell from './pages/dashboard/SmartSell';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/study-groups" element={<StudyGroups />} />
            <Route path="/exam-trends" element={<ExamTrends />} />
            <Route path="/doc-reader" element={<DocReader />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/smart-sell" element={<SmartSell />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 