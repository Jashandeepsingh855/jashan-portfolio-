"use client";

import type { Service } from "@/lib/data";
import {
  DEFAULT_SERVICES,
  VerticalTabs,
  type ServiceItem,
} from "@/components/ui/vertical-tabs";

const SERVICE_IMAGE_BY_ID: Record<string, string> = {
  "short-form-retention": DEFAULT_SERVICES[0].image,
  "youtube-storytelling": DEFAULT_SERVICES[1].image,
  "color-grading-aces": DEFAULT_SERVICES[2].image,
  "sound-design-mixing": DEFAULT_SERVICES[3].image,
};

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const mappedServices: ServiceItem[] =
    services.length > 0
      ? services.map((service, index) => ({
          id: service.number || String(index + 1).padStart(2, "0"),
          title: service.title,
          description: service.description,
          image:
            service.image ||
            SERVICE_IMAGE_BY_ID[service.id] ||
            DEFAULT_SERVICES[index % DEFAULT_SERVICES.length].image,
        }))
      : DEFAULT_SERVICES;

  return <VerticalTabs id="services" services={mappedServices} />;
}
