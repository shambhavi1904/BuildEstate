import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactInfoItem from './InfoItem';

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    content: "+91 9482573948",
    link: "tel:+919482573948",
  },
  {
    icon: Mail,
    title: "Email",
    content: "asbhat821@gmail.com",
    link: "mailto:asbhat821@gmail.com",
  },
  {
    icon: MapPin,
    title: "Location",
    content: "Bengaluru, Karnataka, India",
  },
  {
    icon: Clock,
    title: "Working Hours",
    content: "Monday - Saturday | 9:00 AM - 6:00 PM",
  },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-2xl shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-8">
        Contact Information
      </h2>
      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <ContactInfoItem key={index} {...info} />
        ))}
      </div>
    </motion.div>
  );
}