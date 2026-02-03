
import { User, Product, Auction, UserRole, VerificationStatus, Review, Notification, NotificationType } from './types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '9876543210',
    address: '123 Tech Lane, Silicon Valley',
    password: 'user123',
    idType: 'AADHAR',
    idProofUrl: 'https://picsum.photos/seed/id1/400/250',
    verificationStatus: VerificationStatus.APPROVED,
    role: UserRole.USER,
    createdAt: '2023-10-01'
  },
  {
    id: 'u2',
    name: 'Admin User',
    email: 'admin@electro.com',
    mobile: '0000000000',
    address: 'HQ, Gadget Hub',
    password: 'admin123',
    verificationStatus: VerificationStatus.APPROVED,
    role: UserRole.ADMIN,
    createdAt: '2023-01-01'
  },
  {
    id: 'u3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    mobile: '9123456789',
    address: '456 Circuit St, Bangalore',
    password: 'user123',
    idType: 'PAN',
    idProofUrl: 'https://picsum.photos/seed/id2/400/250',
    verificationStatus: VerificationStatus.PENDING,
    role: UserRole.USER,
    createdAt: '2023-11-20'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    title: 'iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, customizable Action button.',
    specs: {
      'Display': '6.7-inch OLED',
      'Processor': 'A17 Pro',
      'RAM': '8GB',
      'Storage': '256GB',
      'Camera': '48MP Main'
    },
    basePrice: 159900,
    discountPercentage: 5,
    stock: 12,
    images: ['https://picsum.photos/seed/iphone/800/600', 'https://picsum.photos/seed/iphone2/800/600'],
    isBiddable: false,
    category: 'Mobiles',
    brand: 'Apple',
    condition: 'NEW'
  },
  {
    id: 'p2',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Integrated S Pen, 200MP camera, AI features.',
    specs: {
      'Display': '6.8-inch QHD+',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Storage': '512GB',
      'Battery': '5000mAh'
    },
    basePrice: 129900,
    discountPercentage: 10,
    stock: 5,
    images: ['https://picsum.photos/seed/samsung/800/600', 'https://picsum.photos/seed/samsung2/800/600'],
    isBiddable: true,
    category: 'Mobiles',
    brand: 'Samsung',
    condition: 'NEW'
  },
  {
    id: 'p3',
    title: 'MacBook Pro M3 Max',
    description: 'The most advanced chips ever built for a personal computer.',
    specs: {
      'Display': '14.2-inch Liquid Retina',
      'Processor': 'M3 Max 14-core',
      'RAM': '36GB',
      'Storage': '1TB SSD'
    },
    basePrice: 319900,
    discountPercentage: 0,
    stock: 8,
    images: ['https://picsum.photos/seed/macbook/800/600'],
    isBiddable: true,
    category: 'Laptops',
    brand: 'Apple',
    condition: 'NEW'
  },
  {
    id: 'p4',
    title: 'Pixel 7 Pro (Refurbished)',
    description: 'Lightly used, certified by our expert technical team. Perfect working condition.',
    specs: {
      'Display': '6.7-inch LTPO OLED',
      'Processor': 'Google Tensor G2',
      'RAM': '12GB',
      'Condition': 'Refurbished - Grade A'
    },
    basePrice: 45000,
    discountPercentage: 15,
    stock: 2,
    images: ['https://picsum.photos/seed/pixel/800/600'],
    isBiddable: false,
    category: 'Mobiles',
    brand: 'Google',
    condition: 'RESELLER'
  }
];

export const mockAuctions: Auction[] = [
  {
    id: 'a1',
    productId: 'p2',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() + 86400000).toISOString(),
    currentHighestBid: 115000,
    reservePrice: 110000,
    status: 'ACTIVE',
    bids: [
      { id: 'b1', auctionId: 'a1', userId: 'u1', userName: 'John Doe', amount: 115000, timestamp: new Date().toISOString() }
    ]
  },
  {
    id: 'a2',
    productId: 'p3',
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() + 172800000).toISOString(),
    currentHighestBid: 280000,
    reservePrice: 270000,
    status: 'ACTIVE',
    bids: []
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u3',
    userName: 'Jane Smith',
    rating: 5,
    comment: 'Absolutely love the new titanium finish! The camera is unreal.',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u1',
    userName: 'John Doe',
    rating: 4,
    comment: 'Great phone, but expensive. Battery life is solid though.',
    timestamp: new Date(Date.now() - 172800000).toISOString()
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'New Bid Placed',
    message: 'A new bid was placed on your watched Samsung Galaxy S24 Ultra.',
    type: NotificationType.NEW_BID,
    read: false,
    timestamp: new Date().toISOString()
  },
  {
    id: 'n2',
    userId: 'ADMIN',
    title: 'Pending Verification',
    message: 'Jane Smith has uploaded documents for verification.',
    type: NotificationType.PENDING_VERIFICATION,
    read: false,
    timestamp: new Date().toISOString(),
    link: '/admin'
  }
];
