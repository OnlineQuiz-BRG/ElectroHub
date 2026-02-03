
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  password?: string; // Mock password field
  idType?: string;
  idProofUrl?: string;
  verificationStatus: VerificationStatus;
  role: UserRole;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  specs: Record<string, string>;
  basePrice: number;
  discountPercentage: number;
  stock: number;
  images: string[];
  isBiddable: boolean;
  category: string;
  brand: string;
  condition: 'NEW' | 'RESELLER';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export enum NotificationType {
  OUTBID = 'OUTBID',
  AUCTION_ENDING = 'AUCTION_ENDING',
  ORDER_STATUS = 'ORDER_STATUS',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  NEW_BID = 'NEW_BID'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface Auction {
  id: string;
  productId: string;
  startTime: string;
  endTime: string;
  currentHighestBid: number;
  reservePrice: number;
  status: 'ACTIVE' | 'ENDED' | 'CANCELLED';
  bids: Bid[];
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
