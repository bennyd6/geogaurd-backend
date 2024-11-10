const express = require('express');
const router = express.Router();
const Citizen = require('../models/Citizens');
const twilio = require('twilio');
require('dotenv').config();


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/add', async (req, res) => {
    try {
      const { pincode, name, phone } = req.body;  
      const newCitizen = new Citizen({ pincode, name, phone });
      await newCitizen.save();
      res.status(201).json({ message: 'Citizen added successfully', data: newCitizen });
    } catch (error) {
      res.status(400).json({ message: 'Error adding citizen', error: error.message });
    }
});

router.get('/pincode/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const citizens = await Citizen.find({ pincode });
    res.status(200).json({ message: 'Citizens fetched successfully', data: citizens });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching citizens', error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCitizen = await Citizen.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Citizen updated successfully', data: updatedCitizen });
  } catch (error) {
    res.status(400).json({ message: 'Error updating citizen', error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Citizen.findByIdAndDelete(id);
    res.status(200).json({ message: 'Citizen deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting citizen', error: error.message });
  }
});

router.get('/alert/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const citizens = await Citizen.find({ pincode });

    if (citizens.length === 0) {
      console.log('No citizens found for the specified pincode')
      return res.status(404).json({ message: 'No citizens found for the specified pincode' });
    }

    const smsPromises = citizens.map(citizen =>
      client.messages.create({
        body: `ALERT: Flood risk detected in your area (${pincode}). Please take necessary precautions.`,
        // body:'Adroid Alert: try backing up all the stuff, as the phone was injected with malicious activity because of the OTP leakage.',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: citizen.phone
      }).catch(err => {
        console.error(`Failed to send SMS to ${citizen.phone}:`, err.message);
      })
    );

    await Promise.all(smsPromises);
    console.log('Alerts sent successfully to all citizens in the area', citizens)
    res.status(200).json({ message: 'Alerts sent successfully to all citizens in the area', data: citizens });
  } catch (error) {
    res.status(400).json({ message: 'Error sending alerts', error: error.message });
  }
});

module.exports = router;