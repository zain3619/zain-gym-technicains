import Navbar from "./components/navbar";
import Hero from "./components/hero";
import About from "./components/about";
import Services from "./components/services";
import Equipment from "./components/equipment";
import Process from "./components/process";
import Projects from "./components/projects";
import Team from "./components/team";
import Testimonials from "./components/testimonials";
import Footer from "./components/Footer";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CONTACT,
  BUSINESS_SERVICES,
  COMPANY_NAME,
  DEFAULT_DESCRIPTION,
  SITE_URL,
} from "./lib/seo";

export const metadata = {
  title: "Gym Designers, Gym Builders and Fitness Equipment Suppliers",
  description: DEFAULT_DESCRIPTION,
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: COMPANY_NAME,
        url: SITE_URL,
        image:
          "https://www.hussle.com/blog/wp-content/uploads/2020/12/Gym-structure-1080x675.png",
        description: DEFAULT_DESCRIPTION,
        email: BUSINESS_CONTACT.email,
        telephone: BUSINESS_CONTACT.phone,
        address: {
          "@type": "PostalAddress",
          ...BUSINESS_ADDRESS,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 31.5204,
          longitude: 74.3315,
        },
        areaServed: [
          { "@type": "City", name: "Lahore" },
          { "@type": "Country", name: "Pakistan" },
        ],
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#services`,
        serviceType: "Gym design, build, and setup services",
        provider: {
          "@id": `${SITE_URL}/#business`,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Gym services",
          itemListElement: BUSINESS_SERVICES.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service,
            },
          })),
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Equipment />
      <Process />
      <Projects />
      <Team />
      <Testimonials />
      <Footer />
    </main>
  );
}
