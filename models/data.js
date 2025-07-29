const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");

// Middleware para autenticar (exemplo simples, você pode usar JWT)
const authenticate = (req, res, next) => {
  // exemplo: pegar userId do token JWT decodificado
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Não autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};

router.post("/save", authenticate, async (req, res) => {
  const { peso, altura, imc, imagemUrl } = req.body;

  try {
    const data = new UserData({
      userId: req.userId,
      peso,
      altura,
      imc,
      imagemUrl,
    });

    await data.save();
    res.status(201).json({ message: "Dados salvos com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar dados", error: err.message });
  }
});

router.get("/", (req, res) => {
  res.json({ message: "Rota /avaliacoes funcionando!" });
});

module.exports = router;


module.exports = router;
