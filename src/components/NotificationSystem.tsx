import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface NotificationSystemProps {
  onNewBooking: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ onNewBooking }) => {
  const [lastBookingCount, setLastBookingCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkForNewBookings = async () => {
      try {
        const { data } = await supabase.functions.invoke('get-bookings');
        const currentCount = data?.bookings?.length || 0;
        
        if (lastBookingCount > 0 && currentCount > lastBookingCount) {
          // New booking detected
          setShowAlert(true);
          playNotificationSound();
          onNewBooking();
          
          setTimeout(() => setShowAlert(false), 5000);
        }
        
        setLastBookingCount(currentCount);
      } catch (error) {
        console.error('Error checking bookings:', error);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkForNewBookings, 30000);
    checkForNewBookings(); // Initial check

    return () => clearInterval(interval);
  }, [lastBookingCount, onNewBooking]);

  const playNotificationSound = () => {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">New Booking Received!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;