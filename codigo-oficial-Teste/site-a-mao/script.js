// ATENÇÃO ATENÇÃO ATENÇÃO 
// SINCRONIZAÇÃO FEITA COM CHAT GPT, APENAS UM TESTE 


// =============================
// 🔥 CONFIGURAÇÃO FIREBASE
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

 const firebaseConfig = {
      apiKey: "AIzaSyDf64lwwvlUlI2RUzQxhsIfDODFwois8WI",
      authDomain: "investe-mais-b91d9.firebaseapp.com",
      projectId: "investe-mais-b91d9",
      storageBucket: "investe-mais-b91d9.firebasestorage.app",
      messagingSenderId: "119534705329",
      appId: "1:119534705329:web:0b82573da1f92614a5e090"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =============================
// 🧭 NAVEGAÇÃO ENTRE PÁGINAS
// =============================
window.mostrarPagina = function(paginaId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(paginaId).classList.add("active");
};

// =============================
// 🔐 LOGIN / CADASTRO
// =============================
document.getElementById('btnLogin').addEventListener('click', () => {
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('cadastroSection').style.display = 'none';
});

document.getElementById('btnCadastro').addEventListener('click', () => {
  document.getElementById('cadastroSection').style.display = 'block';
  document.getElementById('loginSection').style.display = 'none';
});

document.getElementById('cadastrar').addEventListener('click', async () => {
  const nome = document.getElementById('cadastroNome').value.trim();
  const email = document.getElementById('cadastroEmail').value.trim();
  const senha = document.getElementById('cadastroSenha').value.trim();

  if (!nome || !email || !senha) {
    document.getElementById('msgCadastro').textContent = "⚠️ Preencha todos os campos!";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    document.getElementById('msgCadastro').textContent = "✅ Cadastro realizado com sucesso!";
  } catch (error) {
    document.getElementById('msgCadastro').textContent = "❌ Erro: " + error.message;
  }
});

document.getElementById('entrar').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value.trim();

  if (!email || !senha) {
    document.getElementById('msgLogin').textContent = "⚠️ Preencha todos os campos!";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    document.getElementById('msgLogin').textContent = "✅ Login realizado!";
    setTimeout(() => mostrarPagina('economia'), 1000);
  } catch {
    document.getElementById('msgLogin').textContent = "❌ Usuário ou senha incorretos.";
  }
});

// =============================
// 💰 CONTROLE FINANCEIRO
// =============================
const historicoMov = [];
const entrada = [];
const saida = [];

window.cadastrarMov = function() {
  const datalida = document.getElementById("dataMov").value;
  const descricaolida = document.getElementById("descricaoMov").value;
  const valorlido = Number(document.getElementById("valorMov").value);
  const tipolido = document.getElementById("tipoMov").value;

  if (!datalida || !descricaolida || !valorlido || !tipolido) {
    alert("⚠️ Preencha todos os campos!");
    return;
  }

  const movimentacao = { data: datalida, descricao: descricaolida, valor: valorlido, tipo: tipolido };
  historicoMov.push(movimentacao);

  apresentarMovs();
  limparForm();
  saldoUsuario();
};

function limparForm() {
  document.getElementById("dataMov").value = "";
  document.getElementById("descricaoMov").value = "";
  document.getElementById("valorMov").value = "";
  document.getElementById("tipoMov").value = "";
}

function apresentarMovs() {
  const tabelaMov = document.getElementById("tabelaMov");
  tabelaMov.innerHTML = "";

  historicoMov.forEach((m) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${m.data}</td>
      <td>${m.descricao}</td>
      <td>R$ ${m.valor.toFixed(2)}</td>
      <td>${m.tipo}</td>
    `;
    tabelaMov.appendChild(linha);
  });
}

function saldoUsuario() {
  entrada.length = 0;
  saida.length = 0;

  historicoMov.forEach((m) => {
    if (m.tipo === 'entrada') entrada.push(m.valor);
    else if (m.tipo === 'saida') saida.push(m.valor);
  });
}
