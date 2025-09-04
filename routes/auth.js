const express = require("express");
const router = express.Router();
const User = require("../models/User"); // seu model de usuário
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Senha incorreta" });

    // Gera o token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
router.delete("/delete-null-usernames", async (req, res) => {
  try {
    // Encontra usuários com username nulo ou vazio
    const usersToDelete = await User.find({ username: { $in: [null, ""] } });

    if (usersToDelete.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado com username nulo ou vazio" });
    }

    // Deleta os usuários encontrados
    await User.deleteMany({ username: { $in: [null, ""] } });

    res.status(200).json({ message: "Usuários deletados com sucesso", deletedCount: usersToDelete.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar usuários" });
  }
});
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('erro ao registrar', error)
      return res.status(400).json({ message: "Email já está em uso" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Salva no banco
    const savedUser = await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso", user: { id: savedUser._id, email: savedUser.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

module.exports = router;
