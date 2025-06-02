// app/dashboard/page.js
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <h1>Your Dashboard</h1>
    </ProtectedRoute>
  );
}