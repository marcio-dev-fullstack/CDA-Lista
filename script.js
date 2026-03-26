/* PROJETO: CDA LISTA 
   DESENVOLVEDOR: Márcio Oliveira (RAZGO)
   FUNCIONALIDADE: Grid 4 Colunas, Busca, Modal e Blindagem de Imagens
*/

// --- 1. BANCO DE DADOS (CDA LISTA) ---
const empresas = [
    // --- SEU GRUPO ---
    { id: 1, nome: "RAZGO", categoria: "Tecnologia", img: "img/logo-cda3.jpg" }, // Caminho Correto
    { id: 2, nome: "KM Projetos & Engenharia", categoria: "Engenharia", img: "img/logo-cda3.jpg" },
    { id: 3, nome: "MAZZ", categoria: "Educação", img: "img/logo-cda3.jpg" },
    { id: 4, nome: "MR Treinamentos", categoria: "Segurança do Trabalho", img: "img/logo-cda3.jpg" },

    // --- JURÍDICO ---
    // CORREÇÃO AQUI: Garanta que 'j-carlos.jpg' exista na pasta 'img' ou use o placeholder abaixo
    { id: 25, nome: "J. Carlos Advogados", categoria: "Jurídico", img: "https://via.placeholder.com/150?text=J.Carlos+Advogados" },

    // --- GASTRONOMIA ---
    { id: 5, nome: "Restaurante Zé Piranha", categoria: "Restaurantes", img: "https://via.placeholder.com/150?text=Ze+Piranha" },
    { id: 6, nome: "Bateau Mouche Rio Araguaia", categoria: "Praias & Lazer", img: "https://via.placeholder.com/150?text=Bateau+Mouche" },
    { id: 7, nome: "Burgg's Lanches", categoria: "Restaurantes", img: "https://via.placeholder.com/150?text=Burggs" },
    { id: 8, nome: "Sorveteria Gebon", categoria: "Restaurantes", img: "https://via.placeholder.com/150?text=Sorveteria+Gebon" },
    { id: 9, nome: "Aiqfome CDA", categoria: "Tecnologia", img: "https://via.placeholder.com/150?text=Aiqfome" },

    // --- SERVIÇOS E COMÉRCIO ---
    { id: 24, nome: "Equatorial Energia", categoria: "Serviços Públicos", img: "https://via.placeholder.com/150?text=Equatorial" },
    { id: 11, nome: "Hotel Tarumã", categoria: "Hotéis & Pousadas", img: "https://via.placeholder.com/150?text=Hotel+Taruma" },
    { id: 17, nome: "Farmácia Preço Baixo", categoria: "Saúde", img: "https://via.placeholder.com/150?text=Farmacia+Preco+Baixo" },
    { id: 22, nome: "JamJoy Transportes", categoria: "Transporte", img: "https://via.placeholder.com/150?text=JamJoy" },
    { id: 23, nome: "Sicredi CDA", categoria: "Financeiro", img: "https://via.placeholder.com/150?text=Sicredi" }
];

// Caminho para a imagem padrão caso a original falhe
const IMAGEM_PADRAO = "img/logo-cda3.jpg";

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

    if (lista.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 50px; opacity: 0.5;">Nenhuma empresa encontrada...</p>`;
        return;
    }

    lista.forEach(empresa => {
        const card = document.createElement('div');
        card.className = 'card-empresa';
        card.onclick = () => abrirJanelaDados(empresa.id);
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${empresa.img}" alt="${empresa.nome}" onerror="this.onerror=null; this.src='${IMAGEM_PADRAO}';">
            </div>
            <div class="card-info">
                <h3>${empresa.nome}</h3>
                <span class="categoria-label">${empresa.categoria}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 4. JANELA DE DADOS (MODAL) - COM BLINDAGEM DE IMAGEM ---
function abrirJanelaDados(id) {
    const empresa = empresas.find(e => e.id === id);
    const modal = document.getElementById('modalDados');
    if (!modal || !empresa) return;

    // Logo e Nome da empresa clicada
    const modalLogo = document.getElementById('mLogo');
    if (modalLogo) {
        modalLogo.src = empresa.img;
        // BLINDAGEM NO MODAL: onerror chama a imagem padrão
        modalLogo.onerror = () => {
            modalLogo.src = IMAGEM_PADRAO;
        };
    }

    if (document.getElementById('mNome')) document.getElementById('mNome').innerText = empresa.nome;

    // --- DADOS PADRÃO RAZGO TRAVADOS ---
    const enderecoPadrao = "Conceição do Araguaia - PA";
    const zapPadrao = "94992500073";
    const sitePadrao = "razgo.com.br";

    if (document.getElementById('mEndereco')) document.getElementById('mEndereco').innerText = enderecoPadrao;
    if (document.getElementById('mZapText')) document.getElementById('mZapText').innerText = zapPadrao;
    if (document.getElementById('mZapLink')) document.getElementById('mZapLink').href = `https://wa.me/55${zapPadrao}`;

    // Lógica do Site
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
        menu.style.left = '-300px';
        if(overlay) overlay.style.display = 'none';
    } else {
        menu.style.left = '0px';
        if(overlay) overlay.style.display = 'block';
    }
}