// --- DADOS DAS EMPRESAS E UTILIDADE PÚBLICA ---
const utilidadePublica = [
    { nome: "PM - Polícia Militar", fone: "190", icone: "🚨" },
    { nome: "Corpo de Bombeiros", fone: "193", icone: "🚒" },
    { nome: "SAMU", fone: "192", icone: "🚑" },
    { nome: "Hospital Regional", fone: "(94) 3421-1601", icone: "🏥" },
    { nome: "Delegacia de Polícia", fone: "(94) 3421-1185", icone: "🚔" },
    { nome: "Conselho Tutelar", fone: "(94) 99123-4567", icone: "🛡️" } // Exemplo, ajuste o número
];

let empresas = [
    { id: 1, nome: "Hotel Araguaia", categoria: "Hotéis & Pousadas", zap: "5594992500073", img: "img/hotel.jpg", favorito: false },
    { id: 2, nome: "Restaurante Beira Rio", categoria: "Restaurantes", zap: "5594992500073", img: "img/restaurante.jpg", favorito: false },
    { id: 3, nome: "Praia da Gaivota", categoria: "Praias & Lazer", zap: "5594992500073", img: "img/praia.jpg", favorito: false },
    // Adicione mais empresas aqui conforme o cadastro crescer
];

let tempoRestante = 30;
let intervaloPopup;

// --- INICIALIZAÇÃO ---
window.onload = () => {
    // Inicia o popup de 30 segundos
    iniciarContadorPopup();
    
    // Carrega favoritos e renderiza
    carregarFavoritos();
    renderizarEmpresas(empresas);
    
    // Adiciona os números de emergência no topo do menu lateral
    renderizarEmergencias();
};

// --- LÓGICA DO POPUP (30 SEGUNDOS) ---
function iniciarContadorPopup() {
    const contadorElemento = document.getElementById('contador');
    const popup = document.getElementById('popupAnuncio');

    if (popup) popup.style.display = 'flex';

    intervaloPopup = setInterval(() => {
        tempoRestante--;
        if (contadorElemento) contadorElemento.innerText = tempoRestante;

        if (tempoRestante <= 0) {
            fecharPopup();
        }
    }, 1000);
}

function fecharPopup() {
    const popup = document.getElementById('popupAnuncio');
    if (popup) popup.style.display = 'none';
    clearInterval(intervaloPopup);
}

// --- RENDERIZAR NÚMEROS DE EMERGÊNCIA NO MENU ---
function renderizarEmergencias() {
    const menuNav = document.querySelector('.side-menu-nav');
    
    // Criar seção de emergência
    const divEmergencia = document.createElement('div');
    divEmergencia.className = 'secao-emergencia';
    divEmergencia.innerHTML = '<h4 style="color: #dc2626; padding: 10px; border-bottom: 1px solid #eee;">Emergência</h4>';
    
    utilidadePublica.forEach(item => {
        const link = document.createElement('a');
        link.href = `tel:${item.fone.replace(/\D/g,'')}`;
        link.className = 'menu-btn-emergencia';
        link.innerHTML = `<span>${item.icone} ${item.nome}</span> <strong>${item.fone}</strong>`;
        link.style.cssText = "display: flex; justify-content: space-between; padding: 10px; text-decoration: none; color: #333; font-size: 0.9rem; border-bottom: 1px solid #f5f5f5;";
        divEmergencia.appendChild(link);
    });

    // Insere no topo do menu lateral
    menuNav.prepend(divEmergencia);
}

// --- BUSCA E FILTROS ---
function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => 
        e.nome.toLowerCase().includes(termo) || 
        e.categoria.toLowerCase().includes(termo)
    );
    renderizarEmpresas(filtrados);
}

function filtrarPorCategoria(cat) {
    const botoes = document.querySelectorAll('.menu-btn, .tab-btn');
    botoes.forEach(b => b.classList.remove('active'));

    if (cat === 'Todas') {
        renderizarEmpresas(empresas);
    } else {
        const filtrados = empresas.filter(e => e.categoria === cat);
        renderizarEmpresas(filtrados);
    }
    
    if (window.innerWidth < 768) toggleMenu();
}

// --- RENDERIZAÇÃO DO GRID DE EMPRESAS ---
function renderizarEmpresas(lista) {
    const container = document.getElementById('listaPrincipal');
    if (!container) return;
    
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">Nenhum comércio encontrado nesta categoria.</p>';
        return;
    }

    lista.forEach(empresa => {
        const card = document.createElement('div');
        card.className = 'card-empresa';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${empresa.img}" alt="${empresa.nome}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="card-info">
                <h3>${empresa.nome}</h3>
                <span class="categoria-label">${empresa.categoria}</span>
                <div class="card-acoes">
                    <a href="https://wa.me/${empresa.zap}" target="_blank" class="btn-zap">WhatsApp</a>
                    <button onclick="toggleFavorito(${empresa.id})" class="btn-fav">
                        ${empresa.favorito ? '⭐' : '☆'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- MENU LATERAL (MOBILE) ---
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlayMenu');
    const estaAberto = menu.style.left === '0px';

    if (estaAberto) {
        menu.style.left = '-280px';
        overlay.style.display = 'none';
    } else {
        menu.style.left = '0px';
        overlay.style.display = 'block';
    }
}

// --- FAVORITOS (LOCALSTORAGE) ---
function toggleFavorito(id) {
    const index = empresas.findIndex(e => e.id === id);
    if (index !== -1) {
        empresas[index].favorito = !empresas[index].favorito;
        salvarFavoritos();
        renderizarEmpresas(empresas);
    }
}

function salvarFavoritos() {
    const favIds = empresas.filter(e => e.favorito).map(e => e.id);
    localStorage.setItem('cda_favs', JSON.stringify(favIds));
}

function carregarFavoritos() {
    const salvos = JSON.parse(localStorage.getItem('cda_favs')) || [];
    empresas.forEach(e => {
        if (salvos.includes(e.id)) e.favorito = true;
    });
}

function mostrarFavoritos() {
    const filtrados = empresas.filter(e => e.favorito);
    renderizarEmpresas(filtrados);
    if (window.innerWidth < 768) toggleMenu();
}