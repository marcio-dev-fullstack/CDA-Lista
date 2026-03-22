/* PROJETO: CDA LISTA
   DESENVOLVEDOR: Márcio Oliveira (RAZGO)
   LÓGICA: Ordem Alfabética, Modal de Detalhes e Contador de 30s
*/

// --- 1. BANCO DE DADOS (Mantenha ou adicione suas empresas aqui) ---
let empresas = [
    { 
        id: 1, 
        nome: "Hotel Araguaia", 
        categoria: "Hotéis & Pousadas", 
        zap: "5594992500073", 
        endereco: "Av. Beira Rio, Centro - CDA", 
        descricao: "O melhor conforto e vista para o Rio Araguaia.", 
        img: "img/hotel.jpg" 
    },
    { 
        id: 2, 
        nome: "Restaurante Beira Rio", 
        categoria: "Restaurantes", 
        zap: "5594992500073", 
        endereco: "Orla de Conceição do Araguaia", 
        descricao: "Especialidade em peixes da região e comida caseira.", 
        img: "img/restaurante.jpg" 
    },
    // Adicione mais empresas seguindo este padrão...
];

let tempoRestante = 30;
let intervaloPopup;

// --- 2. INICIALIZAÇÃO ---
window.onload = () => {
    // Organiza por ordem alfabética antes de mostrar
    const listaOrdenada = [...empresas].sort((a, b) => a.nome.localeCompare(b.nome));
    renderizarEmpresas(listaOrdenada);
    iniciarContadorPopup();
};

// --- 3. RENDERIZAÇÃO DO GRID (6 COLUNAS NO PC) ---
function renderizarEmpresas(lista) {
    const container = document.getElementById('listaPrincipal');
    if (!container) return;
    
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">Nenhum comércio encontrado.</p>';
        return;
    }

    lista.forEach(empresa => {
        const card = document.createElement('div');
        card.className = 'card-empresa';
        card.onclick = () => abrirModal(empresa.id); // Clique abre os dados
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${empresa.img}" alt="${empresa.nome}" onerror="this.src='https://via.placeholder.com/300x150?text=CDA+LISTA'">
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

// --- 4. BUSCA EM TEMPO REAL ---
function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => 
        e.nome.toLowerCase().includes(termo) || 
        e.categoria.toLowerCase().includes(termo)
    );
    // Mantém a ordem alfabética na busca também
    filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
    renderizarEmpresas(filtrados);
}

function filtrarPorCategoria(cat) {
    if (cat === 'Todas') {
        renderizarEmpresas(empresas.sort((a, b) => a.nome.localeCompare(b.nome)));
    } else {
        const filtrados = empresas.filter(e => e.categoria === cat);
        renderizarEmpresas(filtrados.sort((a, b) => a.nome.localeCompare(b.nome)));
    }
    // Fecha menu no mobile se estiver aberto
    if (window.innerWidth < 768) toggleMenu();
}

// --- 5. MODAL DE DETALHES (JANELA DE DADOS) ---
function abrirModal(id) {
    const empresa = empresas.find(e => e.id === id);
    const modal = document.getElementById('modalDetalhes');
    const conteudo = document.getElementById('conteudoEmpresa');

    conteudo.innerHTML = `
        <img src="${empresa.img}" style="width:100%; border-radius:10px; margin-bottom:15px;" onerror="this.src='https://via.placeholder.com/300x150?text=CDA+LISTA'">
        <h2 style="color:#1e40af; margin-bottom:10px;">${empresa.nome}</h2>
        <p><strong>📍 Endereço:</strong> ${empresa.endereco || 'Conceição do Araguaia - PA'}</p>
        <p style="margin: 15px 0; color: #475569;">${empresa.descricao || 'Empresa parceira do CDA LISTA.'}</p>
        <a href="https://wa.me/${empresa.zap}?text=Olá! Vi sua empresa no CDA LISTA." target="_blank" class="btn-zap">
            Chamar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
}

// --- 6. POPUP DE ANÚNCIO (30 SEGUNDOS) ---
function iniciarContadorPopup() {
    const contador = document.getElementById('contador');
    intervaloPopup = setInterval(() => {
        tempoRestante--;
        if (contador) contador.innerText = tempoRestante;
        if (tempoRestante <= 0) fecharPopup();
    }, 1000);
}

function fecharPopup() {
    const popup = document.getElementById('popupAnuncio');
    if (popup) popup.style.display = 'none';
    clearInterval(intervaloPopup);
}

// --- 7. MENU LATERAL ---
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlayMenu');
    const aberto = menu.style.left === '0px';

    if (aberto) {
        menu.style.left = '-280px';
        overlay.style.display = 'none';
    } else {
        menu.style.left = '0px';
        overlay.style.display = 'block';
    }
}