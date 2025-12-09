import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaTimes, FaSpinner, FaUser, FaImage, FaBriefcase, FaLink, FaCamera, FaTrash } from 'react-icons/fa';

const EditProfile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    avatarUrl: '',
  });
  const [workExperiences, setWorkExperiences] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfileData();

    // Warn before leaving if unsaved changes
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Fetching profile with token:', token.substring(0, 20) + '...');
      
      const response = await axios.get(
        `http://localhost:3000/api/v1/profiles/edit/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profile = response.data.profile;

      // Populate form data
      setFormData({
        fullName: profile.fullName || '',
        title: profile.title || '',
        phone: profile.phone || '',
        address: profile.address || '',
        email: profile.email || '',
        avatarUrl: profile.avatarUrl || '',
      });

      setWorkExperiences(profile.experiences || []);
      setSocialLinks(profile.socialLinks || []);

      setLoading(false);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Failed to load profile data');
      setLoading(false);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 404) {
        navigate('/dashboard');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ tên');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const profileData = {
        fullName: formData.fullName,
        title: formData.title || null,
        phone: formData.phone || null,
        address: formData.address || null,
        email: formData.email || null,
        avatarUrl: formData.avatarUrl || null,
        workExperiences: workExperiences.map((exp, index) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate || null,
          description: exp.description || null,
          displayOrder: index,
        })),
        socialLinks: socialLinks.map((link, index) => ({
          id: link.id,
          platform: link.platform,
          url: link.url,
          displayOrder: index,
        })),
      };

      await axios.put(
        `http://localhost:3000/api/v1/profiles/${profileId}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHasChanges(false);
      alert('Cập nhật thành công!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Cập nhật thất bại');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges && !window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?')) {
      return;
    }
    navigate('/dashboard');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddExperience = () => {
    setWorkExperiences(prev => [...prev, {
      id: `temp-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    }]);
    setHasChanges(true);
  };

  const handleUpdateExperience = (index, field, value) => {
    setWorkExperiences(prev => prev.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    ));
    setHasChanges(true);
  };

  const handleDeleteExperience = (index) => {
    setWorkExperiences(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleAddSocialLink = () => {
    setSocialLinks(prev => [...prev, {
      id: `temp-${Date.now()}`,
      platform: 'WEBSITE',
      url: '',
    }]);
    setHasChanges(true);
  };

  const handleUpdateSocialLink = (index, field, value) => {
    setSocialLinks(prev => prev.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    ));
    setHasChanges(true);
  };

  const handleDeleteSocialLink = (index) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Chỉ chấp nhận file JPG, JPEG hoặc PNG');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      console.log('Uploading avatar:', file.name, 'size:', file.size);

      const response = await axios.post(
        'http://localhost:3000/api/v1/profiles/upload-avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Avatar uploaded successfully:', response.data);

      const fullAvatarUrl = `http://localhost:3000${response.data.avatarUrl}`;
      handleInputChange('avatarUrl', fullAvatarUrl);
      setUploadingAvatar(false);
      alert('Upload ảnh thành công!');
    } catch (err) {
      console.error('Avatar upload error:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMsg = err.response?.data?.message || 'Upload ảnh thất bại. Vui lòng thử lại.';
      alert(errorMsg);
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    handleInputChange('avatarUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
              <p className="text-sm text-gray-600 mt-1">
                Cập nhật thông tin của bạn
                {hasChanges && (
                  <span className="text-orange-600 ml-2">(Có thay đổi chưa lưu)</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <FaTimes />
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Mục chỉnh sửa</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('personal')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                    activeSection === 'personal'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaUser />
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveSection('avatar')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                    activeSection === 'avatar'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaImage />
                  Ảnh đại diện
                </button>
                <button
                  onClick={() => setActiveSection('experience')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                    activeSection === 'experience'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaBriefcase />
                  Kinh nghiệm
                </button>
                <button
                  onClick={() => setActiveSection('social')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                    activeSection === 'social'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaLink />
                  Liên kết xã hội
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chức danh
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CEO, Developer, Designer..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hà Nội, Việt Nam"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Avatar Section */}
            {activeSection === 'avatar' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Ảnh đại diện</h2>
                <div className="space-y-6">
                  {/* Avatar Preview */}
                  <div className="flex flex-col items-center">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Avatar"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                        {formData.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Upload Buttons */}
                  <div className="flex flex-col items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {uploadingAvatar ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Đang tải lên...
                        </>
                      ) : (
                        <>
                          <FaCamera />
                          Chọn ảnh từ máy
                        </>
                      )}
                    </button>

                    {formData.avatarUrl && (
                      <button
                        onClick={handleRemoveAvatar}
                        disabled={uploadingAvatar}
                        className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                      >
                        <FaTrash />
                        Xóa ảnh
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Lưu ý:</strong> Chỉ chấp nhận file JPG, JPEG, PNG. Kích thước tối đa 5MB.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Work Experience Section */}
            {activeSection === 'experience' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Kinh nghiệm</h2>
                  <button
                    onClick={handleAddExperience}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    + Thêm
                  </button>
                </div>
                <div className="space-y-4">
                  {workExperiences.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có kinh nghiệm nào</p>
                  ) : (
                    workExperiences.map((exp, index) => (
                      <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Vị trí công việc"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Tên công ty"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            rows="3"
                            placeholder="Mô tả công việc..."
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteExperience(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Social Links Section */}
            {activeSection === 'social' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Liên kết xã hội</h2>
                  <button
                    onClick={handleAddSocialLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    + Thêm
                  </button>
                </div>
                <div className="space-y-4">
                  {socialLinks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có liên kết nào</p>
                  ) : (
                    socialLinks.map((link, index) => (
                      <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nền tảng</label>
                            <select
                              value={link.platform}
                              onChange={(e) => handleUpdateSocialLink(index, 'platform', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="FACEBOOK">Facebook</option>
                              <option value="INSTAGRAM">Instagram</option>
                              <option value="TWITTER">Twitter</option>
                              <option value="LINKEDIN">LinkedIn</option>
                              <option value="GITHUB">GitHub</option>
                              <option value="WEBSITE">Website</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => handleUpdateSocialLink(index, 'url', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSocialLink(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;