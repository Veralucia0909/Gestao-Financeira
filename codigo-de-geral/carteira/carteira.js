const historicoMov = [];


function cadastrarMov() {
  const datalida = document.getElementById("dataMov").value;
  const descricaolida = document.getElementById("descricaoMov").value.trim();
  const tipolido = document.getElementById("tipoMov").value;
  const valorlido = Number(document.getElementById("valorMov").value);
  
  if (!descricaolida || !valorlido || !tipolido || !datalida) {
    alert("preencha todos os campos");
    return;
  }
  const movimentacao = {
    data: datalida,
    descricao: descricaolida,
    tipo: tipolido,
    valor: valorlido,
  };
  
  historicoMov.push(movimentacao);
  console.log(historicoMov);
  
  limparForm();
  apresentarMovs();
  separarMovimentacoes();
  atualizarGraficos();
}


function limparForm() {
  document.getElementById("dataMov").value = "";
  document.getElementById("descricaoMov").value = "";
  document.getElementById("tipoMov").value = "";
  document.getElementById("valorMov").value = "";
}

function apresentarMovs() {
  const tabelaMov = document.getElementById("tabelaMov");
  tabelaMov.innerHTML = "";
  
  const card = document.querySelector(".card")
  if (historicoMov.length != 0){
    card.style.display = "flex"
  } else{
    card.style.display = "none"
  }

  historicoMov.forEach((movimentacao, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
            <td>${movimentacao.data}</td>
            <td>${movimentacao.descricao}</td>
            <td>${movimentacao.tipo}</td>
            <td>R$ ${movimentacao.valor.toFixed(2)}</td>
            <td id="botaoRemover"><button class="btnExcluir" data-id="${index}">Remover</button></td>
          `;
        if(movimentacao.tipo === "entrada") {
          linha.style.background = "rgba(30, 255, 0, 0.4)";
        } else{
          linha.style.background = "rgba(255, 0, 0, 0.4)";
        }
        tabelaMov.appendChild(linha);
  });
  ativarBotoesExcluir()
}

function separarMovimentacoes() {
  const entradas = [];
  const saidas = [];
  let receita = 0;
  let despesa = 0;
  
  historicoMov.forEach((mov) => {
    if (mov.tipo === 'entrada') {
      entradas.push(mov);
      receita += mov.valor;
    } else if (mov.tipo === 'saida') {
      saidas.push(mov);
      despesa += mov.valor;
    }
  });
  
  const saldo = receita - despesa;

  console.log("entradas:", entradas);
  console.log("saidas:", saidas);
  console.log("Receita total:", receita);
  console.log("despesa total:", despesa);
  console.log("saldo remanecente:", saldo);

  apresentarSaldo(saldo)
}

function apresentarSaldo(saldo) {
  const tabelaMov = document.getElementById("tabelaMov");

  // Se não houver transações, não mostra o saldo
  if (historicoMov.length === 0) return;

  // Cria uma linha extra no final com o saldo
  const linhaSaldo = document.createElement("tr");
  linhaSaldo.innerHTML = `
    <td></td>
    <td></td>
    <td><strong>saldo</strong></td>
    <td><strong>R$ ${saldo.toFixed(2)}</strong></td>
  `;

  if (saldo < 0) {
    linhaSaldo.style.backgroundColor = "#ff0000ff";
    linhaSaldo.style.fontWeight = "bold";
  }else if (saldo > 0) {
    linhaSaldo.style.backgroundColor = "rgba(17, 150, 0, 1)";
    linhaSaldo.style.fontWeight = "bold";
  }else {
    linhaSaldo.style.backgroundColor = "grey";
    linhaSaldo.style.fontWeight = "bold";
  }
  tabelaMov.appendChild(linhaSaldo);
}

function prepararDadosParaGraficos() {
  let totalEntrada = 0, totalSaida = 0;
  let datas = [], saldoPorData = [];
  let saldoAcumulado = 0;

  const movsOrdenadas = historicoMov.slice().sort((a,b) => new Date(a.data) - new Date(b.data));

  movsOrdenadas.forEach(mov => {
    if (mov.tipo === "entrada") totalEntrada += Number(mov.valor);
    else totalSaida += Number(mov.valor);

    saldoAcumulado += (mov.tipo === "entrada" ? Number(mov.valor) : -Number(mov.valor));
    datas.push(mov.data);
    saldoPorData.push(saldoAcumulado);
  });

  return { totalEntrada, totalSaida, datas, saldoPorData };
}

function gerarGraficoPizza(ctx, totalEntrada, totalSaida) {
  return new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Entradas", "Saídas"],
      datasets: [{ data: [totalEntrada, totalSaida], backgroundColor: ["#2ecc71","#e74c3c"] }]
    },
    options: { responsive: true }
  });
}

function gerarGraficoLinha(ctx, datas, saldoPorData) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: datas,
      datasets: [{
        label: "Saldo acumulado",
        data: saldoPorData,
        borderColor: "#ffc300",
        borderWidth: 2,
        fill: false,
        tension: 0.2
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

let chartPizza = null, chartLinha = null;

function atualizarGraficos() {
  const { totalEntrada, totalSaida, datas, saldoPorData } = prepararDadosParaGraficos();
  const ctxPizza = document.getElementById("graficoPizza").getContext("2d");
  const ctxLinha = document.getElementById("graficoLinha").getContext("2d");
  const show = document.getElementById('chart')

  if (chartPizza) chartPizza.destroy();
  if (chartLinha) chartLinha.destroy();

  chartPizza = gerarGraficoPizza(ctxPizza, totalEntrada, totalSaida);
  chartLinha = gerarGraficoLinha(ctxLinha, datas, saldoPorData);
  if(historicoMov.length == 0){
    chartPizza.destroy();
    chartLinha.destroy();
    show.style.display = "none"
  } else{
    show.style.display = "flex"
  }
}

function ativarBotoesExcluir() {
  const botoes = document.querySelectorAll(".btnExcluir")

  botoes.forEach(botao => {
    botao.addEventListener("click", function(){
      
      const posisao = this.getAttribute("data-id")

      historicoMov.splice(posisao,1)

      apresentarMovs()
      atualizarGraficos?.()
    })
  })
}