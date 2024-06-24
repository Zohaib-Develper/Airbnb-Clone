const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");

//Connecting to db
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

async function init() {
  await Listing.deleteMany();
  await Listing.insertMany(initData.data);
  console.log("Initialized");
}
init();
