import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import ViewListings from './pages/ViewListings.jsx';
import CreateListing from './pages/CreateListing.jsx';
import UpdateListing from './pages/UpdateListing.jsx';
import Reservations from './pages/Reservations.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/listings" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/listings" element={<ProtectedRoute><ViewListings /></ProtectedRoute>} />
          <Route path="/listings/new" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path="/listings/:id/edit" element={<ProtectedRoute><UpdateListing /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
