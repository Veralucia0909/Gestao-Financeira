// ====================== IMPORTS FIREBASE ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
  getFirestore, collection, doc, addDoc, deleteDoc, getDocs, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { 
  getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
// ===============================================================


// ====================== CONFIG DO FIREBASE ======================
const firebaseConfig = {
  apiKey: "AIzaSyDf64lwwvlUlI2RUzQxhsIfDODFwois8WI",
  authDomain: "investe-mais-b91d9.firebaseapp.com",
  projectId: "investe-mais-b91d9",
  storageBucket: "investe-mais-b91d9.appspot.com",
  messagingSenderId: "119534705329",
  appId: "1:119534705329:web:0b82573da1f92614a5e090"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// ===============================================================


let userId = null;
const historicoMov = [];


// =================== AGUARDAR LOGIN DO USUÁRIO ==================
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    carregarMovs();
  } else {
    alert("Você precisa estar logado!");
  }
});
// ===============================================================


// ========================== CARREGAR ===========================
async function carregarMovs() {
  historicoMov.length = 0;

  const ref = collection(db, "usuarios", userId, "movimentacoes");
  const q = query(ref, orderBy("data"));
  const snap = await getDocs(q);

  snap.forEach((docu) => {
    historicoMov.push({ id: docu.id, ...docu.data() });
  });

  apresentarMovs();
  separarMovimentacoes();
  atualizarGraficos();
}
// ===============================================================


// ===================== RADIO + SELECTS =========================
const radioEntradas = document.getElementById("entrada");
const radioSaidas = document.getElementById("saida");
const selectEntradas = document.getElementById("selectEntradas");
const selectSaidas = document.getElementById("selectSaidas");

selectEntradas.style.display = "none";
selectSaidas.style.display = "none";

radioEntradas.addEventListener("click", () => {
  selectEntradas.style.display = "inline";
  selectSaidas.style.display = "none";
  selectSaidas.value = "";
});

radioSaidas.addEventListener("click", () => {
  selectSaidas.style.display = "inline";
  selectEntradas.style.display = "none";
  selectEntradas.value = "";
});
// ===============================================================


// ===================== CADASTRAR MOV FIRESTORE ==================
async function cadastrarMov() {
  const data = document.getElementById("dataMov").value;
  const descricao = document.getElementById("descricaoMov").value.trim();
  const valor = Number(document.getElementById("valorMov").value.trim());

  const tipo = radioEntradas.checked ? "entrada" : radioSaidas.checked ? "saida" : "";
  const categoria = tipo === "entrada" ? selectEntradas.value : selectSaidas.value;

  if (!data || !descricao || !valor || !tipo || !categoria) {
    alert("Preencha todos os campos");
    return;
  }

  const mov = { data, descricao, tipo, categoria, valor };

  await addDoc(collection(db, "usuarios", userId, "movimentacoes"), mov);

  limparForm();
  carregarMovs();
}

document.getElementById("btnCadastrar").addEventListener("click", cadastrarMov);
// ===============================================================


// ============================= REMOVER ==========================
function ativarBotoesExcluir() {
  const botoes = document.querySelectorAll(".btnExcluir");

  botoes.forEach(botao => {
    botao.addEventListener("click", async function () {
      const idFirestore = this.getAttribute("data-id");
      await deleteDoc(doc(db, "usuarios", userId, "movimentacoes", idFirestore));
      carregarMovs();
    });
  });
}
// ===============================================================


// ============================= LIMPAR ===========================
function limparForm() {
  document.getElementById("dataMov").value = "";
  document.getElementById("descricaoMov").value = "";
  document.getElementById("valorMov").value = "";

  radioEntradas.checked = false;
  radioSaidas.checked = false;

  selectEntradas.style.display = "none";
  selectSaidas.style.display = "none";

  selectEntradas.value = "";
  selectSaidas.value = "";
}
// ===============================================================


