document.addEventListener("DOMContentLoaded", () => {

  const secao = document.getElementById("sobre-nos");
  secao.style.display = "block";

  // Descrição do site
  const descricaoSite =
    "O projeto Investe Plus nasceu da ideia de criar um espaço simples e confiável para aprender a investir e organizar suas finanças. Nosso objetivo é ajudar qualquer pessoa a dar os primeiros passos no mundo dos investimentos, com informações claras e acessíveis. Este é apenas o começo novas funcionalidades e conteúdos serão adicionados em breve para tornar sua experiência ainda melhor!";

  // Inserir descrição do site
  const desc = document.getElementById("descricao-site");
  if (desc) desc.textContent = descricaoSite;

  // Lista inicial de membros
  const membros = [
    { nome: "Mauricio Rodrigues", funcao: "Banco de dados", foto: "https://avatars.githubusercontent.com/u/225988260?v=4" },
    { nome: "Marcelo Oliveira", funcao: "Dicas de investimento e sobre nós", foto: "https://avatars.githubusercontent.com/u/225988792?v=4" },
    { nome: "Daniel Medeiros", funcao: "Página da Carteira", foto: "https://avatars.githubusercontent.com/u/227280075?v=4" },
    { nome: "Leonardo Ferreira", funcao: "Página de Início", foto: "https://avatars.githubusercontent.com/u/49880269?v=4" },
    { nome: "Vera Lucia", funcao: "Login e cadastro", foto: "https://avatars.githubusercontent.com/u/149123803?v=4" }
  ];

  // Renderizar os membros
  const container = document.getElementById("membros-container");
  if (container) {
    container.innerHTML = "";
    membros.forEach(membro => {
      const div = document.createElement("div");
      div.classList.add("membro");
      div.innerHTML = `
        <img src="${membro.foto || 'https://i.pravatar.cc/100'}" alt="${membro.nome}">
        <h3>${membro.nome}</h3>
        <p>${membro.funcao}</p>
      `;
      container.appendChild(div);
    });
  }

  // Listener do formulário
  const form = document.getElementById("membroForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nome = document.getElementById("nome").value;
      const funcao = document.getElementById("funcao").value;
      const foto = document.getElementById("foto").value;
      console.log("Novo membro:", nome, funcao, foto);
      form.reset();
    });
  }

});
