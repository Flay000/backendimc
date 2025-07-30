require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

const allowedOrigins = [
  "http://localhost:5173", 
  "https://imcc-h4me.vercel.app",
  "https://imcia.vercel.app",
  "https://aquafitia.vercel.app/",
  "iam-fit-analyzer.vercel.app",
  "https://iam-fit-analyzer-flayrys-projects.vercel.app",
  "http://192.168.10.2:8080",
  "http://localhost:8080"
];

app.use(cors({
  origin: function(origin, callback) {
    console.log("Origin da requisição:", origin); // 👈 Adicione isso
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "CORS policy não permite acesso da origem especificada.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));



app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
