import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Enquiry {
  id?: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  occupation?: string;
  roomType?: string;
  moveInDate?: string;
  budget?: string;
  message?: string;
  amenities?: string[];
  pgId?: string;
  source: 'quick-enquiry' | 'enquiry-page' | 'pg-form';
  submittedAt: Date;
  status: 'pending' | 'submitted' | 'error';
}

interface EnquiryStore {
  // Current enquiry form data
  currentEnquiry: Partial<Enquiry>;
  setCurrentEnquiry: (enquiry: Partial<Enquiry>) => void;
  updateCurrentEnquiry: (updates: Partial<Enquiry>) => void;
  clearCurrentEnquiry: () => void;
  
  // Submitted enquiries history
  enquiries: Enquiry[];
  addEnquiry: (enquiry: Enquiry) => void;
  
  // Form state
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  
  // Auto-save functionality
  lastSaved: Date | null;
  setLastSaved: (date: Date | null) => void;
  
  // Clear all data
  clearAll: () => void;
}

export const useEnquiryStore = create<EnquiryStore>()(
  persist(
    (set, get) => ({
      // Current enquiry form data
      currentEnquiry: {},
      setCurrentEnquiry: (enquiry) => set({ currentEnquiry: enquiry }),
      updateCurrentEnquiry: (updates) => set((state) => ({
        currentEnquiry: { ...state.currentEnquiry, ...updates }
      })),
      clearCurrentEnquiry: () => set({ currentEnquiry: {} }),
      
      // Submitted enquiries history
      enquiries: [],
      addEnquiry: (enquiry) => set((state) => ({
        enquiries: [...state.enquiries, { ...enquiry, id: crypto.randomUUID(), submittedAt: new Date(), status: 'submitted' as const }]
      })),
      
      // Form state
      isSubmitting: false,
      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
      
      // Auto-save functionality
      lastSaved: null,
      setLastSaved: (date) => set({ lastSaved: date }),
      
      // Clear all data
      clearAll: () => set({
        currentEnquiry: {},
        enquiries: [],
        isSubmitting: false,
        lastSaved: null,
      }),
    }),
    {
      name: 'enquiry-store',
      partialize: (state) => ({
        currentEnquiry: state.currentEnquiry,
        lastSaved: state.lastSaved,
      }),
    }
  )
);

// Helper functions for form submission
export const submitEnquiry = async (enquiryData: Partial<Enquiry>, source: Enquiry['source']) => {
  const { setCurrentEnquiry, setIsSubmitting, addEnquiry } = useEnquiryStore.getState();
  
  try {
    setIsSubmitting(true);
    
    // Validate required fields
    if (!enquiryData.name || !enquiryData.phone || !enquiryData.email || !enquiryData.location) {
      throw new Error('Required fields are missing');
    }
    
    // Prepare submission data
    const submissionData: Enquiry = {
      id: crypto.randomUUID(),
      name: enquiryData.name,
      phone: enquiryData.phone,
      email: enquiryData.email,
      location: enquiryData.location,
      occupation: enquiryData.occupation || '',
      roomType: enquiryData.roomType || '',
      moveInDate: enquiryData.moveInDate || '',
      budget: enquiryData.budget || '',
      message: enquiryData.message || '',
      amenities: enquiryData.amenities || [],
      pgId: enquiryData.pgId,
      source,
      submittedAt: new Date(),
      status: 'pending'
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add to store
    addEnquiry(submissionData);
    
    // Clear current form
    setCurrentEnquiry({});
    
    return { success: true, data: submissionData };
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit enquiry' };
  } finally {
    setIsSubmitting(false);
  }
};
