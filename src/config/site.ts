// constants/data.ts
import { FALLBACK_URLS } from '@/constants/image-fallbacks';

export const SITE_CONFIG = {
    name: "Elite Venue",
    supportPhone: "+91 9999 000 000",
    supportEmail: "care@elitevenue.com",
    address: "Noble Enclave, Gali No. 6, Palam Vihar, Gurugram",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Elite+Venue+PG+Noble+Enclave+Gurugram",
    embedMapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.7015917203125!2d77.0599493751981!3d28.498641790148678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19b594b925dd%3A0xaffb386a875523bf!2sThe%20Elite%20Venue%20PG!5e1!3m2!1sen!2sin!4v1768628276779!5m2!1sen!2sin`
};

export const CITIES = [
    {
        id: "ggn",
        name: "Gurugram",
        description: "The Millenium City, home to Fortune 500 companies.",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=800",
        fallbackImage: FALLBACK_URLS.city,
        propertyCount: 12
    },
    {
        id: "noida",
        name: "Noida",
        description: "The tech hub of UP with seamless connectivity.",
        image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=80&w=800",
        fallbackImage: FALLBACK_URLS.city,
        propertyCount: 8
    },
    {
        id: "blr",
        name: "Bangalore",
        description: "The Silicon Valley of India with vibrant lifestyle.",
        image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800",
        fallbackImage: FALLBACK_URLS.city,
        propertyCount: 15
    },
    {
        id: "pune",
        name: "Pune",
        description: "The Oxford of the East.",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
        fallbackImage: FALLBACK_URLS.city,
        propertyCount: 5
    }
];

export const NEIGHBOURHOODS = [
  {
    name: "Noble Enclave",
    city: "Gurugram",
    count: "4 Homes",
    image: "https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=800",
    fallbackImage: FALLBACK_URLS.neighbourhood,
    span: "lg:col-span-2 lg:row-span-1" 
  },
  {
    name: "Palam Vihar",
    city: "Gurugram",
    count: "3 Homes",
    image: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800",
    fallbackImage: FALLBACK_URLS.neighbourhood,
    span: "lg:col-span-1"
  },
  {
    name: "Sector 62",
    city: "Noida",
    count: "5 Homes",
    image: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800",
    fallbackImage: FALLBACK_URLS.neighbourhood,
    span: "lg:col-span-1"
  },
  {
    name: "Cyber City",
    city: "Gurugram",
    count: "2 Homes",
    image: "http://googleusercontent.com/image_collection/image_retrieval/440347170568885002_0",
    fallbackImage: FALLBACK_URLS.neighbourhood,
    span: "lg:col-span-2"
  },
];

export const TRUST_IMAGES = {
    community: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    room: "https://images.unsplash.com/photo-1596276122653-679c5c42bb9a?auto=format&fit=crop&q=80&w=600",
    work: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600",
};

export const REVIEWS = [
    {
        name: "Rahul Sharma",
        role: "Software Engineer at Google",
        text: "The best PG experience in Gurugram. The food quality is amazing and the cleaning staff is very regular. Highly recommended!",
        avatar: "https://i.pravatar.cc/150?u=1",
        categories: ["experience", "food", "cleanliness"],
    },
    {
        name: "Sneha Kapoor",
        role: "Data Analyst at Zomato",
        text: "I've stayed in many PGs, but the sense of community here is unmatched. The high-speed WiFi is perfect for my WFH days.",
        avatar: "https://i.pravatar.cc/150?u=2",
        categories: ["experience", "community", "amenities"],
    },
    {
        name: "Vikram Mehra",
        role: "UX Designer",
        text: "Extremely spacious rooms and very secure. The biometric entry gives me peace of mind coming back late from work.",
        avatar: "https://i.pravatar.cc/150?u=3",
        categories: ["safety", "space", "security"],
    },
    {
        name: "Ananya Iyer",
        role: "Marketing Specialist",
        text: "The support staff is so responsive. Any issue I raise is fixed within 24 hours. The North Indian food tastes just like home!",
        avatar: "https://i.pravatar.cc/150?u=4",
        categories: ["support", "food", "management"],
    },
    {
        name: "Priyam Priya",
        role: "Student",
        text: "My stay at The Elite Venue PG was a truly wonderful experience. The owner is extremely kind, supportive, and approachable, making the place feel just like home.",
        avatar: "https://i.pravatar.cc/150?u=5",
        categories: ["experience", "community", "environment"],
    },
];

export const FAQS = [
    {
        id: "faq-1",
        question: "Is there a security deposit?",
        answer: "Yes, we typically require a 1-month security deposit which is fully refundable at the time of move-out."
    },
    {
        id: "faq-2",
        question: "What are the check-in formalities?",
        answer: "You need a valid Govt ID (Aadhar/Passport) and a permanent address proof. The process is fully digital via our app."
    },
    {
        id: "faq-3",
        question: "Is there a notice period?",
        answer: "We require a 30-day notice period before vacating the premises to ensure a smooth security deposit refund."
    }
];

export const PROMISES_IMAGES = {
    food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000",
    cleanliness: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000",
    customer: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000",
    safety: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1000",
    space: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000",
};

export const EVENTS = [
    { title: "Christmas Celebration", location: "Noble Enclave", date: "Dec 2025", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop" },
    { title: "Holi Fest", location: "Sector 62", date: "March 2025", image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?q=80&w=800&auto=format&fit=crop" },
    { title: "New Year Party", location: "Palam Vihar", date: "Jan 2026", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop" },
];