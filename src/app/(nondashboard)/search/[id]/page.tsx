"use client";

import { useGetAuthUserQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import ApplicationModal from "./ApplicationModal";
import ContactWidget from "./ContactWidget";
import ImagePreview from "./ImagePreview";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import PropertyOverview from "./PropertyOverview";

export default function SinglePropertyPage() {
  const { id } = useParams();
  const propertyId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: authUser } = useGetAuthUserQuery();

  return (
    <div>
      <ImagePreview images={["/singleListing-2.jpg", "/singleListing-3.jpg"]} />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
}
