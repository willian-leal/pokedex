const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const limit = 10;
let offset = 0;

function loadPokemonItems(offset, limit) {
    pokeAPI.getPokemons(offset, limit)
        .then((pokemons = []) => {
            const newHtml = pokemons.map((pokemon) =>  `
                <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>
            `
        ).join('')
        pokemonList.innerHTML += newHtml;

        const pokemonItems = Array.from(document.querySelectorAll('.pokemon'));
        pokemonItems.forEach((item) => {
            item.addEventListener('click', () => {
                const pokemonId = item.getAttribute('data-id');
                console.log(pokemonId);
                getPokemon(pokemonId);
            });
        });
    });
}

function getPokemon(pokemonId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    
    const url = `http://localhost:8080/pokemon-details.html?id=${pokemonId}`;
    window.open(url, '_blank');

    fetch(apiUrl)
        .then((response) => response.json())
        .then((pokemonData) => {
            const details = document.getElementsByTagName('body');
            console.log(details)
            details.innerHTML = `
                <h1>${pokemonData.name}</h1>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h2>Tipos:</h2>
                <ul>
                    ${pokemonData.types.map((type) => `<li>${type.type.name}</li>`).join('')}
                </ul>
            `;
        })
        .catch((error) => {
            console.error('Erro ao buscar informações do Pokémon:', error);
        });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonItems(offset, limit);
});
