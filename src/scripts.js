const btnIniciar = document.getElementById('btn-iniciar');
const pokedexHome = document.getElementById('pokedex-home');
const pokedexApp = document.getElementById('pokedex-app');

const pesquisaInput = document.getElementById('pesquisa-input');
const btnBuscar = document.getElementById('btn-buscar');
const btnVoltar = document.getElementById('btn-voltar');
const btnAvancar = document.getElementById('btn-avancar');

const pokemonCard = document.getElementById('pokemon-card');
const pokemonImg = document.getElementById('pokemon-img');
const pokemonNome = document.getElementById('pokemon-nome');
const pokemonInfo = document.getElementById('pokemon-info');
const loading = document.getElementById('loading');
const erro = document.getElementById('erro');

let idAtual = 1;

async function buscarPokemon(identificador) {
    // Esconder tudo antes de começar
    if (pokemonCard) pokemonCard.classList.add('hidden');
    if (erro) erro.classList.add('hidden');
    if (loading) loading.classList.remove('hidden');

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificador.toString().toLowerCase()}`);
        if (!resposta.ok) throw new Error('Não achou');

        const dados = await resposta.json();

        // Preencher dados
        idAtual = dados.id;
        if (pokemonImg) pokemonImg.src = dados.sprites.other['official-artwork'].front_default || dados.sprites.front_default;
        if (pokemonNome) pokemonNome.innerText = `#${dados.id} - ${dados.name.toUpperCase()}`;
        
        const tipos = dados.types.map(t => t.type.name).join(', ');
        if (pokemonInfo) pokemonInfo.innerText = `Altura: ${dados.height/10}m | Peso: ${dados.weight/10}kg\nTipo: ${tipos}`;

        // Mostrar o card
        if (pokemonCard) pokemonCard.classList.remove('hidden');
        if (btnVoltar) btnVoltar.disabled = (idAtual <= 1);
    } catch (e) {
        if (erro) erro.classList.remove('hidden');
    } finally {
        if (loading) loading.classList.add('hidden');
    }
}

// Botão Iniciar
if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
        if (pokedexHome) pokedexHome.classList.add('hidden');
        if (pokedexApp) pokedexApp.classList.remove('hidden');
        buscarPokemon(idAtual);
    });
}

// Botão Buscar
if (btnBuscar) {
    btnBuscar.addEventListener('click', () => {
        const termo = pesquisaInput.value.trim();
        if (termo) buscarPokemon(termo);
    });
}

// Enter na busca
if (pesquisaInput) {
    pesquisaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnBuscar.click();
    });
}

// Navegação
if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
        if (idAtual > 1) buscarPokemon(idAtual - 1);
    });
}

if (btnAvancar) {
    btnAvancar.addEventListener('click', () => {
        buscarPokemon(idAtual + 1);
    });
}
