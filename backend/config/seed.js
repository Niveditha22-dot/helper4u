require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Helper = require('../models/Helper');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Complaint = require('../models/Complaint');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected for seeding...');
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([User.deleteMany(), Helper.deleteMany(), Booking.deleteMany(), Review.deleteMany(), Complaint.deleteMany()]);
  console.log('Cleared existing data');

  // Create users
  const adminUser = await User.create({ name: 'Admin', email: 'admin@helper4u.com', password: 'admin123', role: 'admin' });
  const user1 = await User.create({ name: 'Arjun Mehta', email: 'arjun@email.com', password: 'user123', role: 'user', phone: '9876543210', location: 'Indiranagar, Bengaluru' });
  const user2 = await User.create({ name: 'Preethi Iyer', email: 'preethi@email.com', password: 'user123', role: 'user', phone: '9876543211', location: 'Whitefield, Bengaluru' });

  const helperUser1 = await User.create({ name: 'Priya Sharma', email: 'priya@email.com', password: 'helper123', role: 'helper', phone: '9876543212' });
  const helperUser2 = await User.create({ name: 'Kavitha Rao', email: 'kavitha@email.com', password: 'helper123', role: 'helper', phone: '9876543213' });
  const helperUser3 = await User.create({ name: 'Meena Pillai', email: 'meena@email.com', password: 'helper123', role: 'helper', phone: '9876543214' });
  const helperUser4 = await User.create({ name: 'Rekha Nair', email: 'rekha@email.com', password: 'helper123', role: 'helper', phone: '9876543215' });

  // Create helper profiles
  const helper1 = await Helper.create({
    user: helperUser1._id, serviceType: 'Maid', experience: 5, bio: 'Experienced maid with 5+ years in Bengaluru. Specialise in deep cleaning and cooking.',
    skills: ['Deep Cleaning', 'Cooking', 'Laundry', 'Ironing'], location: 'Indiranagar', city: 'Bengaluru',
    isVerified: true, verificationStatus: 'approved',
    availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], timeFrom: '08:00', timeTo: '18:00' },
    plans: { hourly: 150, monthly: 8000, yearly: 88000 }, rating: 4.8, totalReviews: 42, totalJobs: 12,
  });

  const helper2 = await Helper.create({
    user: helperUser2._id, serviceType: 'Nanny', experience: 8, bio: 'Certified nanny with 8 years experience. Expert in infant and toddler care.',
    skills: ['Infant Care', 'Homework Help', 'First Aid', 'Child Development'], location: 'Koramangala', city: 'Bengaluru',
    isVerified: true, verificationStatus: 'approved',
    availability: { days: ['Mon', 'Wed', 'Fri', 'Sat'], timeFrom: '07:00', timeTo: '20:00' },
    plans: { hourly: 200, monthly: 10000, yearly: 110000 }, rating: 4.9, totalReviews: 61, totalJobs: 28,
  });

  const helper3 = await Helper.create({
    user: helperUser3._id, serviceType: 'Maid', experience: 10, bio: 'Versatile maid with a decade of experience across Bengaluru households.',
    skills: ['Cleaning', 'Cooking', 'Ironing', 'Gardening'], location: 'Whitefield', city: 'Bengaluru',
    isVerified: true, verificationStatus: 'approved',
    availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], timeFrom: '08:00', timeTo: '17:00' },
    plans: { hourly: 180, monthly: 9500, yearly: 104500 }, rating: 4.7, totalReviews: 88, totalJobs: 45,
  });

  const helper4 = await Helper.create({
    user: helperUser4._id, serviceType: 'Nanny', experience: 6, bio: 'Child development specialist with 6 years of nanny experience.',
    skills: ['Child Development', 'Teaching', 'Swimming', 'First Aid'], location: 'JP Nagar', city: 'Bengaluru',
    isVerified: false, verificationStatus: 'pending',
    availability: { days: ['Mon', 'Tue', 'Thu', 'Fri'], timeFrom: '09:00', timeTo: '19:00' },
    plans: { hourly: 190, monthly: 9800, yearly: 107800 }, rating: 0, totalReviews: 0, totalJobs: 0,
  });

  // Create bookings
  const booking1 = await Booking.create({
    user: user1._id, helper: helper1._id, servicePlan: 'monthly', serviceType: 'Maid',
    startDate: new Date('2026-04-01'), amount: 8000, status: 'active',
  });
  const booking2 = await Booking.create({
    user: user1._id, helper: helper2._id, servicePlan: 'hourly', serviceType: 'Nanny',
    startDate: new Date('2026-04-10'), hoursPerDay: 3, amount: 600, status: 'active',
  });
  const booking3 = await Booking.create({
    user: user2._id, helper: helper3._id, servicePlan: 'yearly', serviceType: 'Maid',
    startDate: new Date('2026-01-01'), amount: 104500, status: 'active',
  });
  const booking4 = await Booking.create({
    user: user1._id, helper: helper1._id, servicePlan: 'hourly', serviceType: 'Maid',
    startDate: new Date('2026-03-10'), hoursPerDay: 2, amount: 300, status: 'completed',
    isReviewed: true,
  });

  await Review.create({ booking: booking4._id, user: user1._id, helper: helper1._id, rating: 5, comment: 'Excellent work, very thorough cleaning!' });
  await Complaint.create({ user: user2._id, helper: helper4._id, issue: 'Late arrival', description: 'Was 45 minutes late without notice', status: 'open' });

  console.log('\n✅ Seed complete! Login credentials:');
  console.log('  Admin  → admin@helper4u.com / admin123');
  console.log('  User   → arjun@email.com / user123');
  console.log('  Helper → priya@email.com / helper123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
