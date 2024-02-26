const express = require('express');
const connectDB = require('./config/db');
const cron = require('node-cron');

const { fetchVaccineData } = require('./lib/fetchVaccineData');

const app = express();

connectDB();
//crons jobs
cron.schedule('*/5 * * * *', async () => {
  try {
      await fetchVaccineData();
  } catch (error) {
      console.error('Error running data fetch cron job:', error);
  }
});


app.use(express.json({ extended: false }));


app.use('/api', require('./routes/vaccine'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`));