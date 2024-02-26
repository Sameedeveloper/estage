const axios = require('axios');

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  data: Object,
});

const VaccineData = mongoose.model('VaccineData', dataSchema);

const fetchVaccineData = async () => {
  try {
    const response = await axios.get('https://data.cdc.gov/api/views/qz99-wyhv/rows.json');
    const responseData = response.data;
    const vaccineData = new VaccineData({ data: responseData });

    await vaccineData.save();

    return vaccineData;

  } catch (error) {

    console.error('Error fetching data:', error);
    
    throw error;
  }
};

module.exports = { fetchVaccineData };
