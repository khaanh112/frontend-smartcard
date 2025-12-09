import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { socialLinkSchema } from '../../utils/validationSchemas';
import useWizardStore from '../../store/wizardStore';
import { FaPlus, FaEdit, FaTrash, FaGripVertical } from 'react-icons/fa';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaGithub, FaYoutube, FaTiktok, FaGlobe, FaEnvelope, FaPhone } from 'react-icons/fa';
import { SiZalo, SiTelegram } from 'react-icons/si';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { value: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700' },
  { value: 'twitter', label: 'Twitter', icon: FaTwitter, color: 'text-blue-400' },
  { value: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'text-pink-600' },
  { value: 'github', label: 'GitHub', icon: FaGithub, color: 'text-gray-800' },
  { value: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
  { value: 'tiktok', label: 'TikTok', icon: FaTiktok, color: 'text-gray-800' },
  { value: 'website', label: 'Website', icon: FaGlobe, color: 'text-green-600' },
  { value: 'email', label: 'Email', icon: FaEnvelope, color: 'text-gray-600' },
  { value: 'phone', label: 'Phone', icon: FaPhone, color: 'text-gray-600' },
  { value: 'zalo', label: 'Zalo', icon: SiZalo, color: 'text-blue-500' },
  { value: 'telegram', label: 'Telegram', icon: SiTelegram, color: 'text-blue-400' }
];

const SortableSocialItem = ({ link, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const platform = PLATFORMS.find((p) => p.value === link.platform);
  const Icon = platform?.icon || FaGlobe;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3"
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <FaGripVertical />
        </div>

        {/* Icon */}
        <div className={`text-2xl ${platform?.color}`}>
          <Icon />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{platform?.label || link.platform}</h4>
          <p className="text-sm text-gray-600 truncate">{link.url}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(index)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

const SocialLinkModal = ({ isOpen, onClose, onSave, initialData = null, existingPlatforms = [] }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(socialLinkSchema),
    defaultValues: initialData || {
      platform: '',
      url: ''
    }
  });

  const selectedPlatform = watch('platform');

  const getPlaceholder = () => {
    switch (selectedPlatform) {
      case 'facebook':
        return 'https://facebook.com/yourprofile';
      case 'linkedin':
        return 'https://linkedin.com/in/yourprofile';
      case 'twitter':
        return 'https://twitter.com/yourhandle';
      case 'instagram':
        return 'https://instagram.com/yourprofile';
      case 'github':
        return 'https://github.com/yourusername';
      case 'email':
        return 'your.email@example.com';
      case 'phone':
        return '+84 123 456 789';
      default:
        return 'Enter URL';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {initialData ? 'Edit Social Link' : 'Add Social Link'}
          </h3>

          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform <span className="text-red-500">*</span>
              </label>
              <select
                {...register('platform')}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.platform ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={initialData !== null}
              >
                <option value="">Select platform</option>
                {PLATFORMS.map((platform) => (
                  <option
                    key={platform.value}
                    value={platform.value}
                    disabled={
                      !initialData && existingPlatforms.includes(platform.value)
                    }
                  >
                    {platform.label}
                    {!initialData && existingPlatforms.includes(platform.value) && ' (Already added)'}
                  </option>
                ))}
              </select>
              {errors.platform && (
                <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>
              )}
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL/Handle <span className="text-red-500">*</span>
              </label>
              <input
                {...register('url')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.url ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={getPlaceholder()}
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {initialData ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SocialLinksStep = ({ onNext, onBack }) => {
  const { socialLinks, addSocialLink, updateSocialLink, deleteSocialLink, reorderSocialLinks } =
    useWizardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      const reordered = arrayMove(socialLinks, oldIndex, newIndex);
      reorderSocialLinks(reordered);
    }
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      deleteSocialLink(index);
    }
  };

  const handleSave = (data) => {
    if (editingIndex !== null) {
      updateSocialLink(editingIndex, data);
    } else {
      addSocialLink(data);
    }
    setIsModalOpen(false);
  };

  const existingPlatforms = socialLinks.map((link) => link.platform);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Social Links</h2>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        disabled={socialLinks.length >= 10}
        className={`w-full mb-6 py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-all ${
          socialLinks.length >= 10
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50'
        }`}
      >
        <FaPlus />
        <span>Add Social Link</span>
        {socialLinks.length >= 10 && <span className="text-sm">(Max 10 reached)</span>}
      </button>

      {/* Links List */}
      {socialLinks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No social links added yet.</p>
          <p className="text-sm mt-2">Click "Add Social Link" to get started.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={socialLinks.map((_, i) => i)} strategy={verticalListSortingStrategy}>
            {socialLinks.map((link, index) => (
              <SortableSocialItem
                key={index}
                link={link}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={socialLinks.length === 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            socialLinks.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next Step
        </button>
      </div>

      {/* Modal */}
      <SocialLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingIndex !== null ? socialLinks[editingIndex] : null}
        existingPlatforms={existingPlatforms}
      />
    </div>
  );
};

export default SocialLinksStep;
