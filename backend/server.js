const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let verificationCode = null;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kawanwagnner.gs@gmail.com",
    pass: "censured", // <<< não posso esquecer de ocultar essa parada aqui <<<<
  },
});

app.post("/send-code", (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.error("Nenhum email fornecido");
    return res.status(400).send({ message: "Email é obrigatório" });
  }

  verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(
    `Enviando código de verificação ${verificationCode} para ${email}`
  );

  const mailOptions = {
    from: "kawanwagnner.gs@gmail.com",
    to: email,
    subject: "Seu Código de Verificação",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fc;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              font-size: 16px;
              line-height: 1.5;
            }
            .button {
              display: inline-block;
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px 20px;
              border-radius: 4px;
              text-decoration: none;
              font-weight: bold;
              margin-top: 20px;
              text-align: center;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #aaa;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Verificação de Email</h2>
            </div>
            <div class="content">
              <p>Olá,</p>
              <p>Obrigado por se cadastrar. Para confirmar seu email, utilize o código de verificação abaixo:</p>
              <h3 style="font-size: 24px; color: #4CAF50;">${verificationCode}</h3>
              <p>Digite esse código na aplicação para concluir a verificação.</p>
              <p>Se você não solicitou esse código, por favor, ignore este email.</p>
              <a href="#" class="button">Verificar Agora</a>
            </div>
            <div class="footer">
              <p>Este é um email automático, não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o email:", error);
      return res
        .status(500)
        .send({ message: "Erro ao enviar o email", error: error.message });
    }
    console.log("Email enviado:", info.response);
    res.status(200).send({ message: "Código de verificação enviado!" });
  });
});

app.post("/verify-code", (req, res) => {
  const { code } = req.body;

  if (!code) {
    console.error("Nenhum código fornecido");
    return res
      .status(400)
      .send({ message: "Código de verificação é obrigatório" });
  }

  console.log(`Verificando código: ${code}`);

  if (code === verificationCode) {
    console.log("Código verificado com sucesso");
    return res
      .status(200)
      .send({ message: "Verificado com sucesso, Obrigado!" });
  }

  console.error("Código de verificação inválido");
  res.status(400).send({ message: "Código de verificação inválido." });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
