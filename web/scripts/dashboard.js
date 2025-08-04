
let moduloConectadoId = null;
let moduloConectadoMAC = null;

document.addEventListener("DOMContentLoaded", async () => {
  const config = await carregarConfiguracoes();
  document.getElementById("nome-farmacia").textContent = config.nome_farmacia;

  await carregarModulos();

  document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.getElementById("btn-conectar").addEventListener("click", async () => {
    try {
      const mac = await conectarAutomaticamente();
      if (!mac) throw new Error("Nenhum módulo MedUnit encontrado.");

      const json = await obterJsonDoModulo(mac);
      if (!json || !json.id) throw new Error("Não foi possível ler o módulo.");

      moduloConectadoId = json.id;
      moduloConectadoMAC = mac;

      document.getElementById("modulo-conectado-label").textContent = `${moduloConectadoId} CONECTADO`;
      document.getElementById("bloco-conexao").classList.add("hidden");
      document.getElementById("bloco-conectado").classList.remove("hidden");

      localStorage.setItem("moduloConectadoId", moduloConectadoId);
      localStorage.setItem("moduloConectadoMAC", moduloConectadoMAC);
    } catch (err) {
      console.error("Erro ao conectar módulo:", err.message);
      alert("Erro ao conectar módulo.");
    }
  });

  document.getElementById("btn-acessar").addEventListener("click", async () => {
    try {
      if (!moduloConectadoMAC) throw new Error("MAC não encontrado.");
      abrirModal("modal-sincronizando");
      atualizarIDModal(moduloConectadoId);

      const dados = await eel.realizar_handshake(moduloConectadoMAC)();
      if (dados.erro) throw new Error(dados.erro);

      await new Promise(r => setTimeout(r, 500));
      abrirModal("modal-conectado");
    } catch (err) {
      console.error(err);
      abrirModal("modal-falhou");
    }
  });
});

async function carregarModulos() {
  const lista = await obterListaModulos();
  const tbody = document.getElementById("modulos-tbody");

  for (const modId of lista) {
    const dados = await carregarModulo(modId);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dados.id}</td>
      <td>${dados.medicamento || "-"}</td>
      <td>${dados.dosagem || "-"}</td>
      <td>${dados.estoque_atual || "0"}</td>
      <td>${dados.paciente || "-"}</td>
      <td>Ativo</td>
    `;
    tbody.appendChild(tr);
  }
}

// Botões dos modais
document.getElementById("btn-cancelar-sync")?.addEventListener("click", () => fecharModal("modal-sincronizando"));
document.getElementById("btn-tentar-sync")?.addEventListener("click", () => {
  fecharModal("modal-sincronizando");
  document.getElementById("btn-acessar").click();
});

document.getElementById("btn-cancelar-falha")?.addEventListener("click", () => fecharModal("modal-falhou"));
document.getElementById("btn-tentar-falha")?.addEventListener("click", () => {
  fecharModal("modal-falhou");
  document.getElementById("btn-acessar").click();
});
