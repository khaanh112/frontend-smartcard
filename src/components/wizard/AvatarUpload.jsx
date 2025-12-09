import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FaCamera, FaTrash, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import useWizardStore from '../../store/wizardStore';
import { API_URL, API_BASE_URL } from '../../config/api';

const AvatarUpload = ({ onNext, onBack }) => {
  const { avatarUrl, setAvatarUrl } = useWizardStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const validateImage = async (file) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Only JPEG and PNG images are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 200 || img.height < 200) {
          reject(new Error('Image must be at least 200x200 pixels'));
        } else {
          resolve(true);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    setError('');
    
    try {
      await validateImage(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage({ file, preview: reader.result });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imageRef.current) return null;

    const canvas = document.createElement('canvas');
    const image = imageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }, [completedCrop]);

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError('');

      let fileToUpload = selectedImage.file;

      if (completedCrop) {
        const croppedBlob = await getCroppedImg();
        fileToUpload = new File([croppedBlob], selectedImage.file.name, {
          type: 'image/jpeg',
        });
      }

      const formData = new FormData();
      formData.append('avatar', fileToUpload);

      const token = localStorage.getItem('token');
      console.log('Token check:', token ? 'Token exists' : 'No token found');
      console.log('Token length:', token?.length);
      
      if (!token) {
        throw new Error('Please login first. Token not found in localStorage.');
      }

      const response = await axios.post(
        `${API_BASE_URL}/profiles/upload-avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );

      if (response.data.avatarUrl) {
        const fullAvatarUrl = `${API_URL}${response.data.avatarUrl}`;
        setAvatarUrl(fullAvatarUrl);
        setShowCropModal(false);
        setSelectedImage(null);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.status === 401) {
        setError('Please login again - your session has expired');
      } else {
        setError(err.message || err.response?.data?.message || 'Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove your avatar?')) {
      setAvatarUrl('');
    }
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    setSelectedImage(null);
    setCrop({ unit: '%', width: 100, aspect: 1 });
    setCompletedCrop(null);
  };

  return (
    <div className="w-full">
      {avatarUrl ? (
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition flex items-center justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-full text-blue-600 opacity-0 group-hover:opacity-100 transition mr-2"
                title="Change avatar"
              >
                <FaCamera size={16} />
              </button>
              <button
                onClick={handleRemove}
                className="p-2 bg-white rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition"
                title="Remove avatar"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Click to change</p>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <FaCamera className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-700 font-medium mb-1">Upload your profile photo</p>
          <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
          <p className="text-xs text-gray-400 mt-2">JPEG or PNG, max 5MB, min 200x200px</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!avatarUrl}
          className={`px-6 py-3 rounded-lg font-medium ${
            avatarUrl
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Preview
        </button>
      </div>

      {showCropModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Crop Your Photo</h3>
              <button onClick={handleCancelCrop} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={imageRef}
                  src={selectedImage.preview}
                  alt="Crop preview"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>

            {uploading && (
              <div className="px-4 pb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-center text-gray-600 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={handleCancelCrop}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
