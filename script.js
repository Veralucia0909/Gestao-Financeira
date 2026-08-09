const firebaseConfig = {
    apiKey: "AIzaSyDf64lwwvlUlI2RUzQxhsIfDODFwois8WI",
    authDomain: "investe-mais-b91d9.firebaseapp.com",
    projectId: "investe-mais-b91d9",
    storageBucket: "investe-mais-b91d9.firebasestorage.app",
    messagingSenderId: "119534705329",
    appId: "1:119534705329:web:0b82573da1f92614a5e090"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }


// Oculta formulário de cadastro no load da pagina
window.onload = function() {
    document.getElementById('cadastro').forEach(div => div.style.display = 'none');
};
    
// Função para mostrar o login/cadastro
function mostrarSecao(secao) {
    document.querySelectorAll('.login-cadastro').forEach(div => div.style.display = 'none');
    document.getElementById(secao).style.display = 'block';
}

function autenticar() {
  mostrarSecao('login');
}

function formCadastro() {
  mostrarSecao('cadastro');
}


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

            // Redireciona após login
            navegacao('inicio.html');
        })
        .catch(() => {
            document.getElementById('msgLogin').textContent = "❌ Credenciais incorretas";
            
        });
}

// =========================
// Recuperação de Senha (Firebase)
// =========================
function recuperarSenha() {
    const email = document.getElementById('recuperacaoEmail').value.trim();
    const msgElement = document.getElementById('msgRecuperacao');

    msgElement.textContent = '';

    if (!email) {
        msgElement.textContent = 'Por favor, insira seu endereço de e-mail.';
        msgElement.style.color = 'red';
        return;
    }

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            msgElement.textContent =
                'Se a conta estiver cadastrada, um link de recuperação foi enviado. Verifique sua caixa de entrada e spam.';
            msgElement.style.color = 'green';

            document.getElementById('recuperacaoEmail').value = '';
        })
        .catch(error => {
            let mensagemErro = 'Erro ao enviar o link. Verifique o email e tente novamente.';

            if (error.code === 'auth/invalid-email') {
                mensagemErro = 'O endereço de e-mail está mal formatado.';
            }

            msgElement.textContent = mensagemErro;
            msgElement.style.color = 'red';

            console.error("Erro de recuperação de senha:", error);
        });
}

// =========================
// Mostrar login ao carregar
// =========================
document.addEventListener('DOMContentLoaded', () => {
    mostrarSecao('login');
});

// =========================
// Função de Navegação
// =========================
function navegacao(pagina) {
    window.location.href = pagina;
}







