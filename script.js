let todasAsEmpresas = [];

// Seletores
const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');

// 1. Busca os dados no JSON
async function buscarEmpresas() {
    try {
        const res = await fetch('dados.json');
        todasAsEmpresas = await res.json();
        exibirEmpresas(todasAsEmpresas);
    } catch (e) {
        listaPrincipal.innerHTML = "<p>Erro ao carregar os dados.</p>";
    }
}

// 2. Renderiza os cards na tela
function exibirEmpresas(lista) {
    listaPrincipal.innerHTML = lista.map(emp => `
        <div class="card" onclick="abrirDetalhes('${emp.id}')">
            <h3>${emp.nome}</h3>
            <p>📍 ${emp.categoria || 'Comércio'}</p>
            <small style="color: #2563eb;">Ver mais detalhes</small>
        </div>
    `).join('');
}

// 3. Gerencia o Modal
function abrirDetalhes(id) {
    const empresa = todasAsEmpresas.find(e => e.id == id);
    if (!empresa) return;

    conteudoModal.innerHTML = `
        <h2 style="margin-top:0;">${empresa.nome}</h2>
        <p><strong>Endereço:</strong> ${empresa.endereco || 'Consulte-nos'}</p>
        <p><strong>Telefone:</strong> ${empresa.telefone || 'Não informado'}</p>
        <p><strong>Sobre:</strong> ${empresa.descricao || 'Empresa de CDA.'}</p>
        <a href="https://wa.me/55${empresa.whatsapp}" target="_blank" class="btn-zap">
            Conversar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() {
    modal.style.display = 'none';
}

// Eventos
btnFechar.onclick = fecharModal;
window.onclick = (e) => { if (e.target === modal) fecharModal(); };

// Iniciar
buscarEmpresas();