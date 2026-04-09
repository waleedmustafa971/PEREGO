export type UserRole = 'sender' | 'courier';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type ShipmentStatus = 'pending' | 'matched' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered' | 'disputed' | 'cancelled';
export type EscrowStatus = 'held' | 'released' | 'refunded' | 'disputed';
export type PackageCategory = 'gift' | 'documents' | 'clothing' | 'electronics' | 'food' | 'other';
export type TripStatus = 'active' | 'fully_booked' | 'completed' | 'cancelled';

export interface User {
  uid: string;
  displayName: string;
  phone: string;
  email: string;
  avatarColor: string;
  verificationStatus: VerificationStatus;
  trustScore: number;
  totalDeliveries: number;
  rating: number;
  roles: UserRole[];
}

export interface Trip {
  tripId: string;
  courierId: string;
  courierName: string;
  courierAvatar: string;
  courierRating: number;
  courierReviews: number;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  travelDate: string;
  flight: string;
  totalCapacityKg: number;
  remainingCapacityKg: number;
  pricePerKg: number;
  acceptedCategories: PackageCategory[];
  pickupZone: string;
  deliveryZone: string;
  status: TripStatus;
}

export interface Shipment {
  shipmentId: string;
  senderId: string;
  courierId?: string;
  courierName?: string;
  tripId?: string;
  destinationCity: string;
  destinationCountry: string;
  category: PackageCategory;
  description: string;
  weightKg: number;
  declaredValue: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  status: ShipmentStatus;
  agreedPrice: number;
  platformFee: number;
  deliveryPin: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface IncomingRequest {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRating: number;
  senderReviews: number;
  category: PackageCategory;
  weightKg: number;
  price: number;
  description: string;
  hasPhoto: boolean;
}

export interface TrackingStep {
  label: string;
  time: string;
  location: string;
  done: boolean;
  current?: boolean;
}