// ======================== APRESENTAR TABELA =====================
function apresentarMovs() {
  const tabelaMov = document.getElementById("tabelaMov");
  tabelaMov.innerHTML = "";

  const card = document.querySelector(".card");
  card.style.display = historicoMov.length ? "flex" : "none";

  historicoMov.forEach((mov) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${mov.data}</td>
      <td>${mov.descricao}</td>
      <td>${mov.tipo}</td>
      <td>${mov.categoria}</td>
      <td>R$ ${mov.valor.toFixed(2)}</td>
      <td><button class="btnExcluir" data-id="${mov.id}">Remover</button></td>
    `;

    linha.style.background = mov.tipo === "entrada"
      ? "rgba(30, 255, 0, 0.4)"
      : "rgba(255, 0, 0, 0.4)";

    tabelaMov.appendChild(linha);
  });

  ativarBotoesExcluir();
}
// ===============================================================


// ========================= SEPARAR MOVS =========================
function separarMovimentacoes() {
  let receita = 0;
  let despesa = 0;

  historicoMov.forEach((mov) => {
    if (mov.tipo === "entrada") receita += mov.valor;
    else despesa += mov.valor;
  });

  const saldo = receita - despesa;
  apresentarSaldo(saldo);
}
// ===============================================================


// ========================== APRESENTAR SALDO ====================
function apresentarSaldo(saldo) {
  if (historicoMov.length === 0) return;

  const tabelaMov = document.getElementById("tabelaMov");

  const linha = document.createElement("tr");
  linha.innerHTML = `
    <td></td>
    <td></td>
    <td><strong>Saldo</strong></td>
    <td></td>
    <td><strong>R$ ${saldo.toFixed(2)}</strong></td>
  `;

  linha.style.backgroundColor = saldo < 0 ? "red" : saldo > 0 ? "green" : "gray";
  linha.style.fontWeight = "bold";

  tabelaMov.appendChild(linha);
}
// ===============================================================


// =================== PREPARAR DADOS GRÁFICOS ====================
function prepararDadosParaGraficos() {

  // AGRUPAR POR CATEGORIA PARA O GRÁFICO DE PIZZA
  const categorias = {};

  historicoMov.forEach(mov => {
    const cat = mov.categoria;
    categorias[cat] = (categorias[cat] || 0) + Number(mov.valor);
  });

  // SOMAR ENTRADAS E SAÍDAS PARA GRÁFICO DE BARRAS
  let totalEntrada = 0;
  let totalSaida = 0;

  historicoMov.forEach(mov => {
    if (mov.tipo === "entrada") totalEntrada += mov.valor;
    else totalSaida += mov.valor;
  });

  return { categorias, totalEntrada, totalSaida };
}


// ===============================================================


// ========================== GRÁFICO PIZZA =======================
function gerarGraficoPizza(ctx, categorias) {
  const labels = Object.keys(categorias);
  const valores = Object.values(categorias);

  // Paleta automática para até 50 categorias
  const coresBase = [
    "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#2ecc71",
    "#e74c3c", "#1abc9c", "#34495e", "#95a5a6", "#d35400"
  ];

  const background = labels.map((_, i) => coresBase[i % coresBase.length]);

  return new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: valores,
        backgroundColor: background
      }]
    },
    options: {
      plugins: {
        legend: { position: "right" }
      }
    }
  });
}


// ===============================================================


// ========================== GRÁFICO LINHA =======================
function gerarGraficoLinha(ctx, totalEntrada, totalSaida) {
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Entradas", "Saídas"],
      datasets: [{
        label: "Movimentações Mensais",
        data: [totalEntrada, totalSaida],
        backgroundColor: ["#2ecc71", "#e74c3c"],  // Verde e Vermelho
        borderColor: ["#27ae60", "#c0392b"],
        borderWidth: 2,
        barPercentage: 0.6,
        categoryPercentage:0.5
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}


// ===============================================================


let chartPizza = null, chartLinha = null;


// ========================== ATUALIZAR GRÁFICOS ==================
function atualizarGraficos() {
  const show = document.getElementById("chart");
  const { categorias, totalEntrada, totalSaida } = prepararDadosParaGraficos();

  const ctxPizza = document.getElementById("graficoPizza").getContext("2d");
  const ctxLinha = document.getElementById("graficoLinha").getContext("2d");

  if (chartPizza) chartPizza.destroy();
  if (chartLinha) chartLinha.destroy();

  if (historicoMov.length === 0) {
    show.style.display = "none";
    return;
  }

  chartPizza = gerarGraficoPizza(ctxPizza, categorias);
  chartLinha = gerarGraficoLinha(ctxLinha, totalEntrada, totalSaida);

  show.style.display = "flex";
}


// ===============================================================
