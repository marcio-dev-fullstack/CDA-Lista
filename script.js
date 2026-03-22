// --- DADOS DAS EMPRESAS (Mantenha as suas aqui) ---
let empresas = [
    { id: 1, nome: "Hotel Araguaia", categoria: "Hotéis & Pousadas", zap: "5594992500073", endereco: "Av. Beira Rio, Centro", descricao: "O melhor conforto de CDA.", img: "img/hotel.jpg" },
    { id: 2, nome: "Restaurante Beira Rio", categoria: "Restaurantes", zap: "5594992500073", endereco: "Orla de CDA", descricao: "Peixes frescos todos os dias.", img: "img/restaurante.jpg" },
    // Adicione todas as suas empresas aqui...
];

let tempoRestante = 30;
let intervaloPopup;

window.onload = () => {
    iniciarContadorPopup();
    // Renderiza sempre em ordem alfabética por padrão
    renderizarEmpresas(empresas);
};

// --- FUNÇÃO DE RENDERIZAÇÃO ---
function renderizarEmpresas(lista) {
    const container = document.getElementById('listaPrincipal');
    if (!container) return;
    
    container.innerHTML = '';

    // GARANTE A ORDEM ALFABÉTICA
    const listaAlfabetica = [...lista].sort((a, b) => a.nome.localeCompare(b.nome));

    listaAlfabetica.forEach(empresa => {
        const card = document.createElement('div');
        card.className = 'card-empresa';
        // O clique no card abre o modal com os dados
        card.onclick = () => abrirModal(empresa.id);
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${empresa.img}" alt="${empresa.nome}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="card-info">
                <h3>${empresa.nome}</h3>
                <span class="categoria-label">${empresa.categoria}</span>
                <button class="btn-ver-mais">Ver Detalhes</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- LOGICA DO MODAL DE DADOS ---
function abrirModal(id) {
    const empresa = empresas.find(e => e.id === id);
    const modal = document.getElementById('modalDetalhes');
    const conteudo = document.getElementById('conteudoEmpresa');

    conteudo.innerHTML = `
        <img src="${empresa.img}" style="width:100%; border-radius:10px; margin-bottom:15px;">
        <h2 style="color:#1e40af">${empresa.nome}</h2>
        <p><strong>Categoria:</strong> ${empresa.categoria}</p>
        <p><strong>Endereço:</strong> ${empresa.endereco || 'Não informado'}</p>
        <p style="margin: 15px 0;">${empresa.descricao || ''}</p>
        <a href="https://wa.me/${empresa.zap}" target="_blank" class="btn-zap" style="display:block; text-align:center;">
            Falar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
}

// --- FUNÇÕES DE INTERFACE ---
function fecharPopup() {
    document.getElementById('popupAnuncio').style.display = 'none';
    clearInterval(intervaloPopup);
}

function iniciarContadorPopup() {
    const contador = document.getElementById('contador');
    intervaloPopup = setInterval(() => {
        tempoRestante--;
        if(contador) contador.innerText = tempoRestante;
        if(tempoRestante <= 0) fecharPopup();
    }, 1000);
}

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlayMenu');
    if (menu.style.left === '0px') {
        menu.style.left = '-280px';
        overlay.style.display = 'none';
    } else {
        menu.style.left = '0px';
        overlay.style.display = 'block';
    }
}