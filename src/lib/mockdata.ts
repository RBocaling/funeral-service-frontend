export const mockProviders = [
  {
    id: 1,
    username: "eternalrest",
    email: "contact@eternalrest.ph",
    password: "",
    fullName: "Eternal Rest Funeral Services",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Eternal Rest Funeral Services",
    location: "Bacoor, Cavite",
    rating: 4.9,
    reviewCount: 156,
    bookingCount: 235,
    priceRange: {
      min: 1500000,
      max: 3500000,
    },
    allowsCustomCasket: true,
    hasFlowerOptions: true,
    hasMemorialRoom: true,
    profileBio:
      "Serving families with compassion and dignity for over 25 years. We offer comprehensive funeral services with customizable options to honor your loved ones.",
  },
  {
    id: 2,
    username: "serenepassage",
    email: "care@serenepassage.ph",
    password: "",
    fullName: "Serene Passage Memorial",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Serene Passage Memorial",
    location: "Dasmariñas, Cavite",
    rating: 4.7,
    reviewCount: 98,
    bookingCount: 187,
    priceRange: {
      min: 1200000,
      max: 2800000,
    },
    allowsCustomCasket: true,
    hasFlowerOptions: true,
    hasMemorialRoom: false,
    profileBio:
      "Providing respectful funeral arrangements with a focus on personalized services and eco-friendly options. Our compassionate team helps you create meaningful memorials.",
  },
  {
    id: 3,
    username: "gracefuljourney",
    email: "support@gracefuljourney.ph",
    password: "",
    fullName: "Graceful Journey Funerals",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Graceful Journey Funerals",
    location: "Imus, Cavite",
    rating: 4.8,
    reviewCount: 124,
    bookingCount: 210,
    priceRange: {
      min: 1800000,
      max: 4000000,
    },
    allowsCustomCasket: false,
    hasFlowerOptions: true,
    hasMemorialRoom: true,
    profileBio:
      "A modern approach to funeral services, combining traditional respect with contemporary memorialization options. We offer beautiful venues and exceptional customer service.",
  },
  {
    id: 4,
    username: "peacefulrepose",
    email: "info@peacefulrepose.ph",
    password: "",
    fullName: "Peaceful Repose Services",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Peaceful Repose Services",
    location: "General Trias, Cavite",
    rating: 4.6,
    reviewCount: 87,
    bookingCount: 165,
    priceRange: {
      min: 1000000,
      max: 2500000,
    },
    allowsCustomCasket: true,
    hasFlowerOptions: false,
    hasMemorialRoom: false,
    profileBio:
      "Affordable and dignified funeral services with a focus on casket customization. We help families create meaningful farewells without financial burden.",
  },
  {
    id: 5,
    username: "heavensgate",
    email: "service@heavensgate.ph",
    password: "",
    fullName: "Heaven's Gate Memorial",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Heaven's Gate Memorial",
    location: "Tagaytay, Cavite",
    rating: 4.9,
    reviewCount: 143,
    bookingCount: 245,
    priceRange: {
      min: 2000000,
      max: 5000000,
    },
    allowsCustomCasket: true,
    hasFlowerOptions: true,
    hasMemorialRoom: true,
    profileBio:
      "Premium funeral services with scenic memorial spaces in Tagaytay. Our luxurious facilities and attentive staff ensure a perfect tribute to your loved ones.",
  },
  {
    id: 6,
    username: "sacredmemories",
    email: "help@sacredmemories.ph",
    password: "",
    fullName: "Sacred Memories Funeral Home",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Sacred Memories Funeral Home",
    location: "Silang, Cavite",
    rating: 4.5,
    reviewCount: 76,
    bookingCount: 142,
    priceRange: {
      min: 1300000,
      max: 2700000,
    },
    allowsCustomCasket: false,
    hasFlowerOptions: true,
    hasMemorialRoom: true,
    profileBio:
      "Traditional funeral services with a focus on religious and cultural practices. We respect diverse traditions and provide specialized ceremonies for all faiths.",
  },
  {
    id: 7,
    username: "sacredmemories",
    email: "help@sacredmemories.ph",
    password: "",
    fullName: "Premium Memories Funeral Home",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Sacred Memories Funeral Home",
    location: "Silang, Cavite",
    rating: 4.5,
    reviewCount: 76,
    bookingCount: 142,
    priceRange: {
      min: 7000000,
      max: 1000000,
    },
    allowsCustomCasket: false,
    hasFlowerOptions: true,
    hasMemorialRoom: true,
    profileBio:
      "Traditional funeral services with a focus on religious and cultural practices. We respect diverse traditions and provide specialized ceremonies for all faiths.",
  },
  {
    id: 8,
    username: "sacredmemories",
    email: "help@sacredmemories.ph",
    password: "",
    fullName: "Uniqe Memories Funeral Home",
    userType: "provider",
    profileComplete: true,
    createdAt: new Date(),
    businessName: "Sacred Memories Funeral Home",
    location: "Silang, Cavite",
    rating: 4.5,
    reviewCount: 76,
    bookingCount: 142,
    priceRange: {
      min: 2500000,
      max: 5000000,
    },
    allowsCustomCasket: false,
    hasFlowerOptions: true,
    hasMemorialRoom: true,
    profileBio:
      "Traditional funeral services with a focus on religious and cultural practices. We respect diverse traditions and provide specialized ceremonies for all faiths.",
  },
];


// /messag
import { Chat, Message } from "./types";

