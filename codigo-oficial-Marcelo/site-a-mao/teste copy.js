// ====================== IMPORTS FIREBASE ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
  getFirestore, collection, doc, addDoc, deleteDoc, getDocs, query, orderBy, updateDoc
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
let editandoId = null;


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



// ========================== CARREGAR BD =========================
async function carregarMovs() {
  historicoMov.length = 0;

  const ref = collection(db, "usuarios", userId, "movimentacoes");
  const q = query(ref, orderBy("data"));
  const snap = await getDocs(q);

  snap.forEach((docu) => {
    historicoMov.push({ id: docu.id, ...docu.data() });
  });

  apresentarMovs();
  atualizarGraficos();
}
// ===============================================================



// ===================== CADASTRAR / EDITAR ======================
async function cadastrarMov() {
  const datalida = document.getElementById("dataMov").value;
  const descricaolida = document.getElementById("descricaoMov").value.trim();
  const tipolido = document.getElementById("tipoMov").value;
  const valorlido = Number(document.getElementById("valorMov").value);

  if (!descricaolida || !valorlido || !tipolido || !datalida) {
    alert("Preencha todos os campos");
    return;
  }

  const movimentacao = {
    data: datalida,
    descricao: descricaolida,
    tipo: tipolido,
    valor: valorlido
  };

  if (editandoId) {
    await updateDoc(
      doc(db, "usuarios", userId, "movimentacoes", editandoId),
      movimentacao
    );

    editandoId = null;
    const btn = document.getElementById("btnCadastrar");
    btn.textContent = "Cadastrar";
    btn.style.background = "";
  } else {
    await addDoc(collection(db, "usuarios", userId, "movimentacoes"), movimentacao);
  }

  limparForm();
  carregarMovs();
}

document.getElementById("btnCadastrar").addEventListener("click", cadastrarMov);
// ===============================================================



// ====================== EXCLUIR REGISTRO =======================
function ativarBotoesExcluir() {
  document.querySelectorAll(".btnExcluir").forEach(botao => {
    botao.addEventListener("click", async function () {
      const idFirestore = this.getAttribute("data-id");
      await deleteDoc(doc(db, "usuarios", userId, "movimentacoes", idFirestore));
      carregarMovs();
    });
  });
}
// ===============================================================



// ====================== EDITAR REGISTRO ========================
function ativarBotoesEditar() {
  document.querySelectorAll(".btnEditar").forEach(botao => {
    botao.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const mov = historicoMov.find(m => m.id === id);

      document.getElementById("dataMov").value = mov.data;
      document.getElementById("descricaoMov").value = mov.descricao;
      document.getElementById("tipoMov").value = mov.tipo;
      document.getElementById("valorMov").value = mov.valor;

      editandoId = id;

      const btn = document.getElementById("btnCadastrar");
      btn.textContent = "Salvar edição";
      btn.style.background = "#e67e22";
    });
  });
}
// ===============================================================



// ================== LIMPAR FORM E EXIBIR MOVS ==================
function limparForm() {
  document.getElementById("dataMov").value = "";
  document.getElementById("descricaoMov").value = "";
  document.getElementById("tipoMov").value = "";
  document.getElementById("valorMov").value = "";
}

function apresentarMovs() {
  const tabelaMov = document.getElementById("tabelaMov");
  tabelaMov.innerHTML = "";

  const card = document.querySelector(".card");
  card.style.display = historicoMov.length ? "flex" : "none";

  let totalEntrada = 0;
  let totalSaida = 0;

  historicoMov.forEach((mov) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${mov.data}</td>
      <td>${mov.descricao}</td>
      <td>${mov.tipo}</td>
      <td>R$ ${mov.valor.toFixed(2)}</td>
      <td>
        <button class="btnEditar" data-id="${mov.id}">✏️</button>
        <button class="btnExcluir" data-id="${mov.id}">🗑️</button>
      </td>
    `;

    linha.style.background = mov.tipo === "entrada"
      ? "rgba(30,255,0,0.4)"
      : "rgba(255,0,0,0.4)";

    tabelaMov.appendChild(linha);

    if (mov.tipo === "entrada") totalEntrada += mov.valor;
    else totalSaida += mov.valor;
  });

  const saldoFinal = totalEntrada - totalSaida;

  const linhaSaldo = document.createElement("tr");
  linhaSaldo.innerHTML = `
    <td colspan="2"></td>
    <td><strong>Saldo Final</strong></td>
    <td><strong>R$ ${saldoFinal.toFixed(2)}</strong></td>
    <td></td>
  `;

  linhaSaldo.style.backgroundColor =
    saldoFinal < 0 ? "rgba(255,0,0,0.7)" :
    saldoFinal > 0 ? "rgba(0,255,0,0.7)" :
                      "gray";

  tabelaMov.appendChild(linhaSaldo);

  ativarBotoesExcluir();
  ativarBotoesEditar();
}
// ===============================================================



// ======================= GRÁFICOS ===============================
function prepararDadosParaGraficos() {
  let saldo = 0;
  let saldoPorData = [];
  let datasLabels = [];
  let categorias = {};

  const ordenadas = historicoMov.slice().sort((a, b) => new Date(a.data) - new Date(b.data));

  ordenadas.forEach(mov => {
    saldo += mov.tipo === "entrada" ? mov.valor : -mov.valor;

    datasLabels.push(new Date(mov.data).toLocaleDateString("pt-BR"));
    saldoPorData.push(saldo);

    let cat = mov.descricao.trim();
    cat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

    if (!categorias[cat]) categorias[cat] = 0;
    categorias[cat] += mov.valor;
  });

  return { categorias, datasLabels, saldoPorData };
}


function gerarGraficoPizza(ctx, categorias) {
  return new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: Object.keys(categorias).map(() =>
          "#" + Math.floor(Math.random() * 16777215).toString(16)
        )
      }]
    }
  });
}


function gerarGraficoLinha(ctx, datasLabels, saldoPorData) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: datasLabels,
      datasets: [{
        label: "Saldo",
        data: saldoPorData,
        borderColor: "#ffc300",
        borderWidth: 2,
        tension: 0.2
      }]
    }
  });
}


let chartPizza = null;
let chartLinha = null;


function atualizarGraficos() {
  const chartContainer = document.getElementById('chart');
  const { categorias, datasLabels, saldoPorData } = prepararDadosParaGraficos();

  if (!categorias || historicoMov.length === 0) {
    chartContainer.style.display = "none";
    return;
  }

  chartContainer.style.display = "flex";

  const ctxPizza = document.getElementById("graficoPizza").getContext("2d");
  const ctxLinha = document.getElementById("graficoLinha").getContext("2d");

  if (chartPizza) chartPizza.destroy();
  if (chartLinha) chartLinha.destroy();

  chartPizza = gerarGraficoPizza(ctxPizza, categorias);
  chartLinha = gerarGraficoLinha(ctxLinha, datasLabels, saldoPorData);
}
// ===============================================================
