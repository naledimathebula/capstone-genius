/**
 * seed.js – database seeder
 *
 * Creates demo user accounts and a set of sample accommodation listings
 * across multiple cities. Skips records that already exist so it is safe
 * to run multiple times.
 *
 * Usage:
 *   npm run seed
 *
 * Credentials created:
 *   user   john@example.com  / password123
 *   host   jane@example.com  / password321
 *   admin  admin@example.com / admin1234
 */

require('dotenv').config();
const mongoose      = require('mongoose');
const User          = require('./models/User');
const Accommodation = require('./models/Accommodation');

// ── Demo users ────────────────────────────────────────────────
const USERS = [
  { username: 'John Doe',  email: 'john@example.com',  password: 'password123', role: 'user'  },
  { username: 'Jane Doe',  email: 'jane@example.com',  password: 'password321', role: 'host'  },
  { username: 'Admin',     email: 'admin@example.com', password: 'admin1234',   role: 'admin' },
];

// ── Sample listings (host is set at runtime to jane's _id) ────
const LISTINGS = [
  {
    title:       'Modern Apartment in New York',
    location:    'New York',
    description: 'Stay in the heart of New York City in this stylish, fully-equipped apartment. Walking distance to Central Park, Times Square, and the best restaurants the city has to offer.',
    type:        'Entire apartment',
    bedrooms: 2, bathrooms: 2, guests: 4,
    amenities:   ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Washer'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    ],
    price: 320, weeklyDiscount: 10, cleaningFee: 50, serviceFee: 45, occupancyTaxes: 30,
    rating: 4.8, reviews: 320,
    specificRatings: { cleanliness: 4.9, communication: 4.8, checkIn: 4.9, accuracy: 4.7, location: 5.0, value: 4.6 },
    enhancedCleaning: true, selfCheckIn: true,
  },
  {
    title:       'Cosy Studio in New York',
    location:    'New York',
    description: 'A compact but beautifully decorated studio in Brooklyn with easy subway access to Manhattan. Perfect for solo travellers or couples exploring the city.',
    type:        'Private room',
    bedrooms: 1, bathrooms: 1, guests: 2,
    amenities:   ['WiFi', 'Kitchen', 'Air conditioning'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
      'https://images.unsplash.com/photo-1556784344-ad913b7c1af0?w=800&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
      'https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=800&q=80',
    ],
    price: 140, weeklyDiscount: 5, cleaningFee: 25, serviceFee: 20, occupancyTaxes: 15,
    rating: 4.5, reviews: 187,
    specificRatings: { cleanliness: 4.6, communication: 4.7, checkIn: 4.8, accuracy: 4.5, location: 4.9, value: 4.4 },
    enhancedCleaning: false, selfCheckIn: true,
  },
  {
    title:       'Beachfront Villa in Cape Town',
    location:    'Cape Town',
    description: 'Wake up to stunning ocean views from this spacious villa in Camps Bay. Infinity pool, private braai area, and direct beach access make this the ultimate South African getaway.',
    type:        'Entire villa',
    bedrooms: 4, bathrooms: 3, guests: 8,
    amenities:   ['WiFi', 'Pool', 'BBQ grill', 'Kitchen', 'Free parking', 'Beach access'],
    images: [
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    ],
    price: 580, weeklyDiscount: 15, cleaningFee: 120, serviceFee: 80, occupancyTaxes: 50,
    rating: 4.9, reviews: 94,
    specificRatings: { cleanliness: 5.0, communication: 4.9, checkIn: 4.8, accuracy: 4.9, location: 5.0, value: 4.7 },
    enhancedCleaning: true, selfCheckIn: false,
  },
  {
    title:       'Trendy Apartment in Cape Town',
    location:    'Cape Town',
    description: 'Stylish loft in the vibrant De Waterkant neighbourhood. Surrounded by boutique shops, cafés, and the V&A Waterfront. Table Mountain is visible from the balcony.',
    type:        'Entire apartment',
    bedrooms: 1, bathrooms: 1, guests: 2,
    amenities:   ['WiFi', 'Kitchen', 'Gym', 'Air conditioning'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1537726235470-8504e3beef77?w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
      'https://images.unsplash.com/photo-1533779183510-8748d0e468df?w=800&q=80',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
    ],
    price: 210, weeklyDiscount: 8, cleaningFee: 35, serviceFee: 30, occupancyTaxes: 20,
    rating: 4.7, reviews: 213,
    specificRatings: { cleanliness: 4.8, communication: 4.7, checkIn: 4.9, accuracy: 4.6, location: 4.8, value: 4.5 },
    enhancedCleaning: true, selfCheckIn: true,
  },
  {
    title:       'Romantic Studio near Eiffel Tower',
    location:    'Paris',
    description: 'Charming Haussmann-style studio on the Left Bank, just minutes from the Eiffel Tower and Champ de Mars. High ceilings, parquet floors, and quintessentially Parisian décor.',
    type:        'Entire apartment',
    bedrooms: 1, bathrooms: 1, guests: 2,
    amenities:   ['WiFi', 'Kitchen', 'Elevator', 'Air conditioning'],
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1458862445-31525a92f571?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    ],
    price: 195, weeklyDiscount: 7, cleaningFee: 40, serviceFee: 28, occupancyTaxes: 18,
    rating: 4.8, reviews: 412,
    specificRatings: { cleanliness: 4.9, communication: 4.9, checkIn: 4.7, accuracy: 4.8, location: 5.0, value: 4.6 },
    enhancedCleaning: false, selfCheckIn: true,
  },
  {
    title:       'Spacious Family Home in Paris',
    location:    'Paris',
    description: 'A beautifully restored Marais townhouse ideal for families or groups. Private courtyard garden, fully-equipped kitchen, and original period features throughout.',
    type:        'Entire house',
    bedrooms: 3, bathrooms: 2, guests: 6,
    amenities:   ['WiFi', 'Kitchen', 'Garden', 'Washer', 'Dishwasher'],
    images: [
      'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=800&q=80',
      'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    ],
    price: 380, weeklyDiscount: 12, cleaningFee: 80, serviceFee: 55, occupancyTaxes: 35,
    rating: 4.7, reviews: 156,
    specificRatings: { cleanliness: 4.8, communication: 4.7, checkIn: 4.6, accuracy: 4.7, location: 4.9, value: 4.5 },
    enhancedCleaning: true, selfCheckIn: false,
  },
  {
    title:       'Modern Condo in Tokyo',
    location:    'Tokyo',
    description: 'Sleek, high-floor apartment in Shinjuku with panoramic city views. A 3-minute walk to the metro puts you at Shibuya, Harajuku, and Akihabara in under 15 minutes.',
    type:        'Entire apartment',
    bedrooms: 1, bathrooms: 1, guests: 2,
    amenities:   ['WiFi', 'Kitchen', 'Washer', 'Air conditioning', 'City view'],
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80',
      'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80',
      'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',
      'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80',
    ],
    price: 145, weeklyDiscount: 5, cleaningFee: 30, serviceFee: 20, occupancyTaxes: 12,
    rating: 4.9, reviews: 528,
    specificRatings: { cleanliness: 5.0, communication: 4.9, checkIn: 5.0, accuracy: 4.9, location: 5.0, value: 4.8 },
    enhancedCleaning: true, selfCheckIn: true,
  },
  {
    title:       'Traditional Ryokan in Tokyo',
    location:    'Tokyo',
    description: 'Experience authentic Japanese hospitality in this beautifully preserved ryokan in Asakusa. Tatami rooms, futon bedding, yukata robes, and a communal onsen included.',
    type:        'Entire place',
    bedrooms: 2, bathrooms: 1, guests: 4,
    amenities:   ['WiFi', 'Onsen', 'Yukata robes', 'Traditional breakfast'],
    images: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
      'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800&q=80',
      'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80',
    ],
    price: 220, weeklyDiscount: 10, cleaningFee: 45, serviceFee: 30, occupancyTaxes: 18,
    rating: 4.8, reviews: 301,
    specificRatings: { cleanliness: 4.9, communication: 4.8, checkIn: 4.7, accuracy: 4.8, location: 4.9, value: 4.6 },
    enhancedCleaning: true, selfCheckIn: false,
  },
  {
    title:       'Luxury Penthouse in Dubai',
    location:    'Dubai',
    description: 'Floor-to-ceiling glass walls with views over the Burj Khalifa and the Dubai Fountain. Private rooftop terrace, concierge service, and a private pool.',
    type:        'Entire apartment',
    bedrooms: 3, bathrooms: 3, guests: 6,
    amenities:   ['WiFi', 'Private pool', 'Concierge', 'Gym', 'Rooftop terrace', 'Air conditioning'],
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&q=80',
    ],
    price: 850, weeklyDiscount: 15, cleaningFee: 200, serviceFee: 120, occupancyTaxes: 80,
    rating: 4.9, reviews: 77,
    specificRatings: { cleanliness: 5.0, communication: 4.9, checkIn: 4.8, accuracy: 4.9, location: 5.0, value: 4.7 },
    enhancedCleaning: true, selfCheckIn: false,
  },
  {
    title:       'Charming Flat in London',
    location:    'London',
    description: 'A cosy Victorian flat in Notting Hill, steps from Portobello Road Market and Hyde Park. Original fireplaces, exposed brick, and a fully-equipped kitchen.',
    type:        'Entire apartment',
    bedrooms: 2, bathrooms: 1, guests: 4,
    amenities:   ['WiFi', 'Kitchen', 'Washer', 'Fireplace'],
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    price: 230, weeklyDiscount: 8, cleaningFee: 45, serviceFee: 35, occupancyTaxes: 25,
    rating: 4.7, reviews: 268,
    specificRatings: { cleanliness: 4.8, communication: 4.7, checkIn: 4.8, accuracy: 4.7, location: 4.9, value: 4.5 },
    enhancedCleaning: false, selfCheckIn: true,
  },
];

// ── Seeder ────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding…\n');

    // Create users (skip if email already exists)
    for (const u of USERS) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`  ↷ Skipping ${u.email} (already exists)`);
        continue;
      }
      await User.create(u);
      console.log(`  ✓ Created ${u.role.padEnd(6)} ${u.email}  /  ${u.password}`);
    }

    // Seed listings owned by jane (the demo host)
    const host = await User.findOne({ email: 'jane@example.com' });
    if (!host) {
      console.error('\n✗ Host user not found — cannot seed listings.');
      process.exit(1);
    }

    console.log('\nSeeding listings…');
    for (const listing of LISTINGS) {
      const existing = await Accommodation.findOne({ title: listing.title });
      if (existing) {
        console.log(`  ↷ Skipping "${listing.title}" (already exists)`);
        continue;
      }
      await Accommodation.create({ ...listing, host: host._id });
      console.log(`  ✓ Created "${listing.title}" (${listing.location})`);
    }

    console.log('\n── Seeding complete ─────────────────────────────');
    console.log('Login credentials:');
    USERS.forEach((u) =>
      console.log(`  ${u.role.padEnd(6)}  ${u.email.padEnd(26)} ${u.password}`)
    );
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
