import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { workExperienceSchema } from '../../utils/validationSchemas';
import useWizardStore from '../../store/wizardStore';
import { FaPlus, FaEdit, FaTrash, FaGripVertical } from 'react-icons/fa';
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

const SortableWorkItem = ({ experience, index, onEdit, onDelete }) => {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 text-gray-400 hover:text-gray-600"
        >
          <FaGripVertical />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{experience.position}</h4>
          <p className="text-sm text-gray-600">{experience.company}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
          </p>
          {experience.description && (
            <p className="text-sm text-gray-700 mt-2">{experience.description}</p>
          )}
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

const WorkExperienceModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(workExperienceSchema),
    defaultValues: initialData || {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    }
  });

  const isCurrent = watch('isCurrent');

  React.useEffect(() => {
    if (isCurrent) {
      setValue('endDate', null);
    }
  }, [isCurrent, setValue]);

  const onSubmit = (data) => {
    // Clean up data before saving
    const cleanData = {
      ...data,
      endDate: data.isCurrent ? null : data.endDate
    };
    onSave(cleanData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {initialData ? 'Edit Experience' : 'Add Work Experience'}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Company name"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                {...register('position')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Job title"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('startDate')}
                  type="month"
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="month"
                  disabled={isCurrent}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    isCurrent ? 'bg-gray-100' : ''
                  } ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Current Position */}
            <div className="flex items-center">
              <input
                {...register('isCurrent')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                I currently work here
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="4"
                maxLength="500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Describe your responsibilities and achievements..."
              />
              <p className="mt-1 text-sm text-gray-500">
                {watch('description')?.length || 0} / 500 characters
              </p>
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
                {initialData ? 'Save Changes' : 'Add Experience'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const WorkExperienceStep = ({ onNext, onBack }) => {
  const { workExperiences, addWorkExperience, updateWorkExperience, deleteWorkExperience, reorderWorkExperiences } =
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
      const reordered = arrayMove(workExperiences, oldIndex, newIndex);
      reorderWorkExperiences(reordered);
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
    if (window.confirm('Are you sure you want to delete this experience?')) {
      deleteWorkExperience(index);
    }
  };

  const handleSave = (data) => {
    if (editingIndex !== null) {
      updateWorkExperience(editingIndex, data);
    } else {
      addWorkExperience(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Work Experience</h2>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        disabled={workExperiences.length >= 10}
        className={`w-full mb-6 py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-all ${
          workExperiences.length >= 10
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50'
        }`}
      >
        <FaPlus />
        <span>Add Work Experience</span>
        {workExperiences.length >= 10 && <span className="text-sm">(Max 10 reached)</span>}
      </button>

      {/* Experience List */}
      {workExperiences.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No work experience added yet.</p>
          <p className="text-sm mt-2">Click "Add Work Experience" to get started.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={workExperiences.map((_, i) => i)} strategy={verticalListSortingStrategy}>
            {workExperiences.map((exp, index) => (
              <SortableWorkItem
                key={index}
                experience={exp}
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
          disabled={workExperiences.length === 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            workExperiences.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next Step
        </button>
      </div>

      {/* Modal */}
      <WorkExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingIndex !== null ? workExperiences[editingIndex] : null}
      />
    </div>
  );
};

export default WorkExperienceStep;
