import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import DefaultTheme from '../../themes/DefaultTheme';

const PublicProfile = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [slug]);

  useEffect(() => {
    if (profile?.id) {
      trackView();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/profiles/${slug}`
      );
      setProfile(response.data.profile);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err.response?.status === 404 ? 'Profile not found' : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      const referrer = document.referrer || 'direct';
      
      await axios.post('http://localhost:3000/api/v1/analytics/track-view', {
        profileId: profile.id,
        source: 'DIRECT',
        referrer,
      });
    } catch (err) {
      // Silently fail - don't break page if analytics fails
      console.error('Track view error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-5xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {error || 'Profile Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{`${profile.fullName}${profile.title ? ` - ${profile.title}` : ''} | Smart Card`}</title>
        <meta 
          name="description" 
          content={`${profile.fullName}${profile.title ? `, ${profile.title}` : ''}. View professional profile and connect.`}
        />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${profile.fullName}${profile.title ? ` - ${profile.title}` : ''}`} />
        <meta property="og:description" content={`${profile.fullName}'s professional profile`} />
        <meta property="og:image" content={profile.avatarUrl || 'https://via.placeholder.com/400'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="profile" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${profile.fullName}${profile.title ? ` - ${profile.title}` : ''}`} />
        <meta name="twitter:description" content={`${profile.fullName}'s professional profile`} />
        <meta name="twitter:image" content={profile.avatarUrl || 'https://via.placeholder.com/400'} />
        
        {/* Canonical */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Render Default Theme */}
      <DefaultTheme profile={profile} />
    </>
  );
};

export default PublicProfile;