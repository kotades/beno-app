'use client';

import { useState } from 'react';
import BookingEngineModal from '@/components/BookingEngineModal';

interface ReserveButtonProps {
  serviceName: string;
  category: string;
  price: number;
  serviceId?: string;
  image?: string;
  className?: string;
}

export default function ReserveButton({
  serviceName,
  category,
  price,
  serviceId,
  image,
  className = 'w-full bg-[#008B9B] hover:bg-[#007684] text-white py-4 rounded-2xl font-bold text-sm text-center block transition-all shadow-lg active:scale-95'
}: ReserveButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        Reserve {serviceName} Now
      </button>
      <BookingEngineModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        serviceName={serviceName}
        category={category}
        price={price}
        serviceId={serviceId}
        image={image}
      />
    </>
  );
}
