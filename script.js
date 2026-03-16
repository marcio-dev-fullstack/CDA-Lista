let empresas = [];
let categoriaAtual = 'Todas';

// Seletores do DOM
const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');

// 1. Carregar dados do JSON
async function carregar() {
    try {
        const res = await fetch('dados.json');
        if (!res.ok) throw new Error("Erro ao carregar arquivo");
        empresas = await res.json();
        renderizar(empresas);
    } catch (err) {
        console.error(err);
        listaPrincipal.innerHTML = "<p style='text-align:center;'>Erro ao carregar a base de dados comercial.</p>";
    }
}

// 2. Renderizar a lista com efeito Fade-In
function renderizar(dados) {
    // Primeiro, aplicamos um efeito de saída (opcional, para suavizar a troca)
    listaPrincipal.style.opacity = '0';
    
    setTimeout(() => {
        if (dados.length === 0) {
            listaPrincipal.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Nenhuma empresa encontrada nesta categoria.</p>";
        } else {
            listaPrincipal.innerHTML = dados.map(emp => `
                <div class="card" onclick="abrirModal('${emp.id}')" style="animation: fadeInSuave 0.5s ease forwards;">
                    <img src="${emp.logo || 'https://via.placeholder.com/150?text=Sem+Logo'}" class="logo-card" alt="Logo ${emp.nome}">
                    <h3>${emp.nome}</h3>
                    <p><strong>${emp.categoria}</strong></p>
                </div>
            `).join('');
        }
        // Volta a opacidade para 1
        listaPrincipal.style.opacity = '1';
    }, 100);
}

// 3. Sistema de Filtro por Nome (Busca)
function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => 
        (categoriaAtual === 'Todas' || e.categoria === categoriaAtual) &&
        e.nome.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
}

// 4. Sistema de Filtro por Abas (Categorias)
function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    
    // Atualiza o estado visual dos botões de aba
    document.querySelectorAll('.tab-btn').forEach(btn => {
        // Remove a classe active de todos
        btn.classList.remove('active');
        // Adiciona apenas no botão clicado (comparando o texto do botão)
        const textoBotao = btn.innerText;
        if (cat === 'Todas' && textoBotao === 'Todas') btn.classList.add('active');
        if (cat === 'Restaurante' && textoBotao === 'Restaurantes') btn.classList.add('active');
        if (cat === 'Hotel' && textoBotao === 'Hotéis') btn.classList.add('active');
        if (cat === 'Supermercado' && textoBotao === 'Mercados') btn.classList.add('active');
        if (cat === 'Farmácia' && textoBotao === 'Saúde') btn.classList.add('active');
    });

    const filtrados = cat === 'Todas' ? empresas : empresas.filter(e => e.categoria === cat);
    renderizar(filtrados);
}

// 5. Modal de Detalhes
function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;

    conteudoModal.innerHTML = `
        <img src="${e.logo || 'https://via.placeholder.com/150?text=Sem+Logo'}" class="logo-modal" alt="Logo">
        <h2 style="color: #1e40af; margin-top: 0;">${e.nome}</h2>
        <p><strong>📍 Endereço:</strong> ${e.endereco || 'Conceição do Araguaia - PA'}</p>
        <p><strong>📝 Sobre:</strong> ${e.descricao || 'Empresa parceira do guia CDA-Lista.'}</p>
        <p><strong>📞 Contato:</strong> ${e.telefone || '(94) 99250-0073'}</p>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">
            Falar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
}

function fecharModal() {
    modal.style.display = 'none';
}

// Listeners de Fechamento
if(btnFechar) btnFechar.onclick = fecharModal;
window.onclick = (e) => { if (e.target == modal) fecharModal(); };

// Inicialização
carregar();