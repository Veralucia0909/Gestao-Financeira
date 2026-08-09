// =========================
// Mostrar apenas o formulário selecionado
// =========================
function mostrarSecao(secao) {
    document.querySelectorAll('.login-cadastro').forEach(s => s.style.display = 'none');
    const elem = document.getElementById(secao);
    if (elem) elem.style.display = 'block';
}

// =========================
// Cadastro de usuário
// =========================
function cadastrar() {
    const nome = document.getElementById('cadastroNome').value.trim();
    const email = document.getElementById('cadastroEmail').value.trim();
    const senha = document.getElementById('cadastroSenha').value.trim();

    if (!nome || !email || !senha) {
        document.getElementById('msgCadastro').textContent = "⚠️ Preencha todos os campos!";
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then(() => {
            document.getElementById('msgCadastro').textContent = "✅ Cadastro realizado com sucesso!";
            document.getElementById('cadastroNome').value = '';
            document.getElementById('cadastroEmail').value = '';
            document.getElementById('cadastroSenha').value = '';
            mostrarSecao('login');
        })
        .catch(error => {
            document.getElementById('msgCadastro').textContent = `❌ ${error.message}`;
        });
}

// =========================
// Login de usuário
// =========================
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();

    if (!email || !senha) {
        document.getElementById('msgLogin').textContent = "⚠️ Preencha todos os campos!";
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(() => {
            document.getElementById('msgLogin').textContent = "✅ Login realizado com sucesso!";
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginSenha').value = '';
            setTimeout(() => document.getElementById('msgLogin').textContent = '', 3000);
            navegacao('inicio.html')
        })
        .catch(error => {
            document.getElementById('msgLogin').textContent = `❌ credencial Incorreta`;
        });
}

// =========================
// Mostrar login por padrão
// =========================
document.addEventListener('DOMContentLoaded', () => {
    mostrarSecao('login');
});

// =========================
// Função placeholder de navegação
// =========================
function navegacao(pagina) {
    window.location.href = pagina
    }







