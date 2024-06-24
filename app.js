const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/Listing");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
//Connecting to db
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

app.listen(8080, () => {
  console.log("Server is listening on Port 8080");
});

app.get("/", (req, res) => {
  res.send("Hello there");
});

app.get("/listings", (req, res) => {
  Listing.find({})
    .then((listings) => res.render("listings/index.ejs", { listings }))
    .catch((err) => console.log(err));
});

//New route here i have place this before the below get request because
//the below get request will interprest new as id and get this request always
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", (req, res) => {
  let { id } = req.params;
  Listing.findById(id)
    .then((listing) => res.render("listings/show.ejs", { listing }))
    .catch((err) => console.log(err));
});

app.post("/listings", async (req, res) => {
  let { title, description, image, price, location, country } = req.body;
  let newListing = new Listing({
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
  });
  await newListing.save().catch((err) => {
    console.log("Error in saving new List: ", err);
  });
  res.redirect("/listings");
});

app.get("/listings/:id/edit", (req, res) => {
  let { id } = req.params;
  Listing.findById(id)
    .then((listing) => res.render("listings/edit.ejs", { listing }))
    .catch((err) => console.log(err));
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;
  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image,
    price,
    location,
    country,
  });
  res.redirect("/listings");
});

app.delete("/listings/:id", (req, res) => {
  let { id } = req.params;
  Listing.findByIdAndDelete(id)
    .then((listing) => {
      console.log(listing);
      res.redirect("/listings");
    })
    .catch((err) => console.log(err));
});
