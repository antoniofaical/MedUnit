let modulos = []; // Dados globais dos módulos

document.addEventListener("DOMContentLoaded", () => {
  carregarModais();
  carregarModulos();
  configurarLogout();
  configurarConectarModulo();
});

// === Logout ===
function configurarLogout() {
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

// === Botão "Conectar Módulo" ===
function configurarConectarModulo() {
  const botaoConectar = document.getElementById("btn-conectar-modulo");
  if (botaoConectar) {
    botaoConectar.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalConectar("MOD-001"); // ← simulação por enquanto
    });
  }
}

// === Carregar dados da tabela de módulos ===
function carregarModulos() {
  fetch("dados/modulos/modulos_mock.json")
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar os dados dos módulos");
      return response.json();
    })
    .then(data => {
      modulos = data;
      renderizarTabela();
    })
    .catch(error => {
      console.error("Erro ao carregar os módulos:", error);
    });
}

// === Renderizar tabela ===
function renderizarTabela() {
  const tbody = document.getElementById("modulos-tbody");
  tbody.innerHTML = '';

  modulos.forEach(modulo => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${modulo.id}</td>
      <td>${modulo.medicamento.nome}</td>
      <td>${modulo.medicamento.dosagem_prescrita}</td>
      <td>${modulo.medicamento.estoque.atual}/${modulo.medicamento.estoque.maximo}</td>
      <td>${modulo.paciente.nome}</td>
      <td>${modulo.status}</td>
      <td class="acoes">
        <div class="acoes-wrapper">
          <button class="icon-button editar-btn" title="Editar módulo" data-id="${modulo.id}">
            <img src="assets/icons/edit.svg" alt="Editar" />
          </button>
          <button class="icon-button limpar-btn" title="Limpar módulo" data-id="${modulo.id}">
            <img src="assets/icons/refresh.svg" alt="Limpar" />
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });

  configurarBotoes();
}

// === Associar eventos aos botões de editar e limpar ===
function configurarBotoes() {
  document.querySelectorAll(".editar-btn").forEach(botao => {
    botao.addEventListener("click", () => {
      const idModulo = botao.dataset.id;
      const modulo = modulos.find(m => m.id === idModulo);
      if (modulo) abrirModalEditar(modulo);
    });
  });

  document.querySelectorAll(".limpar-btn").forEach(botao => {
    botao.addEventListener("click", () => {
      const idModulo = botao.dataset.id;
      const modulo = modulos.find(m => m.id === idModulo);
      if (modulo) abrirModalLimpar(modulo);
    });
  });
}

// === Carregar HTML unificado dos modais ===
async function carregarModais() {
  const container = document.getElementById('modais-container');

  try {
    const res = await fetch('components/modais.html'); // HTML unificado
    const html = await res.text();
    container.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    console.error("Erro ao carregar modais:", err);
  }
}
