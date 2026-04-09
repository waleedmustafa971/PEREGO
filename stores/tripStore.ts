import { create } from 'zustand';
import { IncomingRequest } from '@/lib/types';
import { mockIncomingRequests } from '@/lib/mockData';

interface TripState {
  incomingRequests: IncomingRequest[];
  selectedRequest: IncomingRequest | null;
  courierStatus: number;
  setSelectedRequest: (r: IncomingRequest) => void;
  advanceStatus: () => void;
  resetStatus: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  incomingRequests: mockIncomingRequests,
  selectedRequest: null,
  courierStatus: 0,
  setSelectedRequest: (r) => set({ selectedRequest: r }),
  advanceStatus: () => set({ courierStatus: Math.min(get().courierStatus + 1, 3) }),
  resetStatus: () => set({ courierStatus: 0 }),
}));
