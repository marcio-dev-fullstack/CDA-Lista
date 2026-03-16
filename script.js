let empresas = [];

const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');

async function carregar() {
    try {
        const res = await fetch('dados.json');
        empresas = await res.json();
        renderizar(empresas);
    } catch (err) {
        listaPrincipal.innerHTML = "<p>Erro ao carregar a base de dados.</p>";
    }
}

function renderizar(dados) {
    if (dados.length === 0) {
        listaPrincipal.innerHTML = "<p>Nenhuma empresa encontrada.</p>";
        return;
    }

    listaPrincipal.innerHTML = dados.map(emp => `
        <div class="card" onclick="abrirModal('${emp.id}')">
            <img src="${emp.logo}" class="logo-card" alt="Logo">
            <h3>${emp.nome}</h3>
            <p><strong>Setor:</strong> ${emp.categoria}</p>
        </div>
    `).join('');
}

function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => 
        e.nome.toLowerCase().includes(termo) || 
        e.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
}

function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;

    conteudoModal.innerHTML = `
        <img src="${e.logo}" class="logo-modal" alt="Logo">
        <h2 style="color: #1e40af; margin-top: 0;">${e.nome}</h2>
        <p><strong>📍 Endereço:</strong> ${e.endereco}</p>
        <p><strong>📝 Descrição:</strong> ${e.descricao}</p>
        <p><strong>📞 Contato:</strong> ${e.telefone}</p>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">
            Falar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() { modal.style.display = 'none'; }
btnFechar.onclick = fecharModal;
window.onclick = (e) => { if (e.target == modal) fecharModal(); };

carregar();