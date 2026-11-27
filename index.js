import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const app = express();
const port = 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);

await client.connect();
console.log("Successfully connected to MongoDB!");

// Database and collection
const dataBase = client.db("pizzahubdb");
const users = dataBase.collection("user");
const menuItemsCollection = dataBase.collection("allItems");

// Home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const result = await users.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

// Add Menu Item
app.post("/menu-items", async (req, res) => {
  try {
    const { name, category, description, price, location, image } = req.body;
    const menuPrice = Number(price);
    const newMenuItem = {
      name: name.trim(),
      category,
      description: description.trim(),
      price: menuPrice,
      location: location.trim(),
      image,

      status: "Pending",
      isActive: true,
      createdAt: new Date(),
    };

    const result = await menuItemsCollection.insertOne(newMenuItem);

    res.status(201).send({
      success: true,
      message: "Menu item submitted successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Something went wrong",
    });
  }
});

// Get all menu items
app.get("/menu-items", async (req, res) => {
  const result = await menuItemsCollection.find().toArray();
  res.send(result);
});

// Delete menu item
app.delete("/menu-items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };

    const result = await menuItemsCollection.deleteOne(filter);

    res.send({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete menu item" });
  }
});




// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
