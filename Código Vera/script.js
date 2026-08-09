

// script.js - comportamento principal

// --- Navegação entre seções ---
function mostrarSecao(id){
    document.querySelectorAll('main section').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById(id);
    if(sec) sec.classList.add('active');
    // close profile dropdown
    document.getElementById('profileBox').classList.remove('show');
}

// --- Simulação simples de autenticação local (apenas para demo) ---
const auth = {
    logged: false,
    user: null
};

function showAuthState(){
    const authButtons = document.getElementById('authButtons');
    const profileBox = document.getElementById('profileBox');
    if(auth.logged && auth.user){
        authButtons.classList.add('hidden');
        profileBox.classList.remove('hidden');
        document.getElementById('profilePic').src = './default-avatar.png';
        document.getElementById('profileName').textContent = auth.user.name;
    } else {
        authButtons.classList.remove('hidden');
        profileBox.classList.add('hidden');
    }
}
// --- Cadastro ---
document.getElementById('formCadastro')?.addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('nomeCadastro').value.trim();
    const email = document.getElementById('emailCadastro').value.trim();
    const senha = document.getElementById('senhaCadastro').value;

    if (!nome || !email || !senha) return alert('Preencha todos os campos!');

    const usuarios = getUsuarios();
    if (usuarios.some(u => u.email === email)) return alert('Este email já está cadastrado!');

    usuarios.push({ nome, email, senha });
    salvarUsuarios(usuarios);
    alert('Cadastro realizado com sucesso! Faça login para continuar.');

    e.target.reset();
    mostrarSecao('login');
});

// --- Login ---
document.getElementById('formLogin')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    const usuario = getUsuarios().find(u => u.email === email && u.senha === senha);
    if (!usuario) return alert('Email ou senha incorretos!');

    setUsuarioLogado(usuario);
    showAuthState();
    mostrarSecao('inicio');
});

// --- Logout ---
function logout() {
    setUsuarioLogado(null);
    showAuthState();
    mostrarSecao('login');
}

// --- Trocar senha ---
document.getElementById('formAlterarSenha')?.addEventListener('submit', e => {
    e.preventDefault();
    const senhaAtual = e.target.querySelectorAll('input[type=password]')[0].value;
    const novaSenha = e.target.querySelectorAll('input[type=password]')[1].value;

    const usuario = getUsuarioLogado();
    if (!usuario) return alert('Você precisa estar logado.');

    if (usuario.senha !== senhaAtual) return alert('Senha atual incorreta.');

    const usuarios = getUsuarios();
    const idx = usuarios.findIndex(u => u.email === usuario.email);
    if (idx >= 0) {
        usuarios[idx].senha = novaSenha;
        salvarUsuarios(usuarios);
        setUsuarioLogado(usuarios[idx]);
        alert('Senha alterada com sucesso!');
        e.target.reset();
        mostrarSecao('inicio');
    }
});

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    showAuthState();
    mostrarSecao('inicio');
});

document.getElementById('formLogin')?.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    // demo: cria usuário com nome do email
    auth.logged = true;
    auth.user = { name: email.split('@')[0], avatar: './default-avatar.png' };
    showAuthState();
    mostrarSecao('inicio');
});

document.getElementById('formCadastro')?.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('nomeCadastro').value;
    const email = document.getElementById('emailCadastro').value;
    auth.logged = true;
    auth.user = { name: name || email.split('@')[0], avatar: './default-avatar.png' };
    showAuthState();
    mostrarSecao('inicio');
});

function logout(){
    auth.logged = false;
    auth.user = null;
    showAuthState();
    mostrarSecao('inicio');
}

document.getElementById('profileBox')?.addEventListener('click', function(e){
    this.classList.toggle('show');
});

// --- Dados e charts demo ---
function gerarDadosCarteira(){
    // dados de exemplo: saldo mensal
    const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out'];
    const data = [1000,1200,1500,1400,1700,2000,2300,2200,2600,3000];
    return { labels, data };
}

function desenharGraficoBar(id, labels, data){
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Saldo (R$)', data, backgroundColor: 'rgba(255,195,0,0.7)' }]
        },
        options:{responsive:true,maintainAspectRatio:true}
    });
}

function desenharPizza(id, labels, data){
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type:'pie',
        data:{labels, datasets:[{ data, backgroundColor: ['#ffc300','#ffaa00','#ff7a00','#ffd166']}]},
        options:{responsive:true,maintainAspectRatio:true}
    });
}

function desenharLinha(id, labels, data){
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type:'line',
        data:{labels, datasets:[{label:'Saldo',data,fill:true,tension:0.3,backgroundColor:'rgba(255,195,0,0.12)',borderColor:'#ffc300'}]},
        options:{responsive:true,maintainAspectRatio:true}
    });
}

