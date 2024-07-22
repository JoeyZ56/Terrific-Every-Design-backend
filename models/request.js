const mongoose = require("mongoose");

// Request Schema
const requestSchema = new mongoose.Schema(
  {
    //part 1
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    state: { type: String, required: true },
    //part 2
    equipment: { type: String, required: true },
    moduleSize: { type: String, required: true },
    numberOfModules: { type: String, required: true },
    inverterManufacturer: { type: String, required: true },
    numberOfInverters: { type: String, required: true },
    sizeOfInverter: { type: String, required: true },
    systemSize: { type: String, required: true },
    //part 3
    meterLocation: { type: String, required: true },
    mspManufacturer: { type: String, required: true },
    mspBuzzRate: { type: String, required: true },
    mainBreakerSize: { type: String, required: true },
    mpu: { type: Boolean, required: true },
    deRate: { type: String, required: true },
    //part 4
    roofingInfo: { type: String, required: true },
    racksToBeUsed: { type: String, required: true },
    mountsToBeUsed: { type: String, required: true },
    //part 5
    batteryBrandModel: { type: String, required: true },
    numberOfBatteries: { type: String, required: true },
    batteryLocation: { type: String, required: true },
    batterySize: { type: String, required: true },
    specificNotes: String,
    //part 6
    specialRequest: { type: [String], required: true },
    designType: { type: [String], required: true },
    priority: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);
