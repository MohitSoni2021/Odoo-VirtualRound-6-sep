// Dummy product and featured product data for local display
// Shape matches ProductCard expectations

export const dummyProducts = [
  {
    _id: 'p1',
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound with active noise cancellation and 30h battery life.',
    price: 129.99,
    stock_quantity: 24,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1518444082560-6f6fefc2b2d0?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'p2',
    title: 'Smart Fitness Watch',
    description: 'Track workouts, heart rate, sleep, and more with bright AMOLED display.',
    price: 89.0,
    stock_quantity: 40,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'p3',
    title: 'Ergonomic Office Chair',
    description: 'Lumbar support, breathable mesh, adjustable height and tilt.',
    price: 179.5,
    stock_quantity: 12,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'p4',
    title: 'Mechanical Keyboard (RGB)',
    description: 'Hot-swappable switches, compact layout, per-key RGB backlight.',
    price: 69.99,
    stock_quantity: 0,
    status: 'out of stock',
    images: [{ url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'p5',
    title: '4K Ultra HD Monitor 27"',
    description: 'Crisp 4K resolution with HDR and 99% sRGB coverage.',
    price: 299.99,
    stock_quantity: 8,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'p6',
    title: 'Portable Bluetooth Speaker',
    description: 'Water-resistant, deep bass, 12h playtime for outdoor fun.',
    price: 39.99,
    stock_quantity: 61,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'p7',
    title: 'USB-C Hub (8-in-1)',
    description: 'HDMI 4K, SD/TF, Ethernet, 3x USB-A, PD charging.',
    price: 49.99,
    stock_quantity: 27,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'p8',
    title: 'Noise-Isolating Earbuds',
    description: 'Clear mids, punchy bass, with in-line mic and controls.',
    price: 19.99,
    stock_quantity: 100,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop' }]
  }
];

export const featuredDummyProducts = [
  {
    _id: 'fp1',
    title: 'Premium Leather Backpack',
    description: 'Minimal design, 15-inch laptop sleeve, water-resistant.',
    price: 119.0,
    stock_quantity: 15,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1511389026070-a14ae610a1ae?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'fp2',
    title: 'Smart Home Speaker',
    description: 'Voice assistant built-in, room-filling 360° audio.',
    price: 59.0,
    stock_quantity: 35,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1543490791-db972e0f3e39?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'fp3',
    title: 'Studio Over-Ear Headphones',
    description: 'Reference sound for creators and audiophiles.',
    price: 149.99,
    stock_quantity: 20,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1518441902112-f9be6a4af84f?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    _id: 'fp4',
    title: 'Wireless Charging Stand',
    description: 'Fast charge, nightstand-friendly angle, soft LED.',
    price: 29.99,
    stock_quantity: 50,
    status: 'available',
    images: [{ url: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=1200&auto=format&fit=crop' }]
  }
];

export default { dummyProducts, featuredDummyProducts };