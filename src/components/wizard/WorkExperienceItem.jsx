import { FaGripVertical, FaEdit, FaTrash, FaBriefcase } from 'react-icons/fa';
import { format } from 'date-fns';

const WorkExperienceItem = ({ experience, onEdit, onDelete, dragHandleProps }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      // Handle YYYY-MM format from month input
      const [year, month] = dateString.split('-');
      return format(new Date(year, month - 1), 'MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const dateRange = `${formatDate(experience.startDate)} - ${
    experience.isCurrent ? 'Present' : formatDate(experience.endDate)
  }`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition group">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 pt-1 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
        >
          <FaGripVertical size={20} />
        </div>

        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FaBriefcase className="text-blue-600" size={20} />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-gray-900 text-lg truncate">
            {experience.position}
          </h4>
          <p className="text-gray-700 font-medium truncate">{experience.company}</p>
          <p className="text-sm text-gray-500 mt-1">{dateRange}</p>
          {experience.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {experience.description}
            </p>
          )}
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

export default WorkExperienceItem;
