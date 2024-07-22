const mongoose = require("mongoose");

// Request Schema
const requestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    state: { type: String, required: true },
    equipment: { type: String, required: true },
    moduleSize: { type: String, required: true },
    numberOfModules: { type: String, required: true },
    inverterManufacturer: { type: String, required: true },
    numberOfInverters: { type: String, required: true },
    sizeOfInverter: { type: String, required: true },
    systemSize: { type: String, required: true },
    electricalService: { type: String, required: true },
    meterLocation: { type: String, required: true },
    mspManufacturer: { type: String, required: true },
    mspBuzzRate: { type: String, required: true },
    mainBreakerSize: { type: String, required: true },
    mpu: { type: Boolean, required: true },
    deRate: { type: String, required: true },
    roofingInfo: { type: [String], required: true },
    batteryInfo: { type: String, required: true },
    specialRequest: { type: [String], required: true },
    designType: { type: [String], required: true },
    priority: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);
