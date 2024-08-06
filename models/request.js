const mongoose = require("mongoose");

// Request Schema
const requestSchema = new mongoose.Schema(
  {
    //part 1
    name: String,
    email: { type: String, required: true },
    contactNumber: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    state: { type: String, required: true },
    ahj: String,
    apn: String,
    //part 2
    equipment: { type: String, required: true },
    moduleSize: { type: String, required: true },
    numberOfModules: { type: String, required: true },
    inverterManufacturer: { type: String, required: true },
    numberOfInverters: String,
    sizeOfInverter: { type: String, required: true },
    systemSize: { type: String, required: true },
    //part 3
    meterLocation: { type: String, required: true },
    mspManufacturer: String,
    mspBuzzRate: { type: String, required: true },
    mainBreakerSize: { type: String, required: true },
    mpu: { type: Boolean, required: true },
    deRate: { type: Boolean, required: true },
    //part 4
    roofingInfo: { type: String, required: true },
    racksToBeUsed: { type: String, required: true },
    mountsToBeUsed: { type: String, required: true },
    //part 5
    batteryBrandModel: String,
    numberOfBatteries: String,
    batteryLocation: String,
    batterySize: String,
    specificNotes: String,
    //part 6
    specialRequest: [String],
    designType: { type: [String], required: true },
    priority: { type: [String], required: true },
    //part 7
    fileUpLoad: Buffer,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);
