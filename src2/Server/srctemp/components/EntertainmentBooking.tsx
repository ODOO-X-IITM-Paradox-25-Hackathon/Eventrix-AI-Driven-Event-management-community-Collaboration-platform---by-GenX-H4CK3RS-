import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, Star, MapPin, Phone, Mail, Clock, Calendar, 
  Users, Ticket, Filter, Heart, CreditCard, Crown
} from "lucide-react";
import { initializeRazorpayPayment } from "../services/razorpayService";
import { T } from "../hooks/useTranslation";

interface EntertainmentEvent {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  featured: boolean;
  duration?: string;
  timing?: string;
  capacity?: number;
}

const EntertainmentBooking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<{[key: string]: 'idle' | 'processing' | 'completed' | 'failed'}>({});
  const { toast } = useToast();

  // Generate random INR prices for entertainment events
  const getRandomPrice = (basePrice: number) => {
    const multipliers = [299, 399, 499, 599, 799, 999, 1299, 1599, 1999, 2499, 2999, 3499, 3999, 4999];
    return multipliers[Math.floor(Math.random() * multipliers.length)];
  };

  const entertainmentEvents: EntertainmentEvent[] = [
    {
      id: "ent1",
      title: "VGP Universal Kingdom",
      type: "amusement",
      description: "Experience thrilling rides, roller coasters, and family fun at Chennai's premier amusement park.",
      location: "East Coast Road, Injambakkam, Chennai",
      phone: "+91 44 2449 0444",
      email: "info@vgpuniversalkingdom.com",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.3,
      featured: true,
      duration: "Full Day",
      timing: "10:00 AM - 8:00 PM",
      capacity: 5000
    },
    {
      id: "ent2",
      title: "MGM Dizzee World",
      type: "amusement",
      description: "Enjoy a variety of rides, water games, and attractions suitable for all ages.",
      location: "1/74, East Coast Road, Muttukadu, Chennai",
      phone: "+91 44 2747 2129",
      email: "info@mgmdizzeeworld.com",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.1,
      featured: false,
      duration: "Full Day",
      timing: "10:30 AM - 6:30 PM",
      capacity: 4000
    },
    {
      id: "ent3",
      title: "Queensland",
      type: "amusement",
      description: "Discover a wide range of thrilling rides and attractions in a sprawling amusement park.",
      location: "Chennai-Bangalore Trunk Road, Palanjur, Chennai",
      phone: "+91 44 2681 1111",
      email: "info@queensland.in",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.0,
      featured: false,
      duration: "Full Day",
      timing: "10:00 AM - 6:00 PM",
      capacity: 4500
    },
    {
      id: "ent4",
      title: "Snow Kingdom",
      type: "snow",
      description: "Experience the magic of snow with various snow-themed attractions and activities.",
      location: "VGP Snow Kingdom, East Coast Road, Injambakkam, Chennai",
      phone: "+91 44 2449 0004",
      email: "info@vgpsnowkingdom.com",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.2,
      featured: true,
      duration: "2-3 Hours",
      timing: "10:00 AM - 8:00 PM",
      capacity: 500
    },
    {
      id: "ent5",
      title: "Birla Planetarium",
      type: "science",
      description: "Explore the wonders of the universe with captivating shows and exhibits.",
      location: "Gandhi Mandapam Road, Kotturpuram, Chennai",
      phone: "+91 44 2446 6660",
      email: "planetarium@birla.com",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.4,
      featured: false,
      duration: "2-3 Hours",
      timing: "10:30 AM - 5:30 PM",
      capacity: 200
    },
    {
      id: "ent6",
      title: "Government Museum Chennai",
      type: "cultural",
      description: "Discover a rich collection of art, archaeology, numismatics, and more.",
      location: "Pantheon Road, Egmore, Chennai",
      phone: "+91 44 2819 3238",
      email: "museumchennai@tn.gov.in",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.5,
      featured: false,
      duration: "3-4 Hours",
      timing: "9:30 AM - 5:00 PM",
      capacity: 300
    },
    {
      id: "ent7",
      title: "Arignar Anna Zoological Park",
      type: "wildlife",
      description: "Observe a diverse range of animals in a naturalistic setting.",
      location: "Grand Southern Trunk Road, Vandalur, Chennai",
      phone: "+91 44 2275 1089",
      email: "zoovandalur@gmail.com",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.2,
      featured: false,
      duration: "Full Day",
      timing: "9:00 AM - 5:00 PM",
      capacity: 1000
    },
    {
      id: "ent8",
      title: "DakshinaChitra",
      type: "cultural",
      description: "Explore the art, architecture, and lifestyle of South India.",
      location: "East Coast Road, Muttukadu, Chennai",
      phone: "+91 44 2747 2603",
      email: "dakshinachitra@gmail.com",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.3,
      featured: false,
      duration: "3-4 Hours",
      timing: "10:00 AM - 6:00 PM",
      capacity: 250
    },
    {
      id: "ent9",
      title: "Semmozhi Poonga",
      type: "garden",
      description: "Relax in a serene botanical garden with a variety of plants and flowers.",
      location: "Cathedral Road, Teynampet, Chennai",
      phone: "+91 44 2826 8822",
      email: "semmozhipoonga@tn.gov.in",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.1,
      featured: false,
      duration: "2-3 Hours",
      timing: "10:00 AM - 7:30 PM",
      capacity: 300
    },
    {
      id: "ent10",
      title: "Adventure Zone",
      type: "adventure",
      description: "Engage in thrilling adventure activities like rock climbing and zip-lining.",
      location: "Old Mahabalipuram Road, Chennai",
      phone: "+91 98400 00000",
      email: "info@adventurezone.com",
      image: "/placeholder.svg",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.0,
      featured: false,
      duration: "4-5 Hours",
      timing: "9:00 AM - 6:00 PM",
      capacity: 150
    },

    // Shows & Entertainment
    {
      id: "show1",
      title: "Nirman Pillai Comedy Show",
      type: "comedy",
      description: "Experience the hilarious world of Nirman Pillai's comedy with his unique style and witty humor.",
      location: "Music Academy, Alwarpet, Chennai",
      phone: "+91 44 2811 2231",
      email: "bookings@musicacademy.in",
      image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.8,
      featured: true,
      duration: "2 Hours",
      timing: "7:00 PM - 9:00 PM",
      capacity: 300
    },
    {
      id: "show2",
      title: "Dr. Pal's Adventures in Gastronomy",
      type: "comedy",
      description: "Join Dr. Pal for a hilarious journey through food science and comical culinary views.",
      location: "Kamani Auditorium, Nungambakkam, Chennai",
      phone: "+91 44 2833 4455",
      email: "events@kamaniauditorium.com",
      image: "https://images.unsplash.com/photo-1588737052971-b7b03bb4b0a3?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.6,
      featured: false,
      duration: "1.5 Hours",
      timing: "6:30 PM - 8:00 PM",
      capacity: 250
    },
    {
      id: "show3",
      title: "Stage Comedy Extravaganza",
      type: "comedy",
      description: "Non-stop laughter with Chennai's best stand-up comedians performing back-to-back.",
      location: "Phoenix MarketCity, Velachery, Chennai",
      phone: "+91 44 4224 4000",
      email: "events@phoenixmarketcity.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.5,
      featured: false,
      duration: "3 Hours",
      timing: "7:00 PM - 10:00 PM",
      capacity: 400
    },

    // Theatre Shows
    {
      id: "theatre1",
      title: "Classical Tamil Theatre",
      type: "theatre",
      description: "Traditional Tamil drama showcasing rich cultural heritage and classical storytelling.",
      location: "Bharatiya Vidya Bhavan, Mylapore, Chennai",
      phone: "+91 44 2493 7711",
      email: "info@bvbchennai.org",
      image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.7,
      featured: true,
      duration: "2.5 Hours",
      timing: "6:00 PM - 8:30 PM",
      capacity: 200
    },
    {
      id: "theatre2",
      title: "Modern Drama Festival",
      type: "theatre",
      description: "Contemporary plays featuring social themes and modern storytelling techniques.",
      location: "Museum Theatre, Egmore, Chennai",
      phone: "+91 44 2819 3238",
      email: "theatre@museumchennai.com",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.4,
      featured: false,
      duration: "2 Hours",
      timing: "7:30 PM - 9:30 PM",
      capacity: 150
    },

    // Kids Shows
    {
      id: "kids1",
      title: "Magic Wonderland for Kids",
      type: "kids",
      description: "Magical shows filled with wonder, puppets, and interactive entertainment for children.",
      location: "Express Avenue Mall, Royapettah, Chennai",
      phone: "+91 44 4224 6000",
      email: "events@expressavenue.in",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.9,
      featured: true,
      duration: "1 Hour",
      timing: "4:00 PM - 5:00 PM",
      capacity: 100
    },
    {
      id: "kids2",
      title: "Carnival Fun Zone",
      type: "carnival",
      description: "Complete carnival experience with games, rides, food stalls, and entertainment for the whole family.",
      location: "Island Grounds, Chennai",
      phone: "+91 44 2852 2345",
      email: "info@islandgrounds.com",
      image: "https://images.unsplash.com/photo-1544306094-7b9cd082b2c1?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.6,
      featured: false,
      duration: "Full Day",
      timing: "10:00 AM - 10:00 PM",
      capacity: 2000
    },

    // Movie Screenings
    {
      id: "movie1",
      title: "Classic Movie Night",
      type: "movie",
      description: "Nostalgic movie screenings featuring classic Tamil and Hindi films in premium ambiance.",
      location: "Sathyam Cinemas, Royapettah, Chennai",
      phone: "+91 44 4224 4224",
      email: "bookings@sathyamcinemas.com",
      image: "https://images.unsplash.com/photo-1489599809927-48ef22b1172b?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.3,
      featured: false,
      duration: "3 Hours",
      timing: "7:00 PM - 10:00 PM",
      capacity: 300
    },

    // Spas & Wellness
    {
      id: "spa1",
      title: "Ayurvedic Spa Experience",
      type: "spa",
      description: "Rejuvenating Ayurvedic treatments and traditional massage therapies for complete relaxation.",
      location: "The Leela Palace, Adyar, Chennai",
      phone: "+91 44 3366 1234",
      email: "spa@theleela.com",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.8,
      featured: true,
      duration: "2 Hours",
      timing: "10:00 AM - 8:00 PM",
      capacity: 20
    },

    // Dining Experiences
    {
      id: "dining1",
      title: "Rooftop Candlelight Dinner",
      type: "dining",
      description: "Romantic candlelight dinner experience with city views and gourmet cuisine.",
      location: "Hyatt Regency, Anna Salai, Chennai",
      phone: "+91 44 6123 1234",
      email: "dining@hyattchennai.com",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.7,
      featured: true,
      duration: "2 Hours",
      timing: "7:00 PM - 10:00 PM",
      capacity: 50
    },
    {
      id: "dining2",
      title: "Restaurant Candlelight Experience",
      type: "dining",
      description: "Intimate dining experience with live music and specially curated multi-cuisine menu.",
      location: "The Park Hotel, Nungambakkam, Chennai",
      phone: "+91 44 4267 6000",
      email: "dining@theparkchennai.com",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.5,
      featured: false,
      duration: "2.5 Hours",
      timing: "7:30 PM - 10:00 PM",
      capacity: 80
    },

    // Water Activities
    {
      id: "water1",
      title: "Swimming Pool Membership",
      type: "swimming",
      description: "Premium swimming pool access with professional coaching and aqua fitness programs.",
      location: "Chennai Gymkhana Club, Anna Salai, Chennai",
      phone: "+91 44 2852 4251",
      email: "membership@chennaigymkhana.com",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.4,
      featured: false,
      duration: "Monthly",
      timing: "6:00 AM - 10:00 PM",
      capacity: 100
    },
    {
      id: "water2",
      title: "Water Rides Adventure",
      type: "water-rides",
      description: "Thrilling water slides, wave pools, and aqua adventures for all age groups.",
      location: "Kishkinta Theme Park, Chennai",
      phone: "+91 44 2745 1001",
      email: "info@kishkinta.com",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.6,
      featured: true,
      duration: "Full Day",
      timing: "10:00 AM - 6:00 PM",
      capacity: 1000
    },

    // Adventure Rides
    {
      id: "rides1",
      title: "Roller Coaster Rides",
      type: "roller-coaster",
      description: "Heart-pumping roller coaster experiences with multiple thrilling tracks and loops.",
      location: "Wonderla Amusement Park, Chennai",
      phone: "+91 44 7154 5454",
      email: "chennai@wonderla.com",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.8,
      featured: true,
      duration: "Full Day",
      timing: "11:00 AM - 7:00 PM",
      capacity: 3000
    },
    {
      id: "rides2",
      title: "Thunderland Adventures",
      type: "thunderland",
      description: "Extreme adventure park with zip-lines, rock climbing, and aerial obstacle courses.",
      location: "ECR Road, Mahabalipuram, Chennai",
      phone: "+91 98400 12345",
      email: "adventure@thunderland.com",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.5,
      featured: false,
      duration: "4 Hours",
      timing: "9:00 AM - 6:00 PM",
      capacity: 200
    },

    // Gaming & Entertainment
    {
      id: "gaming1",
      title: "Bowling Championship",
      type: "bowling",
      description: "Professional bowling alleys with tournaments, leagues, and family bowling sessions.",
      location: "Forum Vijaya Mall, Vadapalani, Chennai",
      phone: "+91 44 4224 7000",
      email: "bowling@forumvijaya.com",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.3,
      featured: false,
      duration: "2 Hours",
      timing: "10:00 AM - 11:00 PM",
      capacity: 60
    },
    {
      id: "gaming2",
      title: "Fun City Gaming Zone",
      type: "fun-city",
      description: "Ultimate gaming experience with arcade games, VR zones, and interactive entertainment.",
      location: "City Centre Mall, Mylapore, Chennai",
      phone: "+91 44 2499 9999",
      email: "games@citycentremall.com",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.4,
      featured: false,
      duration: "3 Hours",
      timing: "11:00 AM - 10:00 PM",
      capacity: 150
    },

    // Music & Dance
    {
      id: "music1",
      title: "Classical Music Concert",
      type: "music",
      description: "Soul-stirring classical music performances by renowned artists and upcoming talents.",
      location: "Music Academy, T.T.K. Road, Chennai",
      phone: "+91 44 2811 2231",
      email: "concerts@musicacademy.in",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.9,
      featured: true,
      duration: "3 Hours",
      timing: "6:30 PM - 9:30 PM",
      capacity: 500
    },
    {
      id: "dance1",
      title: "Classical Dance Festival",
      type: "dance",
      description: "Magnificent classical dance performances showcasing Bharatanatyam, Kuchipudi, and more.",
      location: "Kalakshetra Foundation, Thiruvanmiyur, Chennai",
      phone: "+91 44 2491 1169",
      email: "events@kalakshetra.in",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.8,
      featured: true,
      duration: "2.5 Hours",
      timing: "6:00 PM - 8:30 PM",
      capacity: 300
    },

    // Workshops & Learning
    {
      id: "workshop1",
      title: "Art & Culture Workshop",
      type: "workshop",
      description: "Hands-on workshops in traditional arts, crafts, and cultural activities for all ages.",
      location: "Cholamandal Artists' Village, Chennai",
      phone: "+91 44 2449 2305",
      email: "workshops@cholamandal.com",
      image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.6,
      featured: false,
      duration: "4 Hours",
      timing: "10:00 AM - 2:00 PM",
      capacity: 25
    },
    {
      id: "workshop2",
      title: "MadChef India Cooking Show",
      type: "cookery",
      description: "Interactive cooking demonstrations and competitions with celebrity chefs.",
      location: "ITC Grand Chola, Guindy, Chennai",
      phone: "+91 44 2220 0000",
      email: "culinary@itchotels.in",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.7,
      featured: false,
      duration: "3 Hours",
      timing: "2:00 PM - 5:00 PM",
      capacity: 40
    },

    // Immersive Experiences
    {
      id: "vr1",
      title: "Virtual Reality Adventure",
      type: "vr",
      description: "Cutting-edge VR experiences including space exploration, underwater adventures, and fantasy worlds.",
      location: "VR Mall, Anna Nagar, Chennai",
      phone: "+91 44 2615 5555",
      email: "experience@vrmall.com",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.5,
      featured: false,
      duration: "1 Hour",
      timing: "11:00 AM - 9:00 PM",
      capacity: 30
    },
    {
      id: "gallery1",
      title: "3D Art Gallery Experience",
      type: "3d-gallery",
      description: "Interactive 3D art installations where you become part of the artwork through optical illusions.",
      location: "Express Avenue, Royapettah, Chennai",
      phone: "+91 44 4224 6000",
      email: "gallery@expressavenue.in",
      image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.4,
      featured: false,
      duration: "1.5 Hours",
      timing: "10:00 AM - 8:00 PM",
      capacity: 50
    },
    {
      id: "show4",
      title: "12D Cinema Experience",
      type: "12d",
      description: "Revolutionary 12D cinema with motion seats, environmental effects, and immersive storytelling.",
      location: "Phoenix MarketCity, Velachery, Chennai",
      phone: "+91 44 4224 4000",
      email: "cinema@phoenixmarketcity.com",
      image: "https://images.unsplash.com/photo-1489599809927-48ef22b1172b?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.6,
      featured: true,
      duration: "30 Minutes",
      timing: "11:00 AM - 10:00 PM",
      capacity: 20
    },

    // Special Experiences
    {
      id: "special1",
      title: "Mermaid Show Spectacular",
      type: "mermaid",
      description: "Enchanting underwater mermaid performances in specially designed aquarium theaters.",
      location: "VGP Marine Kingdom, Chennai",
      phone: "+91 44 2449 0004",
      email: "shows@vgpmarine.com",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.7,
      featured: true,
      duration: "45 Minutes",
      timing: "11:00 AM - 6:00 PM",
      capacity: 100
    },
    {
      id: "cards1",
      title: "VGP Family Fun Cards",
      type: "family-cards",
      description: "Exclusive family packages with access to multiple VGP attractions and dining vouchers.",
      location: "VGP Universal Kingdom, Chennai",
      phone: "+91 44 2449 0444",
      email: "familycards@vgp.in",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c92a?auto=format&fit=crop&w=800&h=400",
      price: getRandomPrice(1),
      currency: "INR",
      rating: 4.5,
      featured: false,
      duration: "Full Day",
      timing: "10:00 AM - 8:00 PM",
      capacity: 1000
    }
  ];

  const categories = [
    "all", "amusement", "comedy", "theatre", "kids", "carnival", "movie", "spa", 
    "dining", "swimming", "water-rides", "roller-coaster", "thunderland", "bowling", 
    "fun-city", "music", "dance", "workshop", "cookery", "vr", "3d-gallery", "12d", 
    "mermaid", "family-cards"
  ];

  const handleBookEvent = (event: EntertainmentEvent) => {
    setPaymentStatus(prev => ({ ...prev, [event.id]: 'processing' }));
    
    initializeRazorpayPayment({
      amount: event.price,
      eventName: event.title,
      eventId: event.id,
      tier: 'Standard',
      onSuccess: (paymentData) => {
        console.log('Entertainment booking payment successful:', paymentData);
        setPaymentStatus(prev => ({ ...prev, [event.id]: 'completed' }));
        
        // Store booking information
        const bookingInfo = {
          eventId: event.id,
          title: event.title,
          price: event.price,
          currency: 'INR',
          bookingDate: new Date().toISOString(),
          paymentId: paymentData.paymentId
        };
        
        const entertainmentBookings = JSON.parse(localStorage.getItem('entertainmentBookings') || '[]');
        entertainmentBookings.push(bookingInfo);
        localStorage.setItem('entertainmentBookings', JSON.stringify(entertainmentBookings));
        
        toast({
          title: "Booking successful!",
          description: `Your booking for ${event.title} (₹${event.price}) has been confirmed.`,
        });
      },
      onFailure: () => {
        setPaymentStatus(prev => ({ ...prev, [event.id]: 'failed' }));
        toast({
          title: "Booking failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive"
        });
      },
      onDismiss: () => {
        setPaymentStatus(prev => ({ ...prev, [event.id]: 'idle' }));
      }
    });
  };

  const handleLike = (eventId: string) => {
    setLikedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const filteredEvents = entertainmentEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  const getCategoryDisplay = (category: string) => {
    const categoryMap = {
      "all": "🎪 All Events",
      "amusement": "🎠 Amusement Parks",
      "comedy": "😂 Comedy Shows",
      "theatre": "🎭 Theatre Shows",
      "kids": "👶 Kids Shows",
      "carnival": "🎪 Carnivals",
      "movie": "🎬 Movie Screenings",
      "spa": "💆 Spa & Wellness",
      "dining": "🍽️ Fine Dining",
      "swimming": "🏊 Swimming",
      "water-rides": "🌊 Water Rides",
      "roller-coaster": "🎢 Roller Coasters",
      "thunderland": "⚡ Adventure Parks",
      "bowling": "🎳 Bowling",
      "fun-city": "🎮 Gaming Zones",
      "music": "🎵 Music Concerts",
      "dance": "💃 Dance Shows",
      "workshop": "🎨 Workshops",
      "cookery": "👨‍🍳 Cooking Shows",
      "vr": "🥽 Virtual Reality",
      "3d-gallery": "🖼️ 3D Galleries",
      "12d": "🎬 12D Cinema",
      "mermaid": "🧜‍♀️ Mermaid Shows",
      "family-cards": "👨‍👩‍👧‍👦 Family Packages"
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              <T>Entertainment & Booking</T>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              <T>Discover amazing entertainment experiences in Chennai</T>
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <T>Today</T>
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Users className="h-4 w-4 mr-2" />
              <T>Group Booking</T>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full md:w-1/2">
              <Input
                type="text"
                placeholder="Search for entertainment events..."
                className="pl-12 h-12 bg-white/90 border-purple-200 focus:border-purple-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-3 h-6 w-6 text-purple-500" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-purple-500" />
                <select
                  className="bg-white/90 border-2 border-purple-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-purple-400"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplay(category)}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="secondary" className="bg-gradient-to-r from-orange-400 to-red-400 text-white">
                <Ticket className="h-4 w-4 mr-2" />
                <T>Special Offers</T>
              </Button>
            </div>
          </div>
          
          {/* Category Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {["comedy", "theatre", "music", "amusement", "dining", "spa"].map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`${selectedCategory === cat ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/70 text-purple-600 border-purple-200 hover:bg-purple-50'}`}
              >
                {getCategoryDisplay(cat)}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
              <Crown className="h-8 w-8 mr-3 text-yellow-500" />
              <T>Featured Entertainment</T>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="h-4 w-4 mr-1" />
                        <T>Featured</T>
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white border-0 shadow-lg">
                        ⭐ {event.rating}
                      </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                        <T>{event.title}</T>
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      <T>{event.description}</T>
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        <T>{event.location}</T>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2 text-purple-500" />
                        {event.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        {event.timing}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{event.price}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(event.id)}
                          className={`${likedEvents.includes(event.id) ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform`}
                        >
                          <Heart className={`h-5 w-5 ${likedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                        </Button>
                        
                        <Button
                          onClick={() => handleBookEvent(event)}
                          disabled={paymentStatus[event.id] === 'processing'}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all shadow-lg"
                        >
                          {paymentStatus[event.id] === 'processing' ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              <T>Processing...</T>
                            </>
                          ) : paymentStatus[event.id] === 'completed' ? (
                            <T>Booked!</T>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              <T>Book Now</T>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
            🎭 <T>All Entertainment Events</T>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:transform hover:scale-105">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-purple-500 text-white border-0 shadow-md">
                      ⭐ {event.rating}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors duration-300">
                    <T>{event.title}</T>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm">
                    <T>{event.description}</T>
                  </p>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3 mr-1 text-purple-500" />
                      <span className="truncate"><T>{event.location}</T></span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1 text-purple-500" />
                      {event.timing}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{event.price}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(event.id)}
                        className={`${likedEvents.includes(event.id) ? 'text-red-500' : 'text-gray-400'} p-2`}
                      >
                        <Heart className={`h-4 w-4 ${likedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        onClick={() => handleBookEvent(event)}
                        disabled={paymentStatus[event.id] === 'processing'}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      >
                        {paymentStatus[event.id] === 'processing' ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : paymentStatus[event.id] === 'completed' ? (
                          <T>Booked!</T>
                        ) : (
                          <>
                            <CreditCard className="h-3 w-3 mr-1" />
                            <T>Book</T>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              <T>No entertainment options found matching your criteria.</T>
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              <T>Try adjusting your search or filter settings.</T>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntertainmentBooking;
