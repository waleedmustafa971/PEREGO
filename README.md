# Perego — App Documentation

> "Deliver with trust" — A peer-to-peer package delivery platform that connects senders with verified travelers flying to the same destination.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Concept](#core-concept)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [User Roles](#user-roles)
6. [Authentication & Verification](#authentication--verification)
7. [Feature Flows](#feature-flows)
   - [Sender Flow](#sender-flow)
   - [Courier Flow](#courier-flow)
8. [Screens Reference](#screens-reference)
9. [Data Models](#data-models)
10. [State Management](#state-management)
11. [Trust & Safety](#trust--safety)
12. [Payment & Escrow](#payment--escrow)
13. [Design System](#design-system)

---

## Overview

Perego is a React Native mobile app (iOS, Android, Web) built with Expo SDK 55. It enables people to ship personal items through real travelers — cheaper and faster than traditional couriers — built on a trust and verification layer.

The primary target market is the Arab diaspora corridor (UAE → Egypt, Jordan, Sudan, Turkey), where personal packages are commonly carried by travelers. Perego formalizes and secures this informal practice.

---

## Core Concept

```
Sender                    Traveler (Courier)              Receiver
  │                             │                             │
  │  Posts a shipment request   │                             │
  │ ─────────────────────────►  │                             │
  │                             │                             │
  │  Browses travelers, books   │                             │
  │ ─────────────────────────►  │                             │
  │                             │                             │
  │  Payment held in escrow     │                             │
  │ ─────────────────────────►  │                             │
  │                             │  Picks up package           │
  │                             │ ─────────────────────────►  │
  │                             │  Departs, travels           │
  │                             │ ─────────────────────────►  │
  │                             │  Delivers with PIN          │
  │                             │ ─────────────────────────►  │
  │                             │                             │
  │  Escrow released to courier ◄─────────────────────────── │
  │                (after receiver confirms)                   │
```

**Key value proposition:** A traveler with spare luggage capacity earns money on a trip they're already taking. A sender pays far less than a shipping company. Both are verified, rated, and protected by escrow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Router | Expo Router (file-based, v3) |
| Language | TypeScript |
| State | Zustand |
| Navigation | Expo Router tabs + stack |
| Fonts | Google Fonts via `@expo-google-fonts` (Syne, DM Sans) |
| Animations | React Native Reanimated 4 + Worklets 0.7 |
| Gestures | React Native Gesture Handler |
| Image Picker | expo-image-picker |
| Platforms | iOS, Android, Web |

---

## Project Structure

```
perego/
├── app/                        # All screens (file-based routing)
│   ├── _layout.tsx             # Root layout — fonts, splash screen, stack
│   ├── index.tsx               # Splash/entry screen → redirects by auth state
│   ├── auth/
│   │   ├── _layout.tsx         # Auth stack
│   │   ├── welcome.tsx         # Landing screen with login/register CTAs
│   │   ├── login.tsx           # Phone number + OTP login
│   │   └── register.tsx        # 3-step registration (info, selfie, submitted)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar — role-aware labels and icons
│   │   ├── home.tsx            # Dashboard (differs by role)
│   │   ├── ship.tsx            # Redirects to create shipment or create trip
│   │   ├── track.tsx           # Redirects to tracking or requests
│   │   └── profile.tsx         # User profile, stats, role switcher
│   ├── shipment/
│   │   ├── _layout.tsx
│   │   ├── create.tsx          # 3-step shipment creation wizard
│   │   ├── browse-travelers.tsx # Browse & filter available travelers
│   │   ├── booking.tsx         # Price breakdown + pay & book
│   │   └── tracking.tsx        # Live shipment timeline tracker
│   ├── courier/
│   │   ├── _layout.tsx
│   │   ├── create-trip.tsx     # Trip listing form
│   │   ├── requests.tsx        # Incoming shipment requests
│   │   ├── pickup.tsx          # Pickup coordination
│   │   ├── status.tsx          # Delivery milestone updater
│   │   └── delivery.tsx        # Final delivery confirmation
│   └── chat/
│       ├── _layout.tsx
│       └── conversation.tsx    # In-app messaging
├── components/
│   └── ui/
│       ├── Button.tsx          # Multi-variant button (primary, ghost, orange, danger...)
│       ├── Input.tsx           # Labeled text input with icon
│       ├── Card.tsx            # Card container + Avatar + Badge components
│       └── Header.tsx          # Screen header with back button
├── stores/
│   ├── authStore.ts            # Auth state, user, role, login/logout
│   ├── shipmentStore.ts        # Selected traveler for booking flow
│   └── tripStore.ts            # Selected request + courier delivery status
├── lib/
│   ├── types.ts                # All TypeScript interfaces and enums
│   ├── theme.ts                # Colors, spacing, radius, fonts, font sizes
│   ├── constants.ts            # Categories, platform fee, prohibited items, routes
│   └── mockData.ts             # Mock users, trips, shipments, chats, tracking steps
├── app.json                    # Expo config (scheme, platforms, plugins)
├── babel.config.js             # Babel with babel-preset-expo + reanimated plugin
└── tsconfig.json               # TypeScript with `@/*` path alias
```

---

## User Roles

Every user can operate in both roles and switch freely from their profile. The UI adapts entirely based on the active role.

### Sender
- Wants to send a package to someone in another city/country
- Posts shipment requests with destination, package details, and receiver info
- Browses verified travelers heading to the destination
- Pays via escrow; funds release only after confirmed delivery

### Courier (Traveler)
- A person already traveling to a destination
- Lists their spare luggage capacity on Perego
- Receives shipment requests from senders
- Picks up, carries, and delivers packages; earns on the trip

**Role switch:** Tapping "Switch to Courier/Sender Mode" in the Profile screen toggles between roles instantly. The tab bar labels, icons, home dashboard, and available actions all change accordingly.

---

## Authentication & Verification

### Login
- Phone number entry (pre-filled UAE +971 prefix)
- OTP sent to phone → 4-digit code entry with custom box UI
- On verify → user is logged in and sent to `/(tabs)/home`

### Registration — 3 Steps
| Step | Content |
|---|---|
| 1 — Basic Info | Full name, email, phone, upload National ID (front & back), upload Passport |
| 2 — Selfie Verification | Live selfie for ID matching — no sunglasses, well-lit |
| 3 — Submitted | Documents under 24-hour review; user receives notification when verified |

### Verification Status
Users carry a `verificationStatus`: `pending` / `verified` / `rejected`. Verified users get a green "Verified" badge displayed throughout the app. Couriers must be verified before delivering.

---

## Feature Flows

### Sender Flow

#### 1. Create Shipment (3 steps)
**Step 1 — Route**
- Origin city (auto-detected, e.g. Dubai, UAE)
- Destination city (e.g. Cairo, Egypt)
- Preferred date range for travel

**Step 2 — Package Details**
- Category: Gift, Documents, Clothes, Electronics, Food, Other
- Description of contents
- Weight (kg) and declared value ($)
- Optional package photo upload

**Step 3 — Receiver Info**
- Receiver full name, phone number, address
- System note: receiver gets an SMS tracking link automatically

#### 2. Browse Travelers
- List of verified travelers on matching routes within the date range
- Filter by: Best Match, Price (low→high), Rating (high→low), Soonest departure
- Each card shows: traveler name, rating, review count, route, flight number, remaining luggage capacity, price per kg, verified badge
- Tap a traveler → proceed to booking

#### 3. Booking & Payment
- Summary of selected traveler (name, route, rating)
- Price breakdown:
  - Traveler fee (weight × price/kg)
  - Platform fee (12%)
  - Optional insurance
  - Total
- Escrow notice: funds held until receiver confirms delivery
- "Pay & Book" → opens chat with traveler

#### 4. Tracking
Timeline with 5 milestones:
1. Package Handed Over
2. Traveler Departed
3. In Transit (current)
4. Traveler Arrived
5. Delivered to Receiver

Each step shows timestamp and location. Active step is highlighted in orange with a glow. Completed steps are green with a checkmark. Direct link to chat with the traveler.

---

### Courier Flow

#### 1. Create a Trip Listing
- Route (origin → destination)
- Travel date
- Available weight capacity (kg)
- Price per kg ($)
- Accepted item categories (toggleable chips)
- Flight booking proof (upload)
- Pickup zone and delivery zone

#### 2. Incoming Requests
- List of sender requests matching the courier's trip
- Each card shows: sender name, rating, reviews, item category, weight, price offered, item description, photo indicator
- Actions: Accept or Decline per request
- Accepting → navigates to pickup coordination screen

#### 3. Delivery Milestones (Status Updates)
Couriers tap through 4 milestones to update delivery progress:

| # | Milestone | Description |
|---|---|---|
| 1 | Picked Up | Package in courier's possession |
| 2 | Departed | Boarded / left origin city |
| 3 | Arrived | Landed at destination |
| 4 | Out for Delivery | On the way to meet receiver |

After all milestones → "Confirm Delivery with Receiver" triggers final delivery screen where the delivery PIN is exchanged with the receiver.

#### 4. Courier Dashboard (Home)
Stats grid showing:
- Earnings ($)
- Total deliveries
- Rating (out of 5)
- Trust score (out of 100)

Quick access to list a new trip and view incoming requests.

---

## Screens Reference

| Route | Screen | Role |
|---|---|---|
| `/` | Splash / Entry | Both |
| `/auth/welcome` | Welcome landing | Guest |
| `/auth/login` | Phone + OTP login | Guest |
| `/auth/register` | 3-step registration | Guest |
| `/(tabs)/home` | Role-aware dashboard | Both |
| `/(tabs)/ship` | Redirect (create shipment or trip) | Both |
| `/(tabs)/track` | Redirect (tracking or requests) | Both |
| `/(tabs)/profile` | Profile, stats, role switcher | Both |
| `/shipment/create` | New shipment wizard | Sender |
| `/shipment/browse-travelers` | Available traveler list | Sender |
| `/shipment/booking` | Booking confirmation + payment | Sender |
| `/shipment/tracking` | Live shipment timeline | Sender |
| `/courier/create-trip` | New trip listing form | Courier |
| `/courier/requests` | Incoming shipment requests | Courier |
| `/courier/pickup` | Pickup coordination | Courier |
| `/courier/status` | Delivery milestone updater | Courier |
| `/courier/delivery` | Final delivery confirmation | Courier |
| `/chat/conversation` | In-app messaging | Both |

---

## Data Models

### User
```ts
{
  uid: string
  displayName: string
  phone: string
  email: string
  avatarColor: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  trustScore: number          // 0–100
  totalDeliveries: number
  rating: number              // 0–5
  roles: ('sender' | 'courier')[]
}
```

### Trip (Courier listing)
```ts
{
  tripId: string
  courierId: string
  courierName, courierAvatar, courierRating, courierReviews
  originCity, originCountry
  destinationCity, destinationCountry
  travelDate: string          // e.g. "Apr 14"
  flight: string              // e.g. "Emirates EK925"
  totalCapacityKg: number
  remainingCapacityKg: number
  pricePerKg: number
  acceptedCategories: PackageCategory[]
  pickupZone: string
  deliveryZone: string
  status: 'active' | 'fully_booked' | 'completed' | 'cancelled'
}
```

### Shipment
```ts
{
  shipmentId: string
  senderId: string
  courierId?: string
  tripId?: string
  destinationCity, destinationCountry
  category: PackageCategory
  description: string
  weightKg: number
  declaredValue: number
  receiverName, receiverPhone, receiverAddress
  status: ShipmentStatus      // pending → matched → picked_up → in_transit → arrived → delivered
  agreedPrice: number
  platformFee: number
  deliveryPin: string         // 6-digit PIN for delivery confirmation
}
```

### Package Categories
`gift` · `documents` · `clothing` · `electronics` · `food` · `other`

### Shipment Statuses
`pending` → `matched` → `picked_up` → `in_transit` → `arrived` → `delivered`  
_(edge cases: `disputed`, `cancelled`)_

---

## State Management

Three Zustand stores:

### `authStore`
| State | Type | Description |
|---|---|---|
| `user` | `User \| null` | Logged-in user |
| `isAuthenticated` | `boolean` | Auth state |
| `activeRole` | `'sender' \| 'courier'` | Current active role |
| `login()` | action | Sets mock user, marks authenticated |
| `logout()` | action | Clears user state |
| `switchRole()` | action | Toggles between sender and courier |

### `shipmentStore`
| State | Description |
|---|---|
| `selectedTraveler` | The `Trip` selected during browse-travelers |
| `setSelectedTraveler(t)` | Saves selection for the booking screen |

### `tripStore`
| State | Description |
|---|---|
| `selectedRequest` | The `IncomingRequest` a courier accepted |
| `courierStatus` | Index (0–3) of current delivery milestone |
| `setSelectedRequest(r)` | Saves accepted request |
| `advanceStatus()` | Increments milestone index by 1 |

---

## Trust & Safety

### Verification Layer
- Every user must upload a government-issued ID (National ID or Passport) and take a live selfie
- Documents are reviewed within 24 hours
- Verified badge displayed on traveler cards and profiles

### Trust Score
- Each user has a `trustScore` (0–100) computed from delivery history, ratings, and account age
- Displayed in the courier dashboard and profile stats

### Rating System
- Both senders and couriers are rated after each transaction
- Ratings and review counts are visible on all traveler/request cards

### Delivery PIN
- Each shipment has a 6-digit `deliveryPin`
- The courier must obtain the PIN from the receiver at delivery to confirm handoff
- This prevents false delivery confirmations

### Prohibited Items
The platform explicitly prohibits:
- Weapons & ammunition
- Illegal drugs & controlled substances
- Flammable & hazardous materials
- Live animals
- Alcohol (to prohibited countries)
- Prescription medications (without documentation)
- Counterfeit goods
- Currency above local legal thresholds

---

## Payment & Escrow

- **Platform fee:** 12% of the agreed traveler fee (`PLATFORM_FEE_PERCENT = 0.12`)
- **Escrow model:** The sender's payment is held by the platform and only released to the courier after the receiver confirms delivery
- **Optional insurance:** Available at checkout (currently shown as $0.00 — future feature)
- **Pricing:** Set by the courier as a per-kg rate; sender pays `weight × pricePerKg + 12% fee`

---

## Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| `teal` | `#1A6B5C` | Primary brand, CTAs, confirmed states |
| `orange` | `#E8722A` | Courier mode, pending states, secondary CTAs |
| `cream` | `#F5F0E6` | Background accents |
| `night` | `#1A1A2E` | Primary text |
| `green` | `#34D399` | Success, verified, delivered |
| `red` | `#EF4444` | Errors, danger actions |
| `gray100–600` | — | UI hierarchy, borders, subtle text |

### Typography
| Token | Font | Weight |
|---|---|---|
| `heading` | Syne | 700 Bold |
| `headingBold` | Syne | 800 ExtraBold |
| `body` | DM Sans | 400 Regular |
| `bodyMedium` | DM Sans | 500 Medium |
| `bodySemiBold` | DM Sans | 600 SemiBold |
| `bodyBold` | DM Sans | 700 Bold |

### Spacing Scale
`xs: 4` · `sm: 8` · `md: 12` · `lg: 16` · `xl: 20` · `xxl: 24` · `xxxl: 32`

### Border Radius
`sm: 8` · `md: 12` · `lg: 16` · `xl: 20` · `full: 999`

### UI Components
| Component | Location | Description |
|---|---|---|
| `Button` | `components/ui/Button.tsx` | Variants: primary, secondary, orange, ghost, danger. Supports full-width and small size. |
| `Input` | `components/ui/Input.tsx` | Labeled text input with leading emoji icon |
| `Card` | `components/ui/Card.tsx` | White card with shadow + `Avatar` and `Badge` sub-components |
| `Header` | `components/ui/Header.tsx` | Screen header with back chevron and optional right slot |

---

## Popular Routes (Current)

| Route | Travelers Available |
|---|---|
| Dubai → Cairo | 24 |
| Dubai → Istanbul | 18 |
| Abu Dhabi → Amman | 12 |
| Dubai → Khartoum | 8 |
