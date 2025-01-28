const app = require("./app.js");
const connectDB = require("./config/db.js");
const { port } = require("./secret.js");

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to establish connections", error);
  }
};

startServer();

// Conditionally listen to the server in development mode
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
