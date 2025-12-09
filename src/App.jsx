import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProfileSuccess from './pages/ProfileSuccess';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateProfileWizard from './pages/CreateProfileWizard';
import EditProfile from './pages/EditProfile';
import ProfileAnalyticsPage from './pages/ProfileAnalytics';
import PublicProfile from './pages/public/PublicProfile';

// React Router v7 future flags
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

function HomePage() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎴 Smart QR Business Card Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Create your professional digital business card in minutes
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            {isLoggedIn ? 'Manage Your Profiles' : 'Create Your Profile'}
          </h2>
          <p className="text-blue-700 mb-4">
            {isLoggedIn 
              ? 'Access your dashboard to manage all your profiles'
              : 'Start creating your smart business card profile now!'
            }
          </p>
          <div className="flex gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Dashboard →
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started →
                </Link>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-white border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Features
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Create professional digital business cards in minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Beautiful themes to match your brand</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>QR code generation for easy sharing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>100% Free - No payment required</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router future={routerFutureConfig}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<CreateProfileWizard />} />
          <Route path="/dashboard/profiles/:profileId/edit" element={<EditProfile />} />
          <Route path="/dashboard/profiles/:profileId/analytics" element={<ProfileAnalyticsPage />} />
          <Route path="/profile-success" element={<ProfileSuccess />} />
          
          {/* Public Profile - Must be last as catch-all */}
          <Route path="/:slug" element={<PublicProfile />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
