// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // LOCAL MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/cotton')
//   .then(() => console.log("MongoDB Connected (Local)"))
//   .catch(err => console.log(err));

// const ReportSchema = new mongoose.Schema({
//   report_id: String,
//   cotton_yarn_count: String,
//   sub_type: String,
//   bales: Array,
//   statistics: Object,
//   created_at: { type: Date, default: Date.now }
// }, { collection: 'new' });   // your local collection name

// const Report = mongoose.model('Report', ReportSchema);

// app.get('/api/reports', async (req, res) => {
//   const { cotton_yarn_count, sub_type } = req.query;

//   let query = {};
//   if (cotton_yarn_count) query.cotton_yarn_count = cotton_yarn_count;
//   if (sub_type) query.sub_type = sub_type;

//   const reports = await Report.find(query);
//   res.json(reports);
// });

// app.listen(5000, () => console.log('Server running on port 5000'));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://alapanmukherjee5570_db_user:HI24gvf7hPejsUOz@cotton-cluster.u0qnla2.mongodb.net/cotton?retryWrites=true&w=majority&authSource=admin';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
})
  .then(() => console.log("✅ MongoDB Connected (Atlas)"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// Log connection events for debugging
mongoose.connection.on('connecting', () => console.log('🔄 Connecting to MongoDB...'));
mongoose.connection.on('connected', () => console.log('🟢 Mongoose connected'));
mongoose.connection.on('error', err => console.error('🔴 Mongoose error:', err.message));
mongoose.connection.on('disconnected', () => console.log('🟡 Mongoose disconnected'));

const ReportSchema = new mongoose.Schema({
  report_id: String,
  cotton_yarn_count: String,
  sub_type: String,
  bales: Array,
  statistics: Object,
  created_at: { type: Date, default: Date.now }
}, { collection: 'cotton_repository' });

const Report = mongoose.model('Report', ReportSchema);

app.get('/api/reports', async (req, res) => {
  try {
    const { cotton_yarn_count, sub_type } = req.query;

    let query = {};
    if (cotton_yarn_count) query.cotton_yarn_count = cotton_yarn_count;
    if (sub_type) query.sub_type = sub_type;

    const reports = await Report.find(query);
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