// inicializa gráficos da página (com dados de exemplo)
let chartBarCarteira, chartPizza, chartLinha, chartBarraMensal;
function initCharts(){
    const carteira = gerarDadosCarteira();
    chartBarCarteira = desenharGraficoBar('carteiraBar', carteira.labels, carteira.data);
    // carteira internal charts
    desenharPizza('graficoPizza', ['Renda Fixa','Ações','Cripto','Reserva'], [35,30,20,15]);
    desenharLinha('graficoLinha', carteira.labels, carteira.data);
    desenharGraficoBar('graficoBarraMensal', ['Jan','Fev','Mar','Abr','Mai','Jun'], [200,450,300,600,400,700]);
}
initCharts();

// --- Top ativos (dados simulados) ---
const ativosDia = [
    { simbolo:'PETR4', variacao:'+3.8%', preco:'R$28,40' },
    { simbolo:'VALE3', variacao:'+3.1%', preco:'R$95,20' },
    { simbolo:'ITUB4', variacao:'+2.9%', preco:'R$27,10' },
    { simbolo:'BBDC4', variacao:'+2.5%', preco:'R$21,80' },
    { simbolo:'ABEV3', variacao:'+2.2%', preco:'R$13,40' },
    { simbolo:'BTC', variacao:'+4.5%', preco:'R$160.000' },
    { simbolo:'ETH', variacao:'+3.9%', preco:'R$9.800' },
    { simbolo:'SOL', variacao:'+6.1%', preco:'R$460' },
    { simbolo:'MGLU3', variacao:'+2.0%', preco:'R$5,40' },
    { simbolo:'WEGE3', variacao:'+1.8%', preco:'R$45,60' }
];

function popularTopAtivos(){
    const tbody = document.querySelector('#topAtivos tbody');
    tbody.innerHTML = '';
    ativosDia.forEach(a=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>\ ${a.simbolo}</td><td>\ ${a.variacao}</td><td>\ ${a.preco}</td>`;
        tbody.appendChild(tr);
    });
    // também preencher seção "dicasInvestimento" com top do mês (demo)
    const topMes = document.getElementById('topMes');
    topMes.innerHTML = '';
    ativosDia.slice(0,10).forEach(a=>{
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h4>\ ${a.simbolo} — Por que considerar</h4><p>Resumo breve sobre o ativo, motivos para investir e riscos principais (demo).</p>`;
        topMes.appendChild(div);
    });
}
popularTopAtivos();

// --- Histórico de transações (simples, armazenado em localStorage) ---
const STORAGE_KEY = 'im_transacoes';
function carregarHistorico(){
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}
function salvarHistorico(arr){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    atualizarTabelaHistorico();
}

function atualizarTabelaHistorico(){
    const tbody = document.querySelector('#tabelaHistorico tbody');
    tbody.innerHTML = '';
    const historico = carregarHistorico();
    historico.forEach(item=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>\ ${item.data}</td><td>\ ${item.desc}</td><td>R$\ ${Number(item.valor).toFixed(2)}</td><td>\ ${item.tipo}</td>`;
        tbody.appendChild(tr);
    });
}

document.getElementById('formMov')?.addEventListener('submit', function(e){
    e.preventDefault();
    const data = document.getElementById('dataMov').value || new Date().toLocaleDateString();
    const desc = document.getElementById('descMov').value;
    const valor = Number(document.getElementById('valorMov').value);
    const tipo = document.getElementById('tipoMov').value;
    const historico = carregarHistorico();
    historico.unshift({ data, desc, valor, tipo });
    salvarHistorico(historico);
    mostrarSecao('carteira');
});

// inicialmente popula tabela
atualizarTabelaHistorico();

// --- Simulador de investimento ---
document.getElementById('simForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const ativo = document.getElementById('simAtivo').value;
    const capital = Number(document.getElementById('simCapital').value);
    const taxa = Number(document.getElementById('simTaxa').value) / 100;
    const anos = Number(document.getElementById('simTempo').value);

    // juros compostos anual
    const montante = capital * Math.pow(1 + taxa, anos);
    const ganho = montante - capital;

    const result = document.getElementById('simResult');
    result.innerHTML = `<strong>Simulação para \ ${ativo} (\\${anos} anos)</strong><p>Capital inicial: R$\ ${capital.toFixed(2)}<br>Taxa anual: \ ${(taxa*100).toFixed(2)}%<br>Montante estimado: R$\ ${montante.toFixed(2)}<br>Ganho estimado: R$\ ${ganho.toFixed(2)}</p><p>Dica: diversificar e aumentar aporte mensal costuma melhorar o resultado ao longo do tempo.</p>`;
});

// small UX: copiar behavior for nav showing sections on load
document.addEventListener('DOMContentLoaded', function(){
    showAuthState();
    mostrarSecao('inicio');
    popularTopAtivos();
});

// --- profile default avatar: if not exists, ignore (demo) ---
