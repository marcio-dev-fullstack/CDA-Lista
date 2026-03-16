let empresas = [];

const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');

// 1. Buscar dados no JSON
async function carregar() {
    try {
        const res = await fetch('dados.json');
        empresas = await res.json();
        renderizar(empresas);
    } catch (err) {
        listaPrincipal.innerHTML = "<p>Erro ao carregar a base de dados.</p>";
    }
}

// 2. Criar os cards na tela
function renderizar(dados) {
    if (dados.length === 0) {
        listaPrincipal.innerHTML = "<p>Nenhuma empresa encontrada.</p>";
        return;
    }

    listaPrincipal.innerHTML = dados.map(emp => `
        <div class="card" onclick="abrirModal('${emp.id}')">
            <h3>${emp.nome}</h3>
            <p><strong>Setor:</strong> ${emp.categoria || 'Geral'}</p>
            <p>📍 ${emp.endereco || 'C. Araguaia - PA'}</p>
        </div>
    `).join('');
}

// 3. Sistema de Filtro
function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => 
        e.nome.toLowerCase().includes(termo) || 
        (e.categoria && e.categoria.toLowerCase().includes(termo))
    );
    renderizar(filtrados);
}

// 4. Modal
function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;

    conteudoModal.innerHTML = `
        <h2 style="color: #1e40af; margin-top: 0;">${e.nome}</h2>
        <p><strong>📍 Endereço:</strong> ${e.endereco || 'Consulte no WhatsApp'}</p>
        <p><strong>📝 Descrição:</strong> ${e.descricao || 'Empresa participante do guia CDA-Lista.'}</p>
        <p><strong>📞 Contato:</strong> ${e.telefone || 'Não informado'}</p>
        
        <a href="https://wa.me/55${e.whatsapp}" target="_blank" class="link-whatsapp">
            Falar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() { modal.style.display = 'none'; }

// Fechar eventos
btnFechar.onclick = fecharModal;
window.onclick = (event) => { if (event.target == modal) fecharModal(); };

// Iniciar
carregar();