const mongoose = require('mongoose');
const VaccineDataModel = mongoose.model('VaccineData');

async function getVaccineData(req, res) {
  try {
    let query = {};

    const locationType = req.query.locationType;
    const vaccinationStatus = req.query.vaccinationStatus;
    const intent = req.query.intent;
    const demographics = req.query.demographics;

    if (locationType === 'national') {
      query = { 'data.locationType': 'national' };
    } else if (locationType === 'jurisdictional') {
      query = { 'data.locationType': 'jurisdictional' };
    }

    if (vaccinationStatus) {
      query['data.vaccinationStatus'] = vaccinationStatus;
    }

    if (intent) {
      query['data.intent'] = intent;
    }

    if (demographics) {
      query['data.demographics'] = demographics;
    }

    const data = await VaccineDataModel.find(query).exec();
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

module.exports = { getVaccineData };
