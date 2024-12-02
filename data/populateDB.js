const dotenv = require('dotenv');
const mongoose = require("mongoose");
dotenv.config();
console.log(process.env.MONGO_URL);

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URL}`);

// Models
const Company = mongoose.model("Company", new mongoose.Schema({
  name: String,
  location: String,
  linkedIn: String,
  emails: [String],
  phoneNumbers: [String],
  comments: String,
  periodicity: String,
}));

const CommunicationMethod = mongoose.model("CommunicationMethod", new mongoose.Schema({
  name: String,
  description: String,
  sequence: Number,
  mandatory: Boolean
}));

// Communication Model
const Communication = mongoose.model("Communication", new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  type: { type: mongoose.Schema.Types.ObjectId, ref: "CommunicationMethod" },
  date: Date,
  notes: String,
}));

// Notification Model
const Notification = mongoose.model("Notification", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  communication: { type: mongoose.Schema.Types.ObjectId, ref: "Communication" },
  type: String, // 'overdue' or 'due today'
  message: String,
}));

// Seed Data
const seedData = async () => {
  await Company.deleteMany();
  await CommunicationMethod.deleteMany();
  await Communication.deleteMany();
  await Notification.deleteMany();

  const companies = [
    {
      name: "Tech Corp",
      location: "San Francisco",
      linkedIn: "https://linkedin.com/company/techcorp",
      emails: ["contact@techcorp.com"],
      phoneNumbers: ["+1 123 456 7890"],
      comments: "Top-tier client.",
      periodicity: "2 weeks",
    },
    {
      name: "Innovate Inc",
      location: "New York",
      linkedIn: "https://linkedin.com/company/innovateinc",
      emails: ["info@innovateinc.com"],
      phoneNumbers: ["+1 987 654 3210"],
      comments: "Promising partnership.",
      periodicity: "1 month",
    },
  ];

  const createdCompanies = await Company.insertMany(companies);

  const communications = [
    { name: 'LinkedIn Post', description: 'Post on LinkedIn', sequence: 1, mandatory: true },
    { name: 'LinkedIn Message', description: 'Direct LinkedIn message', sequence: 2, mandatory: true },
    { name: 'Email', description: 'Send an email', sequence: 3, mandatory: true },
    { name: 'Phone Call', description: 'Make a phone call', sequence: 4, mandatory: false },
    { name: 'Other', description: 'Any other communication', sequence: 5, mandatory: false },
  ];

  const createdMethods = await CommunicationMethod.insertMany(communications);

  // Adding communications for companies
  const communicationEntries = [
    {
      company: createdCompanies[0]._id,
      type: createdMethods[0]._id, // LinkedIn Post
      date: new Date('2024-12-02'),
      notes: "Initial introduction on LinkedIn."
    },
    {
      company: createdCompanies[0]._id,
      type: createdMethods[2]._id, // Email
      date: new Date('2024-11-30'),
      notes: "Follow-up email sent to Tech Corp."
    },
    {
      company: createdCompanies[0]._id,
      type: createdMethods[3]._id,
      date: new Date('2024-11-29'),
      notes: "Call to Tech Corp."
    },
    {
      company: createdCompanies[1]._id,
      type: createdMethods[1]._id, // LinkedIn Message
      date: new Date('2024-11-28'),
      notes: "Direct message to Innovate Inc on LinkedIn."
    },
    {
      company: createdCompanies[1]._id,
      type: createdMethods[2]._id,
      date: new Date('2024-12-01'),
      notes: "Email to Innovate In."
    },
    {
      company: createdCompanies[1]._id,
      type: createdMethods[0]._id, // LinkedIn Message
      date: new Date('2024-12-02'),
      notes: "Introduction to Innovate In."
    },
    {
      company: createdCompanies[1]._id,
      type: createdMethods[3]._id, // Phone Call
      date: new Date('2024-12-03'),
      notes: "Phone call to discuss partnership terms."
    }
  ];

  await Communication.insertMany(communicationEntries);

  // Adding notifications for overdue or due communications
  const notifications = [
    {
      user: new mongoose.Types.ObjectId("6748460ea8ccd99f8fae3010"),  // Replace with actual user ID
      company: createdCompanies[0]._id,
      communication: communicationEntries[0]._id, // LinkedIn Post for Tech Corp
      type: 'overdue',
      message: 'Tech Corp LinkedIn Post communication is overdue.'
    },
    {
      user: new mongoose.Types.ObjectId("6748460ea8ccd99f8fae3010"),  // Replace with actual user ID
      company: createdCompanies[0]._id,
      communication: communicationEntries[1]._id, // LinkedIn Post for Tech Corp
      type: 'due today',
      message: 'Task X is due today.'
    },
    {
      user: new mongoose.Types.ObjectId("6748460ea8ccd99f8fae3010"),  // Replace with actual user ID
      company: createdCompanies[0]._id,
      communication: communicationEntries[2]._id, // LinkedIn Post for Tech Corp
      type: 'due today',
      message: 'Task Y is due today.'
    },
    {
      user: new mongoose.Types.ObjectId("67484f7b1ebb59a6291f394d"),  // Replace with actual user ID
      company: createdCompanies[1]._id,
      communication: communicationEntries[2]._id, // LinkedIn Message for Innovate Inc
      type: 'due today',
      message: 'Today is the due date for LinkedIn Message to Innovate Inc.'
    },
    {
      user: new mongoose.Types.ObjectId("67484f7b1ebb59a6291f394d"),  // Replace with actual user ID
      company: createdCompanies[1]._id,
      communication: communicationEntries[2]._id, // LinkedIn Message for Innovate Inc
      type: 'overdue',
      message: 'Overdue work for Innovate Inc.'
    },
    {
      user: new mongoose.Types.ObjectId("67484f7b1ebb59a6291f394d"),  // Replace with actual user ID
      company: createdCompanies[1]._id,
      communication: communicationEntries[2]._id, // LinkedIn Message for Innovate Inc
      type: 'due today',
      message: 'LinkedIn Post due today.'
    },
  ];

  await Notification.insertMany(notifications);

  console.log("\n\nSeed data added successfully!");
  mongoose.connection.close();
};

seedData();
