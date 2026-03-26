/* PROJETO: CDA LISTA 
   DESENVOLVEDOR: Márcio Oliveira (RAZGO)
   FUNCIONALIDADE: Grid de 4 colunas, Busca e Janela de Dados (Dados Padrão RAZGO)
*/

// --- 1. BANCO DE DADOS (CDA LISTA) ---
const empresas = [
    // --- SEU GRUPO ---
    { id: 1, nome: "RAZGO", categoria: "Tecnologia", img: "img/logo-cda3.jpg" },
    { id: 2, nome: "KM Projetos & Engenharia", categoria: "Engenharia", img: "img/logo-cda3.jpg" },
    { id: 3, nome: "MAZZ", categoria: "Educação", img: "img/logo-cda3.jpg" },
    { id: 4, nome: "MR Treinamentos", categoria: "Segurança do Trabalho", img: "img/logo-cda3.jpg" },

    // --- JURÍDICO ---
    { id: 25, nome: "J. Carlos Advogados", categoria: "Jurídico", img: "https://via.placeholder.com/150" },

    // --- OUTRAS EMPRESAS ---
    { id: 5, nome: "Restaurante Zé Piranha", categoria: "Restaurantes", img: "https://via.placeholder.com/150" },
    { id: 6, nome: "Bateau Mouche Rio Araguaia", categoria: "Praias & Lazer", img: "https://via.placeholder.com/150" },
    { id: 7, nome: "Burgg's Lanches", categoria: "Restaurantes", img: "https://via.placeholder.com/150" },
    { id: 8, nome: "Sorveteria Gebon", categoria: "Restaurantes", img: "https://via.placeholder.com/150" },
    { id: 9, nome: "Aiqfome CDA", categoria: "Tecnologia", img: "https://via.placeholder.com/150" },
    { id: 10, nome: "Pizzaria Top 10", categoria: "Restaurantes", img: "https://via.placeholder.com/150" },
    { id: 11, nome: "Hotel Tarumã", categoria: "Hotéis & Pousadas", img: "https://via.placeholder.com/150" },
    { id: 14, nome: "Supermercado Econômico", categoria: "Supermercados", img: "https://via.placeholder.com/150" },
    { id: 17, nome: "Farmácia Preço Baixo", categoria: "Saúde", img: "https://via.placeholder.com/150" },
    { id: 22, nome: "JamJoy Transportes", categoria: "Transporte", img: "https://via.placeholder.com/150" },
    { id: 23, nome: "Sicredi CDA", categoria: "Financeiro", img: "https://via.placeholder.com/150" },
    { id: 24, nome: "Equatorial Energia", categoria: "Serviços Públicos", img: "https://via.placeholder.com/150" }
];

let tempoRestante = 30;
let intervaloPopup;

// --- 2. INICIALIZAÇÃO ---
window.onload = () => {
    // Ordenar de A a Z por padrão
    const listaOrdenada = [...empresas].sort((a, b) => a.nome.localeCompare(b.nome));
    renderizarGrid(listaOrdenada);
    iniciarContadorPopup();
};

// --- 3. RENDERIZAÇÃO DO GRID (4 COLUNAS VIA CSS) ---
function renderizarGrid(lista) {
    const container = document.getElementById('listaPrincipal');
    if (!container) return;
    container.innerHTML = '';

    lista.forEach(empresa => {
        const card = document.createElement('div');
        card.className = 'card-empresa';
        card.onclick = () => abrirJanelaDados(empresa.id);
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${empresa.img}" alt="${empresa.nome}" onerror="this.src='img/logo-cda3.jpg'">
            </div>
            <div class="card-info">
                <h3>${empresa.nome}</h3>
                <span class="categoria-label">${empresa.categoria}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 4. JANELA DE DADOS (MODAL) - COM DADOS PADRÃO RAZGO ---
function abrirJanelaDados(id) {
    const empresa = empresas.find(e => e.id === id);
    const modal = document.getElementById('modalDados');
    if (!modal || !empresa) return;

    // Logo e Nome da empresa clicada
    document.getElementById('mLogo').src = empresa.img;
    document.getElementById('mNome').innerText = empresa.nome;

    // --- DADOS PADRÃO SOLICITADOS ---
    const enderecoPadrao = "Conceição do Araguaia - PA";
    const zapPadrao = "94992500073";
    const sitePadrao = "razgo.com.br";

    // Preenchendo Endereço
    document.getElementById('mEndereco').innerText = enderecoPadrao;

    // Preenchendo WhatsApp (Texto e Link)
    document.getElementById('mZapText').innerText = zapPadrao;
    document.getElementById('mZapLink').href = `https://wa.me/55${zapPadrao}`;

    // Preenchendo Site (Texto e Link)
    const siteArea = document.getElementById('mSiteArea');
    const siteLink = document.getElementById('mSiteLink');
    const siteText = document.getElementById('mSiteText');

    if (siteArea) siteArea.style.display = 'block';
    if (siteText) siteText.innerText = sitePadrao;
    if (siteLink) {
        siteLink.style.display = 'inline-block';
        siteLink.href = `https://${sitePadrao}`;
    }

    modal.style.display = 'flex';
}

function fecharJanelaDados() {
    const modal = document.getElementById('modalDados');
    if(modal) modal.style.display = 'none';
}

// --- 5. BUSCA E FILTROS ---
function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => 
        e.nome.toLowerCase().includes(termo) || 
        e.categoria.toLowerCase().includes(termo)
    );
    renderizarGrid(filtrados.sort((a, b) => a.nome.localeCompare(b.nome)));
}

function filtrarPorCategoria(cat) {
    if (cat === 'Todas') {
        renderizarGrid([...empresas].sort((a, b) => a.nome.localeCompare(b.nome)));
    } else {
        const filtrados = empresas.filter(e => e.categoria === cat);
        renderizarGrid(filtrados.sort((a, b) => a.nome.localeCompare(b.nome)));
    }
    toggleMenu(); // Fecha o menu lateral
}

// --- 6. UTILITÁRIOS (POPUP E MENU) ---
function iniciarContadorPopup() {
    const contador = document.getElementById('contador');
    intervaloPopup = setInterval(() => {
        tempoRestante--;
        if(contador) contador.innerText = tempoRestante;
        if(tempoRestante <= 0) fecharPopup();
    }, 1000);
}

function fecharPopup() {
    const popup = document.getElementById('popupAnuncio');
    if(popup) popup.style.display = 'none';
    clearInterval(intervaloPopup);
}

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlayMenu');
    if (!menu) return;

    if (menu.style.left === '0px') {
        menu.style.left = '-280px';
        if(overlay) overlay.style.display = 'none';
    } else {
        menu.style.left = '0px';
        if(overlay) overlay.style.display = 'block';
    }
}