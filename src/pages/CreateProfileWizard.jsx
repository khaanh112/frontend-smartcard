import React from 'react';
import { useNavigate } from 'react-router-dom';
import useWizardStore from '../store/wizardStore';
import WizardLayout from '../components/wizard/WizardLayout';
import PersonalInfoStep from '../components/wizard/PersonalInfoStep';
import WorkExperienceStep from '../components/wizard/WorkExperienceStep';
import SocialLinksStep from '../components/wizard/SocialLinksStep';
import AvatarUpload from '../components/wizard/AvatarUpload';
import PreviewStep from '../components/wizard/PreviewStep';

const CreateProfileWizard = () => {
  const { currentStep, setCurrentStep } = useWizardStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep onNext={handleNext} />;
      case 2:
        return <WorkExperienceStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <SocialLinksStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <AvatarUpload onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <PreviewStep onBack={handleBack} />;
      default:
        return <PersonalInfoStep onNext={handleNext} />;
    }
  };

  return (
    <WizardLayout currentStep={currentStep}>
      {renderStep()}
    </WizardLayout>
  );
};

export default CreateProfileWizard;
