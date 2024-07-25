import app from "./index.js";


app.listen(process.env.PORT, () => {
  console.log(`Server Listening At Port ${process.env.PORT}`);
});
