import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_URL } from '../config/api';
import { 
  FaCheckCircle, 
  FaCopy, 
  FaExternalLinkAlt, 
  FaHome, 
  FaDownload,
  FaFilePdf,
  FaFileImage,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaQrcode
} from 'react-icons/fa';

const ProfileSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state || {};
  const [copied, setCopied] = useState(false);

  if (!profile) {
    navigate('/');
    return null;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profile.profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewProfile = () => {
    window.open(profile.profileUrl, '_blank');
  };

  const handleDownloadPNG = () => {
    // TODO: Implement card PNG generation in Epic 3
    alert('Card PNG download will be available in the next update!');
  };

  const handleDownloadPDF = () => {
    // TODO: Implement card PDF generation in Epic 3
    alert('Card PDF download will be available in the next update!');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(profile.profileUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(profile.profileUrl);
    const text = encodeURIComponent(`Check out my professional profile: ${profile.fullName}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(profile.profileUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out my profile: ${profile.fullName}`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to share my professional profile with you:\n\n${profile.profileUrl}\n\nBest regards,\n${profile.fullName}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile Created Successfully! 
          </h1>
          <p className="text-lg text-gray-600">
            Your professional profile is now live and ready to share
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Profile Info */}
          <div className="flex items-start gap-6 mb-6 pb-6 border-b">
            {profile.avatarUrl && (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.fullName}
              </h2>
              {profile.title && (
                <p className="text-lg text-gray-600 mb-2">{profile.title}</p>
              )}
              {profile.theme && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Theme: {profile.theme.name}
                </span>
              )}
            </div>
          </div>

          {/* Profile URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Profile URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={profile.profileUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaCopy />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          {profile.qrCodeUrl && (
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaQrcode className="text-blue-600 text-xl" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    QR Code
                  </h3>
                </div>
                <a
                  href={`${API_URL}${profile.qrCodeUrl}`}
                  download={`${profile.slug}-qrcode.png`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <FaDownload />
                  Download
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm">
                  <img
                    src={`${API_URL}${profile.qrCodeUrl}`}
                    alt="Profile QR Code"
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Scan this QR code to instantly access your profile on any smartphone
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>✓ High resolution (1000x1000px)</li>
                    <li>✓ Print ready with high error correction</li>
                    <li>✓ Perfect for business cards and marketing materials</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {profile.experiences?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Work Experiences</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {profile.socialLinks?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Social Links</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {profile.isPublished ? 'Live' : 'Draft'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>

          {/* Card Download Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              📇 Business Card Files
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Download your digital business card in multiple formats
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPNG}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition text-sm font-medium"
              >
                <FaFileImage />
                Download PNG
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-pink-300 text-pink-700 rounded-lg hover:bg-pink-50 transition text-sm font-medium"
              >
                <FaFilePdf />
                Download PDF
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Coming soon in Epic 3! 🚀
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleViewProfile}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium"
            >
              <FaExternalLinkAlt />
              View My Profile
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <FaHome />
              Dashboard
            </button>
          </div>

          {/* Social Share */}
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Share your profile
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleShareFacebook}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                title="Share on Facebook"
              >
                <FaFacebook className="text-xl" />
              </button>
              <button
                onClick={handleShareTwitter}
                className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                title="Share on Twitter"
              >
                <FaTwitter className="text-xl" />
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                title="Share on LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </button>
              <button
                onClick={handleShareEmail}
                className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                title="Share via Email"
              >
                <FaEnvelope className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What's Next?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 text-xl"></span>
              <div>
                <p className="font-medium text-gray-900">Share Your Profile</p>
                <p className="text-sm text-gray-600">
                  Copy and share your profile link on social media, email signatures, or business cards
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 text-xl"></span>
              <div>
                <p className="font-medium text-gray-900">Customize Your Design</p>
                <p className="text-sm text-gray-600">
                  You can update your profile theme and content anytime from your dashboard
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl"></span>
              <div>
                <p className="font-medium text-gray-900">Track Your Views</p>
                <p className="text-sm text-gray-600">
                  View analytics and insights about who's visiting your profile (coming soon)
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSuccess;
