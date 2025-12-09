import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useWizardStore from '../../store/wizardStore';
import DefaultTheme from '../../themes/DefaultTheme';
import { FaEdit, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api';

const PreviewStep = ({ onBack }) => {
  const navigate = useNavigate();
  const {
    personalInfo,
    workExperiences,
    socialLinks,
    avatarUrl,
    setCurrentStep,
    resetWizard,
  } = useWizardStore();

  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if all required data is present
  const hasRequiredData = () => {
    return (
      personalInfo.fullName &&
      personalInfo.title &&
      personalInfo.email &&
      personalInfo.phone &&
      workExperiences.length > 0
    );
  };

  const canProceed = confirmed && hasRequiredData();

  // Create mock profile object for preview
  const previewProfile = {
    fullName: personalInfo.fullName || 'Your Name',
    title: personalInfo.title || 'Your Title',
    phone: personalInfo.phone || '+84 123 456 789',
    address: personalInfo.address || '',
    email: personalInfo.email || 'email@example.com',
    avatarUrl: avatarUrl || null,
    profileUrl: window.location.origin + '/preview',
    qrCodeUrl: null, // Will be generated after creation
    experiences: workExperiences.map((exp) => ({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate || null,
      description: exp.description || '',
    })),
    socialLinks: socialLinks.map((link) => ({
      platform: link.platform,
      url: link.url,
    })),
  };

  // Create profile
  const handleCreateProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const profileData = {
        fullName: personalInfo.fullName,
        title: personalInfo.title,
        phone: personalInfo.phone,
        address: personalInfo.address,
        email: personalInfo.email,
        avatarUrl,
        workExperiences: workExperiences.map((exp) => ({
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate || null,
          description: exp.description || '',
        })),
        socialLinks: socialLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
      };

      const response = await axios.post(
        `${API_BASE_URL}/profiles`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear draft after successful creation
      resetWizard();

      // Navigate to success page with profile data
      navigate('/profile-success', {
        state: { profile: response.data.profile },
      });
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(
        err.response?.data?.message || 'Failed to create profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Preview Your Professional Profile
        </h2>
        <p className="text-gray-600">
          This is how your profile will appear when others visit your link. Optimized for mobile QR scanning.
        </p>
      </div>

      {/* Warning if data missing */}
      {!hasRequiredData() && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-600 mt-1" />
            <div>
              <p className="font-medium text-yellow-800">Incomplete Information</p>
              <p className="text-sm text-yellow-700">
                Some required fields are missing. Please complete all previous steps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview using DefaultTheme */}
      <div className="mb-6 bg-white rounded-lg shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3">
          <h3 className="font-semibold">Live Preview - Professional Theme</h3>
          <p className="text-sm text-blue-100">This is exactly how your profile will look</p>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          <DefaultTheme profile={previewProfile} />
        </div>
      </div>

      {/* Edit Navigation */}
      <div className="mb-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Need to make changes?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <FaEdit className="text-blue-600" /> 
            <span className="font-medium">Personal Info</span>
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <FaEdit className="text-blue-600" /> 
            <span className="font-medium">Work Experience</span>
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <FaEdit className="text-blue-600" /> 
            <span className="font-medium">Social Links</span>
          </button>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 p-5 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            disabled={!hasRequiredData()}
          />
          <div>
            <p className="font-semibold text-gray-900 mb-1">
               I confirm that all information is correct
            </p>
            <p className="text-sm text-gray-600">
              Please review your profile carefully. You can edit it later from your dashboard.
            </p>
          </div>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t-2">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
        >
           Back
        </button>
        
        <button
          onClick={handleCreateProfile}
          disabled={!canProceed || loading}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-lg transition transform ${
            canProceed && !loading
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Profile...
            </>
          ) : (
            <>
              <FaCheckCircle />
              Create My Profile
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PreviewStep;
