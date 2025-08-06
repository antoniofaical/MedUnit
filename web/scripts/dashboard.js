document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", async () => {
    const nome = localStorage.getItem("farmacia_nome");
    document.getElementById("nome-farmacia").textContent = nome || "...";

    await carregarModulos();
});

async function carregarModulos() {
    const tabela = document.getElementById("tabela-modulos").querySelector("tbody");
    tabela.innerHTML = "";

    const modulos = await eel.listar_modulos()();

    for (const mod_id of modulos) {
        const dados = await eel.carregar_modulo_backend(mod_id)();
        if (dados.erro) continue;

        const linha = document.createElement("tr");

        linha.innerHTML = `
      <td>${dados.id}</td>
      <td>${dados.medicamento || "-"}</td>
      <td>${dados.dosagem || "-"}</td>
      <td>${(dados.estoque_atual || 0) + "/" + (dados.quantidade_por_dose || 1)}</td>
      <td>${formatarNome(dados.paciente || "")}</td>
      <td>Ativo</td>
    `;

        tabela.appendChild(linha);
    }
}

function formatarNome(nome) {
    if (nome.length <= 2) return nome;
    return nome.split(" ")[0] + " " + "*****";
}


document.getElementById("btn-conectar")?.addEventListener("click", () => {
    const id = prompt("Digite o ID do módulo a ser conectado (ex: MOD-001):");

    if (!id || !id.trim()) return;

    const modId = id.trim().toUpperCase();
    localStorage.setItem("moduloConectadoId", modId);

    document.getElementById("sync-id").textContent = modId;

    abrirModal("modal-sincronizando");
    iniciarConexaoBLE(modId);

});

function abrirModal(id) {
    document.getElementById(id)?.classList.add("active");
}

function fecharModal(id) {
    document.getElementById(id)?.classList.remove("active");
}

document.getElementById("btn-cancelar-sync")?.addEventListener("click", () => {
    fecharModal("modal-sincronizando");
});

document.getElementById("btn-tentar-sync")?.addEventListener("click", () => {
    fecharModal("modal-sincronizando");

    const id = localStorage.getItem("moduloConectadoId");
    if (!id) return;

    document.getElementById("sync-id").textContent = id;
    abrirModal("modal-sincronizando");

});

async function iniciarConexaoBLE(modId) {
    try {
        const json = await eel.ble_conectar(modId)();

        if (json.erro) {
            console.warn("Erro ao conectar:", json.erro);
            fecharModal("modal-sincronizando");
            abrirModal("modal-falhou");
            return;
        }

        console.log("Conexão bem-sucedida. JSON recebido:", json);
        localStorage.setItem("jsonRecebido", JSON.stringify(json));

        fecharModal("modal-sincronizando");
        abrirModal("modal-conectado");

    } catch (err) {
        console.error("Erro inesperado:", err);
        fecharModal("modal-sincronizando");
        abrirModal("modal-falhou");
    }
}

document.getElementById("btn-cancelar-falha")?.addEventListener("click", () => {
    fecharModal("modal-falhou");
});

document.getElementById("btn-tentar-falha")?.addEventListener("click", () => {
    fecharModal("modal-falhou");
    const id = localStorage.getItem("moduloConectadoId");
    if (!id) return;

    document.getElementById("sync-id").textContent = id;
    abrirModal("modal-sincronizando");
    iniciarConexaoBLE(id);
});

document.getElementById("btn-proximo-editar")?.addEventListener("click", () => {
    fecharModal("modal-conectado");
    abrirModal("modal-editar"); // virá na Etapa 8
});

document.getElementById("btn-proximo-editar")?.addEventListener("click", () => {
    fecharModal("modal-conectado");
    abrirModal("modal-editar");
    preencherFormularioEdicao();
});

function preencherFormularioEdicao() {
    const json = JSON.parse(localStorage.getItem("jsonRecebido") || "{}");

    document.getElementById("modulo-id-edit").textContent = json.id || "---";
    document.getElementById("paciente").value = json.paciente || "";
    document.getElementById("cpf").value = json.cpf || "";
    document.getElementById("medicamento").value = json.medicamento || "";
    document.getElementById("dosagem").value = json.dosagem || "";
    document.getElementById("formato").value = json.formato || "";
    document.getElementById("quantidade_por_dose").value = json.quantidade_por_dose || 1;
    document.getElementById("estoque_atual").value = json.estoque_atual || 0;
    document.getElementById("horarios").value = (json.horarios || []).join(", ");
}


