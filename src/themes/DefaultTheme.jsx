import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGithub, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram,
  FaGlobe,
  FaBriefcase,
  FaCalendarAlt,
  FaDownload,
  FaQrcode,
  FaShareAlt,
  FaEnvelope
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import vCard from 'vcf';

const DefaultTheme = ({ profile }) => {
  const { fullName, title, phone, address, email, avatarUrl, experiences, socialLinks, qrCodeUrl, profileUrl } = profile;
  const [isVisible, setIsVisible] = useState(false);
  const experienceRefs = useRef([]);

  // Elegant white theme - sophisticated and mature
  const primaryColor = '#1E293B'; // Slate Gray (text)
  const secondaryColor = '#64748B'; // Slate (secondary text)
  const accentColor = '#0F172A'; // Dark Slate (headers)

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 245, g: 158, b: 11 };
  };

  const primaryRgb = hexToRgb(primaryColor);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    experienceRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const getPlatformIcon = (platform) => {
    const icons = {
      LINKEDIN: FaLinkedin,
      GITHUB: FaGithub,
      FACEBOOK: FaFacebook,
      TWITTER: FaTwitter,
      INSTAGRAM: FaInstagram,
      WEBSITE: FaGlobe,
    };
    return icons[platform] || FaGlobe;
  };

  const formatDate = (date) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDownloadVCard = () => {
    try {
      const card = new vCard();
      card.add('fn', fullName);
      const nameParts = fullName.split(' ');
      if (nameParts.length >= 2) {
        card.add('n', `${nameParts[nameParts.length - 1]};${nameParts.slice(0, -1).join(' ')}`);
      }
      if (title) card.add('title', title);
      if (phone) card.add('tel', phone, { type: ['work', 'voice'] });
      if (email) card.add('email', email, { type: 'work' });
      if (address) card.add('adr', `;;${address}`, { type: 'work' });
      if (profileUrl) card.add('url', profileUrl);
      if (socialLinks && socialLinks.length > 0) {
        socialLinks.forEach(link => {
          card.add('url', link.url, { type: link.platform.toLowerCase() });
        });
      }
      if (avatarUrl) {
        card.add('photo', avatarUrl, { type: 'uri' });
      }
      
      const vcfString = card.toString();
      const blob = new Blob([vcfString], { type: 'text/vcard;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fullName.replace(/\s+/g, '-')}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating vCard:', error);
      alert('Failed to generate contact card. Please try again.');
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(profileUrl);
    const text = encodeURIComponent(`Check out ${fullName}'s profile`);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      email: `mailto:?subject=${text}&body=Check%20out%20this%20profile:%20${url}`
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row items-start gap-8 mb-12 pb-12 border-b border-gray-200">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-48 h-48 rounded-full object-cover shadow-lg"
                loading="lazy"
              />
            ) : (
              <div 
                className="w-48 h-48 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #334155, #475569)'
                }}
              >
                {getInitials(fullName)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1" style={{ color: accentColor }}>{fullName}</h1>
            {title && (
              <p className="text-lg mb-4" style={{ color: secondaryColor }}>{title}</p>
            )}

            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:underline" style={{ color: primaryColor }}>
                  <FaPhone className="text-slate-400" />
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:underline" style={{ color: primaryColor }}>
                  <FaEnvelope className="text-slate-400" />
                  {email}
                </a>
              )}
              {address && (
                <span className="flex items-center gap-1.5" style={{ color: primaryColor }}>
                  <FaMapMarkerAlt className="text-slate-400" />
                  {address}
                </span>
              )}
            </div>

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {socialLinks.map((link, index) => {
                  const Icon = getPlatformIcon(link.platform);
                  const getPlatformStyle = (platform) => {
                    const styles = {
                      LINKEDIN: { bg: '#0077B5', hover: '#005582' },
                      FACEBOOK: { bg: '#1877F2', hover: '#0C63D4' },
                      TWITTER: { bg: '#1DA1F2', hover: '#0C85D0' },
                      INSTAGRAM: { bg: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)', hover: 'linear-gradient(45deg, #E1721B, #C91C6A, #6F2B9C)' },
                      GITHUB: { bg: '#181717', hover: '#000000' },
                      WEBSITE: { bg: '#64748B', hover: '#475569' },
                    };
                    return styles[platform] || { bg: '#64748B', hover: '#475569' };
                  };
                  
                  const platformStyle = getPlatformStyle(link.platform);
                  
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg font-medium text-white text-sm"
                      aria-label={link.platform}
                      style={{ background: platformStyle.bg }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = platformStyle.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = platformStyle.bg;
                      }}
                    >
                      <Icon className="text-lg" />
                      <span>{link.platform}</span>
                    </a>
                  );
                })}
              </div>
            )}

            <button 
              onClick={handleDownloadVCard}
              className="px-5 py-2 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg text-sm"
              style={{ background: 'linear-gradient(135deg, #334155, #475569)' }}
            >
              <FaDownload className="inline mr-2" />
              Tải vCard
            </button>
          </div>
        </section>

        {/* Work Experience */}
        {experiences && experiences.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-6" style={{ color: accentColor }}>Kinh nghiệm</h2>

            <div className="space-y-5">
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  ref={el => experienceRefs.current[index] = el}
                  className="opacity-0 p-6 border border-gray-200 rounded-xl hover:shadow-md transition bg-gray-50"
                >
                  <h3 className="text-lg font-bold mb-1" style={{ color: accentColor }}>{exp.position}</h3>
                  <p className="text-base font-medium mb-2" style={{ color: secondaryColor }}>{exp.company}</p>
                  <p className="flex items-center gap-1.5 text-xs mb-3" style={{ color: secondaryColor }}>
                    <FaCalendarAlt />
                    {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                  </p>
                  {exp.description && (
                    <p className="leading-relaxed whitespace-pre-line text-sm" style={{ color: primaryColor }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Share Section */}
        <section className="border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold mb-6" style={{ color: accentColor }}>Chia sẻ hồ sơ</h2>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleShare('linkedin')} 
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition text-white"
              style={{ backgroundColor: '#0077B5' }}
            >
              <FaLinkedin />
              LinkedIn
            </button>
            <button 
              onClick={() => handleShare('twitter')} 
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition text-white"
              style={{ backgroundColor: '#1DA1F2' }}
            >
              <FaTwitter />
              Twitter
            </button>
            <button 
              onClick={() => handleShare('facebook')} 
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition text-white"
              style={{ backgroundColor: '#1877F2' }}
            >
              <FaFacebook />
              Facebook
            </button>
            <button 
              onClick={() => handleShare('email')} 
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition text-white"
              style={{ backgroundColor: '#64748B' }}
            >
              <FaShareAlt />
              Email
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media print {
          aside {
            position: static !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DefaultTheme;