export const messages: Message[] = [
  {
    id: "1",
    content: "Hey there! How are you doing?",
    sender: {
      name: "Alice Cooper",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "2024-03-20T09:00:00Z",
    isOwn: false,
    chatId: "1",
  },
  {
    id: "2",
    content: "I'm doing great! Just finished working on that new project.",
    sender: {
      name: "You",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "2024-03-20T09:01:00Z",
    isOwn: true,
    chatId: "1",
  },
  {
    id: "3",
    content:
      "That's awesome! Would love to see it sometime. How about we catch up over coffee?",
    sender: {
      name: "Alice Cooper",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "2024-03-20T09:02:00Z",
    isOwn: false,
    chatId: "1",
  },
  {
    id: "4",
    content: "Sounds perfect! How about tomorrow afternoon?",
    sender: {
      name: "You",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "2024-03-20T09:03:00Z",
    isOwn: true,
    chatId: "1",
  },
  {
    id: "5",
    content: "Can you review the project documentation?",
    sender: {
      name: "Bob Wilson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "2024-03-20T08:45:00Z",
    isOwn: false,
    chatId: "2",
  },
  {
    id: "6",
    content: "Thanks for your help yesterday!",
    sender: {
      name: "Carol Smith",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "2024-03-19T18:30:00Z",
    isOwn: false,
    chatId: "3",
  },
];

export const chats: Chat[] = [
  {
    id: "1",
    name: "Alice Cooper",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    lastMessage:
      "That's awesome! Would love to see it sometime. How about we catch up over coffee?",
    timestamp: "2024-03-20T09:02:00Z",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Bob Wilson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    lastMessage: "Let me know when you're free to discuss the project",
    timestamp: "2024-03-20T08:45:00Z",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Carol Smith",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    lastMessage: "Thanks for your help yesterday!",
    timestamp: "2024-03-19T18:30:00Z",
    unread: 1,
    online: true,
  },
];

// booking
export const bookings = [
  {
    id: 1,
    deceasedName: "Sarah Johnson",
    customerName: "Michael Johnson",
    customerEmail: "michael.johnson@email.com",
    customerPhone: "+1 (555) 123-4567",
    location: "Grace Memorial Chapel",
    date: "March 15, 2025",
    time: "10:00 AM",
    attendees: 120,
    status: "Confirmed",
    services: {
      casket: "Premium Mahogany",
      flowers: "White Lilies & Roses",
      memorial: "Digital Memorial Service",
    },
    additionalNotes:
      "Family requests privacy during the service. Digital memorial link will be shared with attendees.",
    totalPrice: 8500,
    image:
      "https://media.istockphoto.com/id/1447462464/photo/close-up-of-person-in-black-praying-at-outdoor-funeral.jpg?s=612x612&w=0&k=20&c=NQWKq6W8KemPyFuV9gtiPo7md4vskgiF1l5iQfj1MlU=",
  },
  {
    id: 2,
    deceasedName: "Robert Wilson",
    customerName: "Emily Wilson",
    customerEmail: "emily.wilson@email.com",
    customerPhone: "+1 (555) 234-5678",
    location: "Eternal Peace Cemetery",
    date: "March 16, 2025",
    time: "2:30 PM",
    attendees: 80,
    status: "Pending",
    services: {
      casket: "Classic Oak",
      flowers: "Mixed Seasonal Bouquet",
      memorial: "Traditional Service",
    },
    additionalNotes:
      "Please arrange for live music during the service. Family prefers classical compositions.",
    totalPrice: 6800,
    image:
      "https://honeywell.scene7.com/is/image/honeywell/hon-corp-commercial-buildings-tab6",
  },
  {
    id: 3,
    deceasedName: "Maria Rodriguez",
    customerName: "Carlos Rodriguez",
    customerEmail: "carlos.rodriguez@email.com",
    customerPhone: "+1 (555) 345-6789",
    location: "Sacred Heart Church",
    date: "March 17, 2025",
    time: "11:15 AM",
    attendees: 150,
    status: "Confirmed",
    services: {
      casket: "Silver Steel",
      flowers: "Red & White Roses",
      memorial: "Hybrid Service",
    },
    additionalNotes:
      "Bilingual service requested. Please ensure all materials are available in both English and Spanish.",
    totalPrice: 7200,
    image:
      "https://images.unsplash.com/photo-1490122417551-6ee9691429d0?auto=format&fit=crop&q=80&w=1000",
  },
];







// payment
import { PaymentMethod } from '@/types/payment';

export const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    paymentInfoImageUrl: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg',
    paymentName: 'GCash',
    paymentType: 'e-wallet',
    paymentNumber: '0917-454-5-3456',
  },
  {
    id: '2',
    paymentInfoImageUrl: 'https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg',
    paymentName: 'BDO',
    paymentType: 'bank',
    paymentNumber: '1234-454-5-7890',
  },
  {
    id: '3',
    paymentInfoImageUrl: 'https://images.pexels.com/photos/6289028/pexels-photo-6289028.jpeg',
    paymentName: 'PayMaya',
    paymentType: 'e-wallet',
    paymentNumber: '0918-454-5-5678',
  },
  {
    id: '4',
    paymentInfoImageUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg',
    paymentName: 'BPI',
    paymentType: 'bank',
    paymentNumber: '0853-767-765476',
  },
  {
    id: '5',
    paymentInfoImageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
    paymentName: 'Visa',
    paymentType: 'credit-card',
    paymentNumber: '4123-454-5-8765',
  },
  {
    id: '6',
    paymentInfoImageUrl: 'https://images.pexels.com/photos/6289151/pexels-photo-6289151.jpeg',
    paymentName: 'Metrobank',
    paymentType: 'bank',
    paymentNumber: '1290-454-5-3421',
  }
];