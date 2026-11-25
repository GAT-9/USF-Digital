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

// ---------- Ano atual no rodapé ----------
document.getElementById('ano').textContent = new Date().getFullYear();
