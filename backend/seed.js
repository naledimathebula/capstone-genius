// Seeds the database with test accounts (and one sample listing) so you can
// log in immediately without manually POSTing to /api/users/register.
// Run with: npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');

const users = [
  { username: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
  { username: 'Jane Doe', email: 'jane@example.com', password: 'password321', role: 'host' },
  { username: 'Admin', email: 'admin@example.com', password: 'admin1234', role: 'admin' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`Skipping ${u.email} (already exists)`);
        continue;
      }
      await User.create(u);
      console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
    }

    const host = await User.findOne({ email: 'jane@example.com' });
    const existingListing = await Accommodation.findOne({ title: 'Modern Apartment in New York' });
    if (!existingListing && host) {
      await Accommodation.create({
        title: 'Modern Apartment in New York',
        location: 'New York',
        description: 'Stay in the heart of New York City...',
        type: 'Entire apartment',
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        amenities: ['wifi', 'kitchen', 'free parking'],
        images: [
          '/images/new-york-lady-of-liberty.jpg',
          '/images/new-york-lady-of-liberty.jpg',
          '/images/new-york-lady-of-liberty.jpg',
          '/images/new-york-lady-of-liberty.jpg',
          '/images/new-york-lady-of-liberty.jpg',
        ],
        price: 320,
        weeklyDiscount: 0,
        cleaningFee: 50,
        serviceFee: 50,
        occupancyTaxes: 30,
        rating: 4.5,
        reviews: 320,
        specificRatings: {
          cleanliness: 4.8,
          communication: 4.7,
          checkIn: 4.9,
          accuracy: 4.6,
          location: 4.9,
          value: 4.5,
        },
        enhancedCleaning: true,
        selfCheckIn: true,
        host: host._id,
      });
      console.log('Created sample listing: Modern Apartment in New York');
    }

    console.log('\nSeeding complete. Login credentials:');
    users.forEach((u) => console.log(`  ${u.role.padEnd(6)} ${u.email} / ${u.password}`));

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
