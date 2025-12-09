import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DRAFT_EXPIRY_DAYS = 7;

const useWizardStore = create(
  persist(
    (set, get) => ({
      // Current wizard step (1-5)
      currentStep: 1,

      // Step 1: Personal Info
      personalInfo: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        address: ''
      },

      // Step 2: Work Experiences (array)
      workExperiences: [],

      // Step 3: Social Links (array)
      socialLinks: [],

      // Step 4: Avatar URL
      avatarUrl: '',

      // Draft metadata
      lastSaved: null,
      draftExpiry: null,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      setPersonalInfo: (info) =>
        set({
          personalInfo: info,
          lastSaved: new Date().toISOString(),
          draftExpiry: new Date(Date.now() + DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString()
        }),

      addWorkExperience: (experience) =>
        set((state) => ({
          workExperiences: [...state.workExperiences, experience],
          lastSaved: new Date().toISOString()
        })),

      updateWorkExperience: (index, experience) =>
        set((state) => ({
          workExperiences: state.workExperiences.map((exp, i) => 
            i === index ? experience : exp
          ),
          lastSaved: new Date().toISOString()
        })),

      deleteWorkExperience: (index) =>
        set((state) => ({
          workExperiences: state.workExperiences.filter((_, i) => i !== index),
          lastSaved: new Date().toISOString()
        })),

      reorderWorkExperiences: (experiences) =>
        set({
          workExperiences: experiences,
          lastSaved: new Date().toISOString()
        }),

      addSocialLink: (link) =>
        set((state) => ({
          socialLinks: [...state.socialLinks, link],
          lastSaved: new Date().toISOString()
        })),

      updateSocialLink: (index, link) =>
        set((state) => ({
          socialLinks: state.socialLinks.map((l, i) => 
            i === index ? link : l
          ),
          lastSaved: new Date().toISOString()
        })),

      deleteSocialLink: (index) =>
        set((state) => ({
          socialLinks: state.socialLinks.filter((_, i) => i !== index),
          lastSaved: new Date().toISOString()
        })),

      reorderSocialLinks: (links) =>
        set({
          socialLinks: links,
          lastSaved: new Date().toISOString()
        }),

      setAvatarUrl: (url) =>
        set({
          avatarUrl: url,
          lastSaved: new Date().toISOString()
        }),

      resetWizard: () =>
        set({
          currentStep: 1,
          personalInfo: {
            fullName: '',
            title: '',
            email: '',
            phone: '',
            address: ''
          },
          workExperiences: [],
          socialLinks: [],
          avatarUrl: '',
          lastSaved: null,
          draftExpiry: null
        }),

      // Completion checkers
      isPersonalInfoComplete: () => {
        const { personalInfo } = get();
        return personalInfo.fullName && personalInfo.title && personalInfo.email;
      },

      isWorkExperienceComplete: () => {
        const { workExperiences } = get();
        return workExperiences.length > 0;
      },

      isSocialLinksComplete: () => {
        const { socialLinks } = get();
        return socialLinks.length > 0;
      },

      isAvatarComplete: () => {
        const { avatarUrl } = get();
        return !!avatarUrl;
      }
    }),
    {
      name: 'wizard-draft',
      partialize: (state) => ({
        currentStep: state.currentStep,
        personalInfo: state.personalInfo,
        workExperiences: state.workExperiences,
        socialLinks: state.socialLinks,
        avatarUrl: state.avatarUrl,
        lastSaved: state.lastSaved,
        draftExpiry: state.draftExpiry
      })
    }
  )
);

export default useWizardStore;
