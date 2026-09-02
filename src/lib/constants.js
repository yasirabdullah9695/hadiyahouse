// Central configuration for Dar-Ul-Hadaya storefront
export const WHATSAPP_NUMBER = "919669397762"; // +91 9669397762

export const ADMIN_EMAIL = "yasirsabdullah02@gmail.com";
export const ADMIN_PASSWORD = "yasir9695@";
export const ORDER_NOTIFICATION_EMAIL = "yasirsabdullah02@gmail.com";

export const LOGO_URL = "/dar_ul_hadaya_logo.png";
export const LOGO_ICON_URL = "/dar_ul_hadaya_logo.png";

export const CATEGORIES = [
  { key: "Nikah", label: "Nikah", subtitle: "For Bride & Groom", accent: "#D4C3A5" },
  { key: "Hajj", label: "Hajj", subtitle: "For Pilgrims", accent: "#1A1F2C" },
  { key: "Umrah", label: "Umrah", subtitle: "For A Blessed Journey", accent: "#4A5D4E" },
  { key: "Traveller", label: "Traveller", subtitle: "Compact & Essential", accent: "#1A1F2C" },
  { key: "Hijab Kit", label: "Hijab Kit", subtitle: "A Beautiful Start to Modesty", accent: "#7E5B5B" },
  { key: "Hifz Completion", label: "Hifz Completion", subtitle: "A Reward for Dedication", accent: "#2D4B3E" },
  { key: "Father's Gift Kit", label: "Father's Gift Kit", subtitle: "For the Man Who Taught You Everything", accent: "#2C3E2D" },
  { key: "Mother's Gift Kit", label: "Mother's Gift Kit", subtitle: "For the Queen of Your Heart", accent: "#8C676A" },
  { key: "Custom Calligraphy Frame", label: "Custom Calligraphy Frame", subtitle: "Personalised Arabic Name Art", accent: "#8B6914" },
];

export const PRODUCT_TYPES = ["Gift Box", "Individual Item", "Signature Box Item"];

export const SIGNATURE_BOX = {
  name: "Choose Your Dar-Ul-Hadaya Box",
  basePrice: 0, // Free / Included Packaging Box & Bag
  items: [
    { name: "Attar", price: 299 },
    { name: "Tasbeeh", price: 199 },
    { name: "Miswak", price: 99 },
    { name: "Topi", price: 149 },
    { name: "Watch", price: 599 },
    { name: "Wallet", price: 399 },
    { name: "Hijab Accessory", price: 249 },
    { name: "Prayer Mat", price: 499 },
    { name: "Mini Perfume", price: 349 },
    { name: "Calligraphy Frame", price: 799 },
  ],
};

export const ALL_CATEGORIES = [
  { key: "Nikah", label: "Nikah", type: "Gift Box" },
  { key: "Hajj", label: "Hajj", type: "Gift Box" },
  { key: "Umrah", label: "Umrah", type: "Gift Box" },
  { key: "Traveller", label: "Traveller", type: "Gift Box" },
  { key: "Hijab Kit", label: "Hijab Kit", type: "Gift Box" },
  { key: "Hifz Completion", label: "Hifz Completion", type: "Gift Box" },
  { key: "Father's Gift Kit", label: "Father's Gift Kit", type: "Gift Box" },
  { key: "Mother's Gift Kit", label: "Mother's Gift Kit", type: "Gift Box" },
  { key: "Custom Calligraphy Frame", label: "Custom Calligraphy Frame", type: "Gift Box" },
  { key: "Perfume & Attar", label: "Perfume & Attar", type: "Individual Item" },
  { key: "Topi", label: "Topi (Prayer Cap)", type: "Individual Item" },
  { key: "Quran", label: "Quran", type: "Individual Item" },
  { key: "Islamic Books", label: "Islamic Books", type: "Individual Item" },
  { key: "Tasbeeh", label: "Tasbeeh", type: "Individual Item" },
  { key: "Prayer Mat", label: "Prayer Mat", type: "Individual Item" },
  { key: "Miswak", label: "Miswak", type: "Individual Item" },
  { key: "Dates & Sweets", label: "Dates & Sweets", type: "Individual Item" },
  { key: "Hijab", label: "Hijab", type: "Individual Item" },
  { key: "Calligraphy Frame", label: "Calligraphy Frame", type: "Individual Item" },
  { key: "Signature Box Items", label: "Signature Box Items", type: "Signature Box Item" },
];

export function buildWhatsAppMessage(order) {
  const lines = [
    "Hello Dar-Ul-Hadaya, I would like to place an order:",
    "",
    `*Product:* ${order.product_name}`,
  ];
  if (order.product_type) lines.push(`*Type:* ${order.product_type}`);
  if (order.product_category) lines.push(`*Category:* ${order.product_category}`);
  lines.push(`*Quantity:* ${order.quantity}`);
  lines.push(`*Total:* ₹${order.total}`);
  lines.push("");
  lines.push("*Customer Details:*");
  lines.push(`Name: ${order.customer_name}`);
  if (order.customer_email) lines.push(`Email: ${order.customer_email}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push(`Address: ${order.address}`);
  if (order.notes) lines.push(`Notes: ${order.notes}`);
  return lines.join("\n");
}

export function buildOrderEmailBody(order) {
  const lines = [
    `New order received from ${order.customer_name}.`,
    "",
    "Product Details:",
    `  Product: ${order.product_name}`,
  ];
  if (order.product_type) lines.push(`  Type: ${order.product_type}`);
  if (order.product_category) lines.push(`  Category: ${order.product_category}`);
  lines.push(`  Quantity: ${order.quantity}`);
  lines.push(`  Total: ₹${order.total}`);
  lines.push("");
  lines.push("Customer Details:");
  lines.push(`  Name: ${order.customer_name}`);
  if (order.customer_email) lines.push(`  Email: ${order.customer_email}`);
  lines.push(`  Phone: ${order.phone}`);
  lines.push(`  Address: ${order.address}`);
  if (order.notes) lines.push(`  Notes: ${order.notes}`);
  return lines.join("\n");
}

export function openWhatsApp(order) {
  const message = buildWhatsAppMessage(order);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}