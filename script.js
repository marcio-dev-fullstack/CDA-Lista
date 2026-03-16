let database = [];

const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');

// 1. Carregar os dados
async function carregarDados() {
    try {
        const resposta = await fetch('dados.json');
        database = await resposta.json();
        renderizar(database);
    } catch (err) {
        listaPrincipal.innerHTML = "<p>Erro ao conectar com a base de dados.</p>";
    }
}

// 2. Renderizar a lista (cards)
function renderizar(lista) {
    if (lista.length === 0) {
        listaPrincipal.innerHTML = "<p>Nenhuma empresa encontrada.</p>";
        return;
    }

    listaPrincipal.innerHTML = lista.map(emp => `
        <div class="card" onclick="abrirDetalhes('${emp.id}')">
            <h3>${emp.nome}</h3>
            <p><strong>Categoria:</strong> ${emp.categoria || 'Comércio'}</p>
            <p>📍 ${emp.endereco || 'C. Araguaia - PA'}</p>
        </div>
    `).join('');
}

// 3. Sistema de Busca
function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = database.filter(item => 
        item.nome.toLowerCase().includes(termo) || 
        item.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
}

// 4. Modal de Detalhes
function abrirDetalhes(id) {
    const item = database.find(e => e.id == id);
    if (!item) return;

    conteudoModal.innerHTML = `
        <h2 style="color: #1e40af; margin-top:0;">${item.nome}</h2>
        <p><strong>📍 Endereço:</strong> ${item.endereco || 'Não informado'}</p>
        <p><strong>📞 Contato:</strong> ${item.telefone || 'Não informado'}</p>
        <p><strong>📝 Sobre:</strong> ${item.descricao || 'Atendimento em Conceição do Araguaia.'}</p>
        
        <a href="https://wa.me/55${item.whatsapp}" target="_blank" class="link-whatsapp">
            Falar pelo WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() { modal.style.display = 'none'; }

// Fechar modal no botão e clicando fora
btnFechar.onclick = fecharModal;
window.onclick = (e) => { if (e.target === modal) fecharModal(); };

// Início
carregarDados();