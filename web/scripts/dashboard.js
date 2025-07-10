document.querySelector('.logout-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});


document.addEventListener("DOMContentLoaded", () => {
  fetch("dados/modulos/modulos_mock.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar os dados dos módulos");
      }
      return response.json();
    })
    .then(data => {
      const tbody = document.getElementById("modulos-tbody");

      data.forEach(modulo => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${modulo.id}</td>
            <td>${modulo.medicamento}</td>
            <td>${modulo.dose}</td>
            <td>${modulo.estoque}</td>
            <td>${modulo.paciente}</td>
            <td>${modulo.status}</td>
            <td class="acoes">
                <div class="acoes-wrapper">
                    <button class="icon-button" title="Editar módulo">
                        <img src="assets/icons/edit.svg" alt="Editar" />
                    </button>
                    <button class="icon-button" title="Remover módulo">
                        <img src="assets/icons/delete.svg" alt="Remover" />
                    </button>
                </div>
            </td>
        `;


        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar os módulos:", error);
    });
});


async function carregarModais() {
  const container = document.getElementById('modais-container');

  const arquivos = [
    'components/modal-editar.html',
    'components/modal-limpar.html',
    'components/modal-conectar.html'
  ];

  for (const arquivo of arquivos) {
    const res = await fetch(arquivo);
    const html = await res.text();
    container.insertAdjacentHTML('beforeend', html);
  }
}

window.addEventListener('DOMContentLoaded', carregarModais);
