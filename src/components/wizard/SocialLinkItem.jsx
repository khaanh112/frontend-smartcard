import { FaGripVertical, FaEdit, FaTrash, FaLinkedin, FaFacebook, FaInstagram, FaTwitter, FaGithub, FaGlobe, FaEnvelope, FaLink } from 'react-icons/fa';

const PLATFORM_CONFIG = {
  LINKEDIN: { icon: FaLinkedin, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'LinkedIn' },
  FACEBOOK: { icon: FaFacebook, color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Facebook' },
  INSTAGRAM: { icon: FaInstagram, color: 'text-pink-600', bgColor: 'bg-pink-100', label: 'Instagram' },
  TWITTER: { icon: FaTwitter, color: 'text-blue-400', bgColor: 'bg-blue-100', label: 'Twitter' },
  GITHUB: { icon: FaGithub, color: 'text-gray-800', bgColor: 'bg-gray-100', label: 'GitHub' },
  WEBSITE: { icon: FaGlobe, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Website' },
  EMAIL: { icon: FaEnvelope, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Email' },
  OTHER: { icon: FaLink, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Other' },
};

const SocialLinkItem = ({ link, onEdit, onDelete, dragHandleProps }) => {
  const config = PLATFORM_CONFIG[link.platform] || PLATFORM_CONFIG.OTHER;
  const Icon = config.icon;

  const truncateUrl = (url) => {
    if (url.length <= 50) return url;
    return url.substring(0, 47) + '...';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition group">
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
        >
          <FaGripVertical size={20} />
        </div>

        {/* Platform Icon */}
        <div className={`flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={config.color} size={20} />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-gray-900">{config.label}</h4>
          <a
            href={link.platform === 'EMAIL' ? `mailto:${link.url}` : link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline truncate block"
            title={link.url}
          >
            {truncateUrl(link.url)}
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLinkItem;