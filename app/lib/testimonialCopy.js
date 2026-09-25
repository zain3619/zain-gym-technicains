/**
 * Short client quotes — mix of English and Roman English (one language per review).
 */
export const TESTIMONIAL_COPY = {
  "Hamza Ali": {
    rating: 5,
    text: "They built our gym from scratch — clean work, on time, and better than we imagined.",
  },
  "Sarah Khan": {
    rating: 5,
    text: "Equipment ki quality zabardast hai. Members roz farq feel karte hain. Highly recommended.",
  },
  "Imran Butt": {
    rating: 5,
    text: "After-sales support is excellent. They actually care after the sale is done.",
  },
  "Zeeshan Ahmed": {
    rating: 5,
    text: "Pakistan mein sab se tez delivery aur installation. Launch day pe zero tension.",
  },
  "Maria Malik": {
    rating: 5,
    text: "Their 3D plan showed us every zone before we spent a rupee. Saved us time and money.",
  },
  "Omar Sheikh": {
    rating: 5,
    text: "Machines do saal se nearly 24/7 chal rahi hain — bilkul solid durability.",
  },
  "Ali Raza": {
    rating: 5,
    text: "Professional team, quick replies, and a smooth setup from start to finish.",
  },
  "Sana Javed": {
    rating: 5,
    text: "Ladies gym ke liye layout aur equipment bilkul perfect mile. Members bohot khush hain.",
  },
  "Farhan Shah": {
    rating: 5,
    text: "Premium finish and a modern look. Members keep complimenting the new club.",
  },
  "Kamran Akmal": {
    rating: 5,
    text: "Sach mein value for money. Itni quality is price pe kahin aur mushkil hai.",
  },
};

export function enrichTestimonial(item, idx = 0) {
  const name = item.name || "Client Partner";
  const copy = TESTIMONIAL_COPY[name] || {};
  return {
    id: item._id || idx,
    name,
    role: item.role || "Satisfied Gym Owner",
    text: copy.text || item.text || "",
    rating: Math.min(5, Math.max(1, Number(copy.rating || item.rating) || 5)),
    imageUrl: item.imageUrl || "",
  };
}
