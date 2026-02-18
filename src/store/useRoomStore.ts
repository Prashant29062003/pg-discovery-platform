import { create } from 'zustand';

interface RoomImage {
  id: string;
  url: string;
  name: string;
  isUploading?: boolean;
  progress?: number;
}

interface RoomStore {
  images: RoomImage[];
  isUploading: boolean;
  uploadProgress: number;
  
  // Actions
  addImage: (image: RoomImage) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<RoomImage>) => void;
  setImages: (images: RoomImage[]) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  clearImages: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  images: [],
  isUploading: false,
  uploadProgress: 0,

  addImage: (image) => set((state) => ({
    images: [...state.images, image]
  })),

  removeImage: (id) => set((state) => ({
    images: state.images.filter(img => img.id !== id)
  })),

  updateImage: (id, updates) => set((state) => ({
    images: state.images.map(img => 
      img.id === id ? { ...img, ...updates } : img
    )
  })),

  setImages: (images) => set({ images }),

  setUploading: (isUploading) => set({ isUploading }),

  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  clearImages: () => set({ 
    images: [], 
    isUploading: false, 
    uploadProgress: 0 
  }),
}));
