import { useState, useCallback } from 'react';
import { validateRoomNumber, validateBedNumber, ValidationResult } from '@/lib/validation/room-validation';

export function useRoomNumberValidation(pgId: string, excludeRoomId?: string) {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    message: '',
    isLoading: false
  });

  const validateRoomNumberCallback = useCallback(async (roomNumber: string) => {
    if (!roomNumber.trim()) {
      setValidation({ isValid: true, message: '', isLoading: false });
      return true;
    }

    setValidation(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await validateRoomNumber(pgId, roomNumber, excludeRoomId);
      
      setValidation({
        isValid: result.valid,
        message: result.message || '',
        isLoading: false
      });
      
      return result.valid;
    } catch (error) {
      setValidation({
        isValid: false,
        message: 'Validation failed',
        isLoading: false
      });
      return false;
    }
  }, [pgId, excludeRoomId]);

  const resetValidation = useCallback(() => {
    setValidation({ isValid: true, message: '', isLoading: false });
  }, []);

  return {
    validation,
    validateRoomNumber: validateRoomNumberCallback,
    resetValidation
  };
}

export function useBedNumberValidation(roomId: string, excludeBedId?: string) {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    message: '',
    isLoading: false
  });

  const validateBedNumberCallback = useCallback(async (bedNumber: string) => {
    if (!bedNumber.trim()) {
      setValidation({ isValid: true, message: '', isLoading: false });
      return true;
    }

    setValidation(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await validateBedNumber(roomId, bedNumber, excludeBedId);
      
      setValidation({
        isValid: result.valid,
        message: result.message || '',
        isLoading: false
      });
      
      return result.valid;
    } catch (error) {
      setValidation({
        isValid: false,
        message: 'Validation failed',
        isLoading: false
      });
      return false;
    }
  }, [roomId, excludeBedId]);

  const resetValidation = useCallback(() => {
    setValidation({ isValid: true, message: '', isLoading: false });
  }, []);

  return {
    validation,
    validateBedNumber: validateBedNumberCallback,
    resetValidation
  };
}
