
import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface DynamicEventBackgroundProps {
  category: string;
  eventName: string;
}

const DynamicEventBackground: React.FC<DynamicEventBackgroundProps> = ({ category, eventName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getBackgroundImages = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'music':
        return [
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ];
      case 'tech':
      case 'technology':
      case 'education':
        return [
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ];
      case 'cultural':
        return [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ];
      case 'outdoor':
      case 'sports':
        return [
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ];
      default:
        return [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ];
    }
  };

  const images = getBackgroundImages(category);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const getOverlayEffect = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'music':
        return 'bg-gradient-to-br from-purple-900/70 via-pink-900/60 to-blue-900/70 animate-pulse';
      case 'tech':
      case 'technology':
      case 'education':
        return 'bg-gradient-to-br from-green-900/60 via-blue-900/50 to-gray-900/60';
      case 'cultural':
        return 'bg-gradient-to-br from-orange-900/60 via-red-900/50 to-yellow-900/60';
      case 'outdoor':
      case 'sports':
        return 'bg-gradient-to-br from-green-900/60 via-teal-900/50 to-blue-900/60';
      default:
        return 'bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60';
    }
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="relative w-full h-[400px]">
              <img 
                src={image} 
                alt={`${eventName} background ${index + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
              <div className={`absolute inset-0 ${getOverlayEffect(category)}`} />
              
              {/* Animated effects for music events */}
              {category?.toLowerCase() === 'music' && (
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-70"></div>
                  <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
                  <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-50"></div>
                </div>
              )}
              
              {/* Terminal effect for tech events */}
              {(category?.toLowerCase() === 'tech' || category?.toLowerCase() === 'technology' || category?.toLowerCase() === 'education') && (
                <div className="absolute inset-0 bg-black/30">
                  <div className="absolute top-4 left-4 font-mono text-green-400 text-sm opacity-70">
                    <div className="animate-pulse">$ npm start</div>
                    <div className="animate-pulse delay-500">Server running on port 3000...</div>
                    <div className="animate-pulse delay-1000">✓ Compilation successful</div>
                  </div>
                  <div className="absolute bottom-4 right-4 w-2 h-4 bg-green-400 animate-pulse"></div>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  );
};

export default DynamicEventBackground;
