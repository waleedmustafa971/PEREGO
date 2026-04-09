import { create } from 'zustand';
import { Shipment, Trip } from '@/lib/types';
import { mockShipments, mockTravelers } from '@/lib/mockData';

interface ShipmentState {
  shipments: Shipment[];
  selectedTraveler: Trip | null;
  activeShipment: Shipment | null;
  setSelectedTraveler: (t: Trip) => void;
  setActiveShipment: (s: Shipment) => void;
  getAvailableTravelers: () => Trip[];
}

export const useShipmentStore = create<ShipmentState>((set) => ({
  shipments: mockShipments,
  selectedTraveler: null,
  activeShipment: mockShipments[0],
  setSelectedTraveler: (t) => set({ selectedTraveler: t }),
  setActiveShipment: (s) => set({ activeShipment: s }),
  getAvailableTravelers: () => mockTravelers,
}));
