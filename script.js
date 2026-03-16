let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');

async function carregar() {
    try {
        const res = await fetch('dados.json');
        if (!res.ok) throw new Error("Não foi possível encontrar o arquivo dados.json");
        
        const texto = await res.text(); // Lemos como texto primeiro para validar
        try {
            empresas = JSON.parse(texto);
            renderizar(empresas);
        } catch (e) {
            console.error("Erro de sintaxe no JSON:", e);
            listaPrincipal.innerHTML = `<div style="text-align:center; padding:20px; color:red;">
                <h3>Erro no arquivo de dados!</h3>
                <p>Existe um erro de pontuação no seu <b>dados.json</b> próximo à linha do erro apontado no console (F12).</p>
            </div>`;
        }
    } catch (err) {
        listaPrincipal.innerHTML = "<p style='text-align:center;'>Erro ao conectar com o servidor.</p>";
    }
}

function renderizar(dados) {
    if (!listaPrincipal) return;
    listaPrincipal.style.opacity = '0';
    
    setTimeout(() => {
        if (!dados || dados.length === 0) {
            listaPrincipal.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Nenhum item encontrado.</p>";
        } else {
            listaPrincipal.innerHTML = dados.map(emp => {
                const isFav = favoritos.includes(emp.id);
                return `
                <div class="card" style="animation: fadeInSuave 0.5s ease forwards;">
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')">
                        ${isFav ? '★' : '☆'}
                    </button>
                    <div onclick="abrirModal('${emp.id}')">
                        <img src="${emp.logo}" class="logo-card" onerror="this.src='https://via.placeholder.com/80?text=LOGO'">
                        <h3>${emp.nome}</h3>
                        <p><strong>${emp.categoria}</strong></p>
                    </div>
                </div>
            `}).join('');
        }
        listaPrincipal.style.opacity = '1';
    }, 100);
}

function toggleFavorito(event, id) {
    event.stopPropagation();
    const index = favoritos.indexOf(id);
    index > -1 ? favoritos.splice(index, 1) : favoritos.push(id);
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    
    if (categoriaAtual === 'Favoritos') {
        mostrarFavoritos();
    } else {
        renderizar(filtrarDados());
    }
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    atualizarBotoes('⭐ Favoritos');
    const filtrados = empresas.filter(e => favoritos.includes(e.id));
    renderizar(filtrados);
}

function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    const nomesBotoes = {
        'Todas': 'Todas',
        'Restaurante': 'Restaurantes',
        'Hotel': 'Hotéis',
        'Supermercado': 'Mercados',
        'Farmácia': 'Saúde'
    };
    atualizarBotoes(nomesBotoes[cat] || 'Todas');
    renderizar(filtrarDados());
}

function filtrar() {
    renderizar(filtrarDados());
}

function filtrarDados() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    return empresas.filter(e => 
        (categoriaAtual === 'Todas' || e.categoria === categoriaAtual) &&
        e.nome.toLowerCase().includes(termo)
    );
}

function atualizarBotoes(textoAtivo) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === textoAtivo);
    });
}

function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;
    conteudoModal.innerHTML = `
        <img src="${e.logo}" class="logo-modal" onerror="this.src='https://via.placeholder.com/120?text=LOGO'">
        <h2>${e.nome}</h2>
        <p><strong>📍 Endereço:</strong> ${e.endereco}</p>
        <p><strong>📝 Sobre:</strong> ${e.descricao}</p>
        <p><strong>📞 Contato:</strong> ${e.telefone}</p>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">Falar no WhatsApp</a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() { modal.style.display = 'none'; }
if(btnFechar) btnFechar.onclick = fecharModal;
window.onclick = (e) => { if (e.target == modal) fecharModal(); };

carregar();