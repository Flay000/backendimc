require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
 
const cors = require("cors");

const authRoutes = require("./routes/auth");
// const dataRoutes = require("./routes/data");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
  });
  const authRoute =  require("./routes/auth");
  app.use("/api/auth", authRoute);
  // app.use("/api/data", dataRoutes);

