// ========== MODAL: EDITAR ==========
function abrirModalEditar(modulo) {
  const modal = document.getElementById("modal-editar");
  document.getElementById("modulo-id").textContent = modulo.id || "MOD-???";
  document.getElementById("nome-paciente").value = modulo.paciente?.nome || "";
  document.getElementById("cpf-paciente").value = modulo.paciente?.cpf || "";
  document.getElementById("medicamento").value = modulo.medicamento?.nome || "";
  document.getElementById("dosagem-prescrita").value = modulo.medicamento?.dosagem_prescrita || "";
  document.getElementById("dosagem-medicamento").value = modulo.medicamento?.dosagem_medicamento || "";
  document.getElementById("formato").value = modulo.medicamento?.formato || "";
  document.getElementById("quantidade-por-dose").value = modulo.medicamento?.quantidade_por_dose || "";
  document.getElementById("quantidade-estoque").value = modulo.medicamento?.estoque?.atual || "";

  const horariosContainer = document.getElementById("horarios-lista");
  horariosContainer.innerHTML = "";

  function mapDiasSemana(nomesDias) {
    const mapa = { "Dom": 0, "Seg": 1, "Ter": 2, "Qua": 3, "Qui": 4, "Sex": 5, "Sab": 6 };
    return nomesDias.map(d => mapa[d]);
  }

  if (Array.isArray(modulo.horarios)) {
    modulo.horarios.forEach((h) => {
      const item = criarHorarioItem(h.hora, mapDiasSemana(h.dias));
      horariosContainer.appendChild(item);
    });
  }

  modal.style.display = "flex";

  document.getElementById("cancelar-edicao").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("btn-adicionar-horario").onclick = () => {
    const novoItem = criarHorarioItem("", []);
    horariosContainer.appendChild(novoItem);
  };

  document.getElementById("form-editar-modulo").onsubmit = (e) => {
    e.preventDefault();
    alert("Alterações salvas (simulado).");
    modal.style.display = "none";
  };
}

function criarHorarioItem(horario = "", dias = []) {
  const horarioItem = document.createElement("div");
  horarioItem.classList.add("horario-item");

  const inputHorario = document.createElement("input");
  inputHorario.type = "time";
  inputHorario.value = horario;
  inputHorario.classList.add("input-horario");
  horarioItem.appendChild(inputHorario);

  for (let i = 0; i < 7; i++) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = dias.includes(i);
    checkbox.classList.add("checkbox-dia");
    checkbox.dataset.dia = i;
    horarioItem.appendChild(checkbox);
  }

  return horarioItem;
}

// ========== MODAL: LIMPAR ==========
function abrirModalLimpar(modulo) {
  const modal = document.getElementById("modal-limpar");
  const moduloIdSpan = document.getElementById("limpar-modulo-id");

  moduloIdSpan.textContent = modulo.id || "MOD-???";
  modal.style.display = "flex";

  document.getElementById("cancelar-limpeza").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("confirmar-limpeza").onclick = () => {
    limparModulo(modulo.id);
    modal.style.display = "none";
  };
}

function limparModulo(id) {
  const index = modulos.findIndex(m => m.id === id);
  if (index !== -1) {
    modulos[index] = {
      id: id,
      paciente: { nome: "", cpf: "" },
      medicamento: {
        nome: "",
        dosagem_prescrita: "",
        formato: "",
        quantidade_por_dose: 1,
        estoque: { atual: 0, maximo: 30 }
      },
      horarios: [],
      status: "Ativo"
    };

    alert(`Módulo ${id} foi limpo com sucesso (simulado).`);
  }
}

// ========== MODAL: CONECTAR ==========
function abrirModalConectar(moduloId) {
  const modal = document.getElementById("modal-conectar");
  const idSpan = document.getElementById("modulo-conectar-id");
  const statusText = document.getElementById("conexao-status");
  const statusMsg = document.getElementById("conexao-msg");
  const cube = document.getElementById("cube-status");

  if (!modal) return;

  statusText.textContent = "Sincronizando com o módulo";
  idSpan.textContent = moduloId;
  statusMsg.textContent = "Aguarde...";
  cube.src = "assets/img/gray_cube.svg";
  modal.style.display = "flex";

  document.getElementById("cancelar-conexao").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("tentar-novamente").onclick = () => {
    abrirModalConectar(moduloId);
  };

  setTimeout(() => {
    const sucesso = Math.random() < 0.30;
    modal.style.display = "none";

    if (sucesso) {
      abrirModalConectado(moduloId);
    } else {
      abrirModalFail(moduloId);
    }
  }, 2500);
}

// ========== MODAL: CONECTADO ==========
function abrirModalConectado(moduloId) {
  const modal = document.getElementById("modal-conectado");
  if (!modal) return;

  document.getElementById("modulo-conectado-id").textContent = moduloId;
  modal.style.display = "flex";

  document.getElementById("fechar-conectado").onclick = () => {
    modal.style.display = "none";
    const modulo = modulos.find(m => m.id === moduloId);
    if (modulo) {
      abrirModalEditar(modulo);
    } else {
      alert("Módulo não encontrado.");
    }
  };
}

// ========== MODAL: FAIL ==========
function abrirModalFail(moduloId) {
  const modal = document.getElementById("modal-fail");
  if (!modal) return;

  document.getElementById("modulo-fail-id").textContent = moduloId;
  modal.style.display = "flex";

  document.getElementById("cancelar-fail").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("tentar-fail").onclick = () => {
    modal.style.display = "none";
    abrirModalConectar(moduloId);
  };
}
