const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log(err);
    });


app.get("/", (req, res) => {
    res.send("Hi I am root");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// index Route....
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});
// New Route...
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show route...
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// Create route...
app.post("/listings", async (req, res) => {
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    console.log(listing);
    res.redirect("/listings");
});

// Edit Route...
app.get("/listings/:id/edit",async (req,res)=> {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// Update Route...
app.put("/listings/:id",async (req,res)=> {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// Delete Route...
app.delete("/listings/:id", async (req,res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id,);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My Home",
//         description: "By the beach",
//         price: 1200,
//         location: "Delhi",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful Testing");
// });


app.listen(8080, () => {
    console.log("Server Started");
});