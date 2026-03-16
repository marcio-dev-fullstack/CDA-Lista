let empresas = [];

// Elementos do DOM
const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');

// 1. Carregar dados do arquivo JSON
async function iniciarSite() {
    try {
        const response = await fetch('dados.json');
        empresas = await response.json();
        exibirEmpresas(empresas);
    } catch (error) {
        listaPrincipal.innerHTML = "<p>Erro ao carregar lista de empresas.</p>";
    }
}

// 2. Renderizar os cards na tela
function exibirEmpresas(lista) {
    if (lista.length === 0) {
        listaPrincipal.innerHTML = "<p>Nenhuma empresa encontrada.</p>";
        return;
    }

    listaPrincipal.innerHTML = lista.map(emp => `
        <div class="card" onclick="abrirModal(${emp.id})">
            <h3>${emp.nome}</h3>
            <p><strong>Categoria:</strong> ${emp.categoria || 'Geral'}</p>
            <p>📍 ${emp.endereco || 'C. Araguaia'}</p>
        </div>
    `).join('');
}

// 3. Filtro de busca
function filtrarEmpresas() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtradas = empresas.filter(emp => 
        emp.nome.toLowerCase().includes(termo) || 
        emp.categoria.toLowerCase().includes(termo)
    );
    exibirEmpresas(filtradas);
}

// 4. Funções do Modal
function abrirModal(id) {
    const emp = empresas.find(e => e.id == id);
    if (!emp) return;

    conteudoModal.innerHTML = `
        <h2 style="color: #1e40af;">${emp.nome}</h2>
        <p><strong>Categoria:</strong> ${emp.categoria}</p>
        <p><strong>Endereço:</strong> ${emp.endereco || 'Não informado'}</p>
        <p><strong>Descrição:</strong> ${emp.descricao || 'Empresa parceira de Conceição do Araguaia.'}</p>
        <a href="https://wa.me/55${emp.whatsapp}" target="_blank" class="btn-zap">
            Conversar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() { modal.style.display = 'none'; }

// Eventos de fechar
btnFechar.onclick = fecharModal;
window.onclick = (e) => { if (e.target === modal) fecharModal(); };

// Iniciar app
iniciarSite();