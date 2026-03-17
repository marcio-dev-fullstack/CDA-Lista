let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

const listaPrincipal = document.getElementById('listaPrincipal');
const inputBusca = document.getElementById('inputBusca');

async function carregar() {
    try {
        const res = await fetch('dados.json');
        empresas = await res.json();
        renderizar(empresas);
    } catch (err) {
        console.error(err);
        listaPrincipal.innerHTML = "<p>Erro ao carregar os dados.</p>";
    }
}

function renderizar(dados) {
    if (!listaPrincipal) return;
    listaPrincipal.innerHTML = dados.map(emp => {
        const isFav = favoritos.includes(emp.id);
        return `
            <div class="card">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')">★</button>
                <div onclick="abrirModal('${emp.id}')" style="cursor:pointer">
                    <img src="${emp.logo || 'https://via.placeholder.com/85'}" class="logo-card">
                    <h3>${emp.nome}</h3>
                    <p><strong>${emp.categoria}</strong></p>
                </div>
            </div>
        `;
    }).join('');
}

function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(cat) || (cat === 'Todas' && btn.innerText === 'Todas'));
    });
    filtrar();
}

function filtrar() {
    const termo = inputBusca.value.toLowerCase();
    const filtrados = empresas.filter(e => {
        const matchCat = (categoriaAtual === 'Todas' || e.categoria === categoriaAtual);
        const matchBusca = e.nome.toLowerCase().includes(termo) || e.categoria.toLowerCase().includes(termo);
        return matchCat && matchBusca;
    });
    renderizar(filtrados);
}

function toggleFavorito(event, id) {
    event.stopPropagation();
    const index = favoritos.indexOf(id);
    index > -1 ? favoritos.splice(index, 1) : favoritos.push(id);
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    categoriaAtual === 'Favoritos' ? mostrarFavoritos() : filtrar();
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    renderizar(empresas.filter(e => favoritos.includes(e.id)));
}

function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;
    
    const botaoSite = e.site ? `<a href="${e.site}" target="_blank" class="link-site">Visitar Website</a>` : '';

    document.getElementById('conteudoEmpresa').innerHTML = `
        <img src="${e.logo}" class="logo-modal" style="width:100px; margin-bottom:20px;">
        <h2>${e.nome}</h2>
        <div style="text-align: left; margin-top:15px;">
            <p><strong>📍 Endereço:</strong> ${e.endereco}</p>
            <p><strong>📝 Sobre:</strong> ${e.descricao}</p>
            <p><strong>📞 Contato:</strong> ${e.telefone}</p>
        </div>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">Falar no WhatsApp</a>
        ${botaoSite}
    `;
    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
}

window.onclick = (e) => {
    if (e.target.id == 'modalDetalhes') fecharModal();
};

carregar();