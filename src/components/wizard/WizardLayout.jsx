import React from 'react';
import { FaUser, FaBriefcase, FaLink, FaCamera, FaEye } from 'react-icons/fa';

const WizardLayout = ({ currentStep, children }) => {
  const steps = [
    { number: 1, label: 'Personal Info', icon: FaUser },
    { number: 2, label: 'Work Experience', icon: FaBriefcase },
    { number: 3, label: 'Social Links', icon: FaLink },
    { number: 4, label: 'Avatar', icon: FaCamera },
    { number: 5, label: 'Preview', icon: FaEye }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isUpcoming = step.number > currentStep;

              return (
                <React.Fragment key={step.number}>
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all
                        ${isCompleted ? 'bg-blue-600 text-white' : ''}
                        ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-200' : ''}
                        ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                      `}
                    >
                      <Icon className="text-xl" />
                    </div>
                    <span
                      className={`
                        mt-2 text-sm font-medium
                        ${isCurrent ? 'text-blue-600' : 'text-gray-600'}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2 transition-all
                        ${step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step Number Text */}
          <div className="text-center text-gray-600 text-sm">
            Step {currentStep} of {steps.length}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