document.getElementById("form-editar-modulo")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const modId = localStorage.getItem("moduloConectadoId");
  if (!modId) return;

  // 🔄 Preparar botões e animação
  const btnSalvar = document.getElementById("btn-salvar");
  const botoes = document.querySelectorAll("#form-editar-modulo button");
  const textoOriginal = btnSalvar.textContent;

  botoes.forEach(btn => btn.disabled = true); // desativa todos os botões

  let pontos = 1;
  const animacao = setInterval(() => {
    btnSalvar.textContent = "Salvando alterações" + ".".repeat(pontos);
    pontos = (pontos % 3) + 1;
  }, 500);

  const json = {
    id: modId,
    paciente: document.getElementById("paciente").value.trim(),
    cpf: document.getElementById("cpf").value.trim(),
    medicamento: document.getElementById("medicamento").value.trim(),
    dosagem: document.getElementById("dosagem").value.trim(),
    formato: document.getElementById("formato").value.trim(),
    quantidade_por_dose: parseInt(document.getElementById("quantidade_por_dose").value),
    estoque_atual: parseInt(document.getElementById("estoque_atual").value),
    horarios: document.getElementById("horarios").value.split(",").map(h => h.trim()),
    ultima_atualizacao: new Date().toISOString()
  };

  try {
    const resposta = await eel.ble_enviar(modId, json)();

    clearInterval(animacao);
    btnSalvar.textContent = textoOriginal;
    botoes.forEach(btn => btn.disabled = false);

    if (resposta.sucesso) {
      fecharModal("modal-editar");
      localStorage.setItem("jsonRecebido", JSON.stringify(json));
      await carregarModulos();
      alert("✅ Dados enviados com sucesso! 🔌 Para editar novamente, reconecte o módulo.");
    } else {
      alert("❌ Erro ao enviar dados para o módulo.");
    }
  } catch (error) {
    clearInterval(animacao);
    btnSalvar.textContent = textoOriginal;
    botoes.forEach(btn => btn.disabled = false);

    console.error("Erro ao enviar JSON:", error);
    alert("❌ Erro inesperado durante envio BLE.");
  }
});


document.getElementById("btn-limpar-modulo")?.addEventListener("click", () => {
    const json = JSON.parse(localStorage.getItem("jsonRecebido") || "{}");

    document.getElementById("modulo-id-limpar").textContent = json.id || "---";
    fecharModal("modal-editar");
    abrirModal("modal-limpar");
});

document.getElementById("btn-cancelar-limpeza")?.addEventListener("click", () => {
    fecharModal("modal-limpar");
    abrirModal("modal-editar");
});

document.getElementById("btn-cancelar-edicao")?.addEventListener("click", () => {
    fecharModal("modal-editar");
});


document.getElementById("btn-confirmar-limpeza")?.addEventListener("click", async () => {
    const jsonAntigo = JSON.parse(localStorage.getItem("jsonRecebido") || "{}");
    const modId = jsonAntigo.id || localStorage.getItem("moduloConectadoId");

    if (!modId) {
        alert("Módulo não encontrado.");
        return;
    }

    const jsonVazio = {
        id: modId,
        paciente: "",
        cpf: "",
        medicamento: "",
        dosagem: "",
        formato: "",
        quantidade_por_dose: 1,
        estoque_atual: 0,
        horarios: [],
        ultima_atualizacao: new Date().toISOString()
    };

    try {
        const resposta = await eel.ble_enviar(modId, jsonVazio)();

        if (resposta.sucesso) {
            fecharModal("modal-limpar");
            localStorage.setItem("jsonRecebido", JSON.stringify(jsonVazio));
            await carregarModulos(); // atualiza a tabela na dashboard
            alert("✅ Módulo limpo com sucesso!");
        } else {
            alert("❌ Erro ao limpar módulo.");
        }
    } catch (err) {
        console.error("Erro durante limpeza BLE:", err);
        alert("❌ Erro inesperado durante envio.");
    }
});
