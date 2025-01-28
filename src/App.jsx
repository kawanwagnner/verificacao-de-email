import React, { useState } from "react";

const App = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const sendCode = async () => {
    if (!email) {
      setMessage("Por favor, insira um email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.message === "Código de verificação enviado!") {
        setCodeSent(true);
      }
    } catch (error) {
      setMessage("Erro ao enviar o código.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      setMessage("Por favor, insira o código de verificação.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Erro ao verificar o código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        textAlign: "center",
        maxWidth: "400px",
        margin: "auto",
        borderRadius: "8px",
        backgroundColor: "#f7f7f7",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ color: "#4CAF50" }}>Verificação de Email</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <br />
        <button
          onClick={sendCode}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
            opacity: loading ? 0.6 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Código de Verificação"}
        </button>
      </div>

      {codeSent && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Digite o código de verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <br />
          <button
            onClick={verifyCode}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              fontSize: "16px",
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </button>
        </div>
      )}

      {message && (
        <p
          style={{
            color:
              message === "Verificado com sucesso, Obrigado!"
                ? "#0000FF" // Azul
                : "#D32F2F", // Vermelho
          }}
        >
          {message}
        </p>
      )}

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #4CAF50",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              animation: "spin 2s linear infinite",
            }}
          ></div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default App;
