import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Match from './models/Match.js';
import Message from './models/Message.js';

const P = [
  ['Kabir', 24, 'male', 'Software Engineer', 'Koramangala', 15000, 20000, 23, 'daily', false, false, 'never', 'Cooks on Sundays. Plays guitar softly.', 'Early bird · Dishes done same day'],
  ['Aarav', 26, 'male', 'Product Designer', 'Koramangala', 14000, 22000, 24, 'weekly', false, true, 'sometimes', 'Dog dad. Weekend hikes and filter coffee.', 'Night owl · Loves a clean kitchen'],
  ['Rohan', 25, 'male', 'Data Analyst', 'HSR Layout', 12000, 18000, 23, 'daily', false, false, 'never', 'Gym at 6 AM. Quiet evenings.', 'Gym at 6 AM · Meal prep Sundays'],
  ['Vikram', 27, 'male', 'Consultant', 'Indiranagar', 20000, 30000, 25, 'weekly', true, false, 'often', 'Always up for a plan. Travels a lot.', 'Parties at 2 AM · Dishes never'],
  ['Neha', 24, 'female', 'Marketing Associate', 'Koramangala', 15000, 20000, 23, 'daily', false, true, 'sometimes', 'Plant mom, two cats, loves baking.', 'Bakes at midnight · Very tidy'],
  ['Ananya', 25, 'female', 'UX Researcher', 'HSR Layout', 13000, 19000, 24, 'weekly', false, false, 'sometimes', 'Bookworm. Pottery on weekends.', 'Reads till 1 AM · Chai addict'],
  ['Ishita', 23, 'female', 'Chartered Accountant', 'Indiranagar', 18000, 25000, 23, 'daily', false, false, 'never', 'Early to bed, early to rise.', 'Alarm at 5:30 · Spotless desk'],
  ['Siddharth', 28, 'male', 'Startup Founder', 'Whitefield', 25000, 40000, 26, 'rarely', true, false, 'often', 'Building something big. Rarely home.', 'Works till 3 AM · Pizza boxes'],
  ['Meera', 26, 'female', 'Doctor', 'Bellandur', 15000, 22000, 22, 'daily', false, false, 'never', 'Shift work. Needs silence in the day.', 'Night shifts · Silent mornings'],
  ['Arjun', 25, 'male', 'Backend Developer', 'Koramangala', 10000, 16000, 25, 'weekly', false, true, 'sometimes', 'Gamer, cat person, will share Netflix.', 'Gaming till 2 AM · Cat named Pixel'],
  ['Zoya', 24, 'female', 'Journalist', 'Bellandur', 12000, 17000, 24, 'weekly', false, true, 'sometimes', 'Writes at odd hours. Great playlists.', 'Writes at 1 AM · Plays lo-fi'],
  ['Dev', 27, 'male', 'Chef', 'Indiranagar', 16000, 24000, 26, 'daily', true, false, 'sometimes', 'Cooks for the whole flat. Kitchen is sacred.', 'Home at 1 AM · Kitchen is sacred'],
];

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User.deleteMany({ email: /@demo\.flatmate$/ }), Match.deleteMany({}), Message.deleteMany({})]);
const password = await bcrypt.hash('demo1234', 10);

const users = await User.insertMany(P.map(([name, age, gender, occupation, area, budgetMin, budgetMax, sleepBy, cleaning, smoking, pets, partying, bio, quirk], i) => ({
  name, age, gender, occupation, area, budgetMin, budgetMax, sleepBy, cleaning, smoking, pets, partying, bio, quirk,
  email: `${name.toLowerCase()}@demo.flatmate`, password, city: 'Bengaluru', profileComplete: true,
  verification: i % 3 === 0 ? { status: 'none' } : { status: 'verified', idType: 'aadhaar', idLast4: '4821', verifiedAt: new Date() },
})));

console.log(`Seeded ${users.length} demo users (password: demo1234). Try: kabir@demo.flatmate`);
console.log('Demo users like each other only when YOU like them. Log in as two demo users in two browsers to test matching + chat.');
await mongoose.disconnect();
