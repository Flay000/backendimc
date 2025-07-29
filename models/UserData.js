const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  peso: Number,
  altura: Number,
  imc: Number,
  imagemUrl: String, // ou um campo buffer para salvar imagem direto, mas URL é melhor
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserData", userDataSchema);
