import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ProfileAnalyticsComponent from '../components/analytics/ProfileAnalytics';

const ProfileAnalyticsPage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thống kê hồ sơ</h1>
              <p className="text-sm text-gray-600 mt-1">Xem số liệu truy cập và tương tác</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileAnalyticsComponent profileId={profileId} />
      </div>
    </div>
  );
};

export default ProfileAnalyticsPage;