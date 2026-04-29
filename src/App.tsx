import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import ClientLayout from './layouts/ClientLayout'
import OwnerLayout from './layouts/OwnerLayout'

// Pages - Public
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

// Pages - Client
import ClientDashboard from './pages/client/ClientDashboard'
import ServicesPage from './pages/client/ServicesPage'
import BookAppointmentPage from './pages/client/BookAppointmentPage'
import ClientAppointmentsPage from './pages/client/ClientAppointmentsPage'

// Pages - Owner
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerAppointmentsPage from './pages/owner/OwnerAppointmentsPage'
import OwnerServicesPage from './pages/owner/OwnerServicesPage'
import OwnerSchedulePage from './pages/owner/OwnerSchedulePage'
import OwnerEarningsPage from './pages/owner/OwnerEarningsPage'

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode
  allowedRole: 'client' | 'owner' 
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'owner' ? '/owner' : '/client'} replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Client Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="book/:serviceId?" element={<BookAppointmentPage />} />
        <Route path="appointments" element={<ClientAppointmentsPage />} />
      </Route>

      {/* Owner Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="owner">
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="appointments" element={<OwnerAppointmentsPage />} />
        <Route path="services" element={<OwnerServicesPage />} />
        <Route path="schedule" element={<OwnerSchedulePage />} />
        <Route path="earnings" element={<OwnerEarningsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
