import app from "./app.js";

function startServer() {
  try {
    app.listen(5000);
    console.log("Server is runing on http://localhost:5000");
  } catch (err) {
    console.log(err);
  }
}

startServer();
