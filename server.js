import app from "./app.js";

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});