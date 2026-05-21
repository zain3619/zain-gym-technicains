require("dotenv").config();
const mongoose = require("mongoose");
const Testimonial = require("./models/Testimonial");

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://qaiserzain08_db_user:NwRzlCVFiNJYVO8G@cluster0.lc4spdt.mongodb.net/";

const testimonialsToSeed = [
  { name: "Hamza Ali", role: "CEO, Alpha Fitness", text: "They built our gym from scratch and the results exceeded our expectations. Highly professional team!", rating: 5, imageUrl: "https://picsum.photos/200/200?random=1" },
  { name: "Sarah Khan", role: "Owner, Fit Studio", text: "Best equipment quality and amazing features provided by them. Highly recommended!", rating: 5, imageUrl: "https://picsum.photos/200/200?random=2" },
  { name: "Imran Butt", role: "Director, Powerhouse Gym", text: "Their support and maintenance service is exceptional. They truly care about their clients.", rating: 5, imageUrl: "https://picsum.photos/200/200?random=3" },
  { name: "Zeeshan Ahmed", role: "Manager, Iron Paradise", text: "Fastest delivery and installation I've ever seen in Pakistan. Great experience!", rating: 5, imageUrl: "https://picsum.photos/200/200?random=4" },
  { name: "Maria Malik", role: "Founder, Bloom Fitness", text: "The 3D design planning helped us visualize our space perfectly before buying equipment.", rating: 5, imageUrl: "https://picsum.photos/200/200?random=5" },
  { name: "Omar Sheikh", role: "Owner, Muscle Factory", text: "Top-notch durability. Our machines are running 24/7 without any issues for 2 years.", rating: 5, imageUrl: "https://picsum.photos/200/200?random=6" },
  { name: "Ali Raza", role: "CEO, Elite Gym", text: "Professional staff and very responsive support team. Five stars!", rating: 5, imageUrl: "https://picsum.photos/200/200?random=7" },
  { name: "Sana Javed", role: "Owner, Ladies First Gym", text: "The customized ladies-specific equipment is exactly what we needed.", rating: 5, imageUrl: "https://picsum.photos/200/200?random=8" },
  { name: "Farhan Shah", role: "Director, Gold's Club", text: "Premium finish and modern aesthetics. Our clients love the new setup.", rating: 5, imageUrl: "https://picsum.photos/200/200?random=9" },
  { name: "Kamran Akmal", role: "Owner, Active Life", text: "Value for money. You won't find this quality at this price range anywhere else.", rating: 5, imageUrl: "https://picsum.photos/200/200?random=10" }
];

const seedTestimonials = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    console.log("Seeding testimonials...");
    for (const t of testimonialsToSeed) {
      const exists = await Testimonial.findOne({ name: t.name, role: t.role });
      if (!exists) {
        await Testimonial.create(t);
        console.log(`Successfully seeded testimonial from: ${t.name}`);
      } else {
        console.log(`Testimonial from ${t.name} already exists. Skipping.`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed testimonials:", error);
    process.exit(1);
  }
};

seedTestimonials();
