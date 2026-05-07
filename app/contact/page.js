import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CONTACT,
  COMPANY_NAME,
  SITE_URL,
} from "../lib/seo";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Zain Gym Technicians for gym design, gym setup, equipment supply, and full project consultation across Pakistan.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${COMPANY_NAME} Contact`,
    url: `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: COMPANY_NAME,
      email: BUSINESS_CONTACT.email,
      telephone: BUSINESS_CONTACT.phone,
      address: {
        "@type": "PostalAddress",
        ...BUSINESS_ADDRESS,
      },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <Contact />
      <Footer />
    </main>
  );
}
