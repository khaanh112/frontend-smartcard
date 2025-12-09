import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { personalInfoSchema } from '../../utils/validationSchemas';
import useWizardStore from '../../store/wizardStore';

const PersonalInfoStep = ({ onNext }) => {
  const { personalInfo, setPersonalInfo } = useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: personalInfo
  });

  const formData = watch();

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.fullName || formData.email) {
        setPersonalInfo(formData);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, setPersonalInfo]);

  const onSubmit = (data) => {
    setPersonalInfo(data);
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName')}
            type="text"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Title/Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title/Position <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g. Software Engineer"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            {...register('phone')}
            type="tel"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+84 123 456 789"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            {...register('address')}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isValid}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStep;
