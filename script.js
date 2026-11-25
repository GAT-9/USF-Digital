// Marca que o JavaScript está ativo (o CSS só esconde os elementos animados nesse caso)
document.documentElement.classList.add('js');

// ---------- Aparecer ao rolar ----------
// Cada elemento com a classe "revelar" surge suavemente quando entra na tela.
const elementos = document.querySelectorAll('.revelar');

if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    // Pequeno atraso em cascata entre itens irmãos (um por vez)
    elementos.forEach((el) => {
        const irmaos = [...el.parentElement.children].filter((c) => c.classList.contains('revelar'));
        el.style.transitionDelay = `${irmaos.indexOf(el) * 0.12}s`;
        observador.observe(el);
    });
} else {
    elementos.forEach((el) => el.classList.add('visivel'));
}

// ---------- Botões A− / A+ (tamanho da letra) ----------
// Começa em 22px (125%): grande por padrão.
const tamanhos = ['125%', '137.5%', '156.25%', '175%', '200%'];
let nivel = 0;

const btnMenos = document.querySelector('[data-fonte="-1"]');
const btnMais = document.querySelector('[data-fonte="1"]');

try {
    const salvo = localStorage.getItem('usf-fonte-v2');
    if (salvo !== null && Number(salvo) >= 0 && Number(salvo) < tamanhos.length) nivel = Number(salvo);
} catch (e) { /* armazenamento indisponível: usa o padrão */ }

function aplicarFonte() {
    document.documentElement.style.fontSize = tamanhos[nivel];
    btnMenos.disabled = nivel === 0;
    btnMais.disabled = nivel === tamanhos.length - 1;
    try { localStorage.setItem('usf-fonte-v2', nivel); } catch (e) {}
}

document.querySelectorAll('[data-fonte]').forEach((botao) => {
    botao.addEventListener('click', () => {
        nivel = Math.min(tamanhos.length - 1, Math.max(0, nivel + Number(botao.dataset.fonte)));
        aplicarFonte();
    });
});

aplicarFonte();

// ---------- Agenda: abas por equipe ----------
// Sem JavaScript, todas as equipes aparecem uma embaixo da outra.
const abas = [...document.querySelectorAll('.aba')];

function selecionarAba(aba) {
    abas.forEach((a) => {
        const ativa = a === aba;
        a.setAttribute('aria-selected', ativa);
        a.tabIndex = ativa ? 0 : -1;
        document.getElementById(a.getAttribute('aria-controls')).hidden = !ativa;
    });
}

abas.forEach((aba, i) => {
    aba.addEventListener('click', () => selecionarAba(aba));
    aba.addEventListener('keydown', (ev) => {
        const passo = { ArrowRight: 1, ArrowLeft: -1 }[ev.key];
        if (!passo) return;
        const proxima = abas[(i + passo + abas.length) % abas.length];
        selecionarAba(proxima);
        proxima.focus();
    });
});
if (abas.length) selecionarAba(abas[0]);

// ---------- Remédios: mostrar lista e buscar ----------
// O botão abre a lista aqui mesmo, sem sair da página.
const btnRemedios = document.getElementById('btn-remedios');
const listaRemedios = document.getElementById('lista-remedios');
const busca = document.getElementById('busca-remedio');
const semResultado = document.getElementById('sem-resultado');

if (btnRemedios && listaRemedios) {
    btnRemedios.hidden = false;
    listaRemedios.hidden = true;

    btnRemedios.addEventListener('click', () => {
        const abrir = listaRemedios.hidden;
        listaRemedios.hidden = !abrir;
        btnRemedios.setAttribute('aria-expanded', abrir);
        btnRemedios.firstChild.textContent = abrir ? 'Esconder lista ' : 'Ver remédios disponíveis ';
        btnRemedios.querySelector('span').textContent = abrir ? '↑' : '↓';
        if (abrir) busca.focus({ preventScroll: true });
    });
}

// Ignora acentos e maiúsculas: "ácido" encontra "acido"
const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

if (busca) {
    busca.addEventListener('input', () => {
        const termo = normalizar(busca.value);
        let achou = 0;
        document.querySelectorAll('.categoria').forEach((cat) => {
            const nomeCategoria = normalizar(cat.querySelector('h3').textContent);
            let visiveis = 0;
            cat.querySelectorAll('li').forEach((item) => {
                const mostra = !termo || nomeCategoria.includes(termo) || normalizar(item.textContent).includes(termo);
                item.hidden = !mostra;
                if (mostra) visiveis++;
            });
            cat.hidden = visiveis === 0;
            achou += visiveis;
        });
        semResultado.hidden = achou > 0;
    });
}

// ---------- Ano atual no rodapé ----------
document.getElementById('ano').textContent = new Date().getFullYear();
