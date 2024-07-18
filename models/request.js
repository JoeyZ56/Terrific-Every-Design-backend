const mongoose = require("mongoose");

// Request Schema
const requestSchema = new mongoose.Schema({
  name: String,
  email: String,
  contactNumber: String,
  address: String,
  city: String,
  zipCode: String,
  state: String,
  equipment: String,
  moduleSize: String,
  numberOfModules: String,
  inverterManufacturer: String,
  numberOfInverters: String,
  sizeOfInverter: String,
  systemSize: String,
  electricalService: String,
  meterLocation: String,
  mspManufacturer: String,
  mspBuzzRate: String,
  mainBreakerSize: String,
  mpu: Boolean,
  roofingInfo: String,
  batteryInfo: String,
  specialRequest: String,
  designType: String,
  priority: String,
});

module.exports = mongoose.model("Request", requestSchema);
