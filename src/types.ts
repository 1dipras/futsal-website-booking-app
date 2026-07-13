export interface Booking {
  id: string
  fieldId: string
  date: string
  startTime: string
  endTime: string
  customerName: string
  expiresAt: number
}

export interface Field {
  id: string
  name: string
  type: 'Indoor' | 'Outdoor'
  surface: string
  capacity: number
  pricePerHour: number
  image: string
  amenities: string[]
  bookings: Booking[]
}

export interface Transaction {
  id: string
  bookingId: string
  fieldId: string
  fieldName: string
  customerName: string
  date: string
  startTime: string
  endTime: string
  amount: number
  paymentMethod: string
  status: 'success' | 'pending' | 'failed'
  createdAt: number
}

export interface AdminCredentials {
  username: string
  password: string
}

export interface AdminSession {
  username: string
  loginTime: number
}

export interface DoubleBooking {
  id: string
  fieldId: string
  fieldName: string
  bookingIds: string[]
  conflictingTime: {
    date: string
    startTime: string
    endTime: string
  }
  customers: string[]
  detectedAt: number
  resolved: boolean
}

export interface RefundRequest {
  id: string
  doubleBookingId: string
  bookingId: string
  fieldName: string
  customerName: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: number
  resolvedAt?: number
  resolvedBy?: string
}
