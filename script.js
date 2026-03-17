let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

async function carregar() {
    try {
        const res = await fetch('dados.json');
        const dados = await res.json();
        empresas = dados.sort((a, b) => a.nome.localeCompare(b.nome));
        renderizar(empresas);
    } catch (err) { console.error(err); }
}

function renderizar(dados) {
    const lista = document.getElementById('listaPrincipal');
    if (!lista) return;
    lista.innerHTML = dados.map(emp => {
        const isFav = favoritos.includes(emp.id);
        return `
            <div class="card">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')">★</button>
                <div onclick="abrirModal('${emp.id}')" style="cursor:pointer">
                    <img src="${emp.logo}" class="logo-card" onerror="this.src='https://img.icons8.com/fluency/150/group-of-companies.png'">
                    <h3>${emp.nome}</h3>
                    <p><strong>${emp.categoria}</strong></p>
                </div>
            </div>
        `;
    }).join('');
}

function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('overlayMenu').classList.toggle('active');
}

function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    if (document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
    
    document.querySelectorAll('.tab-btn, .menu-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(cat) || (cat === 'Todas' && btn.innerText === 'Todas'));
    });
    filtrar();
}

function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => {
        const mCat = (categoriaAtual === 'Todas' || e.categoria === categoriaAtual);
        const mBusca = e.nome.toLowerCase().includes(termo);
        return mCat && mBusca;
    });
    renderizar(filtrados);
}

function toggleFavorito(event, id) {
    event.stopPropagation();
    const idx = favoritos.indexOf(id);
    idx > -1 ? favoritos.splice(idx, 1) : favoritos.push(id);
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    renderizar(empresas);
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    if (document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
    renderizar(empresas.filter(e => favoritos.includes(e.id)));
}

function abrirModal(id) {
    const e = empresas.find(i => i.id == id);
    if (!e) return;
    const botaoSite = e.site ? `<a href="${e.site}" target="_blank" class="link-site">Visitar Website</a>` : '';
    document.getElementById('conteudoEmpresa').innerHTML = `
        <img src="${e.logo}" style="width:80px; margin-bottom:15px;" onerror="this.src='https://img.icons8.com/fluency/150/group-of-companies.png'">
        <h2>${e.nome}</h2>
        <div style="text-align:left; margin-top:15px; font-size:14px;">
            <p>📍 ${e.endereco}</p>
            <p>📞 ${e.telefone}</p>
            <p>📝 ${e.descricao}</p>
        </div>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">WhatsApp</a>
        ${botaoSite}
    `;
    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModal() { document.getElementById('modalDetalhes').style.display = 'none'; }
window.onclick = (e) => { if (e.target.id == 'modalDetalhes') fecharModal(); };

carregar();