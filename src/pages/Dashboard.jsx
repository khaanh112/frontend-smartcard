import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, API_BASE_URL } from '../config/api';
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaExternalLinkAlt,
  FaQrcode,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaSignOutAlt,
  FaChartBar,
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/profiles/my-profiles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfiles(response.data.profiles);
      setLoading(false);
    } catch (err) {
      console.error('Fetch profiles error:', err);
      setError('Failed to load profiles');
      setLoading(false);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/profiles/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh profiles list
      fetchProfiles();
    } catch (err) {
      console.error('Delete profile error:', err);
      alert('Failed to delete profile');
    }
  };

  const handleViewProfile = (slug) => {
    window.open(`${window.location.origin}/${slug}`, '_blank');
  };

  // Filter profiles based on search and status
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'published' && profile.isPublished) ||
                         (filterStatus === 'draft' && !profile.isPublished);
    return matchesSearch && matchesStatus;
  });

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 h-64">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profiles</h1>
              <p className="text-sm text-gray-600 mt-1">
                You have {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard/create')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <FaPlus />
                Create New Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('published')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'published'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'draft'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {filteredProfiles.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📇</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No profiles found' : 'No profiles yet'}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first professional profile to get started'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => navigate('/create-profile')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <FaPlus />
                  Create Your First Profile
                </button>
              )}
            </div>
          </div>
        )}

        {/* Profiles Grid */}
        {filteredProfiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 overflow-hidden"
              >
                {/* Profile Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4 mb-4">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {profile.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {profile.fullName}
                      </h3>
                      {profile.title && (
                        <p className="text-sm text-gray-600 truncate">{profile.title}</p>
                      )}
                      <p className="text-xs text-gray-500 font-mono mt-1">/{profile.slug}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    {profile.isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        <FaCheckCircle className="text-xs" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        <FaClock className="text-xs" />
                        Draft
                      </span>
                    )}
                    {profile.theme && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                        {profile.theme.name}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">{profile.experienceCount || 0}</span> experiences
                    </div>
                    <div>
                      <span className="font-medium">{profile.socialLinkCount || 0}</span> links
                    </div>
                  </div>

                  {/* Created Date */}
                  <p className="text-xs text-gray-500">
                    Created {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => handleViewProfile(profile.slug)}
                      className="flex flex-col items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="View Profile"
                    >
                      <FaExternalLinkAlt className="text-lg" />
                      <span className="text-xs">View</span>
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/profiles/${profile.id}/edit`)}
                      className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                      title="Edit Profile"
                    >
                      <FaEdit className="text-lg" />
                      <span className="text-xs">Edit</span>
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/profiles/${profile.id}/analytics`)}
                      className="flex flex-col items-center gap-1 p-2 text-green-600 hover:bg-green-50 rounded transition"
                      title="Analytics"
                    >
                      <FaChartBar className="text-lg" />
                      <span className="text-xs">Analytics</span>
                    </button>
                    <button
                      onClick={() => window.open(`${API_URL}${profile.qrCodeUrl || '/uploads/qrcodes/' + profile.id + '.png'}`, '_blank')}
                      className="flex flex-col items-center gap-1 p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                      title="Download QR"
                      disabled={!profile.qrCodeUrl}
                    >
                      <FaQrcode className="text-lg" />
                      <span className="text-xs">QR</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="flex flex-col items-center gap-1 p-2 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete Profile"
                    >
                      <FaTrash className="text-lg" />
                      <span className="text-xs">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;