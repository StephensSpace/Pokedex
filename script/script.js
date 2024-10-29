let offset = 0
let path = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=" + `${offset}`;
let Pokemon = [];
let PokemonDetails = [];
let timeoutId;

function ToogleLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.toggle('dNone');
    document.getElementById('pokeBall').classList.toggle('dNone');
    document.body.classList.toggle('disableOverflow');
}

async function fetchDataJson(path) {
    try {
        ToogleLoadingSpinner()
        document.getElementById('content').innerHTML = '';
        let response = await fetch(path);
        Pokemon = await response.json();
        Pokemon = Pokemon.results;
        await SearchFetchAllPokemon()
        await renderPokemon(Pokemon)
    } catch (error) {
        console.error("Fehler:", error);
    }
}

function checkInputLength() {
    const input = document.getElementById("searchInput").value;
    clearTimeout(timeoutId);

    if (input.length >= 3) {  
        timeoutId = setTimeout(() => {
            searchPokeName(input);
        }, 300);  
    } else if (input.length == 0) {
        fetchDataJson(path)
    } else if (input.length == 4) {}
}

async function SearchFetchAllPokemon() {
    try {
        let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200&offset=0");
        let Pokemon2 = await response.json();
        Pokemon2 = Pokemon2.results;
        if (PokemonDetails.length === 0) {
            await PokeSearchDetailFetch(Pokemon2);
            return Pokemon2;
        } else {
            return Pokemon2;
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
}

async function PokeSearchDetailFetch(Pokemon2) {
    await Promise.all(Pokemon2.map(async (details) => {
        let PokemonDetailsVar = await fetchDetailsPokemon(details.url); // Abrufen der Details für jedes Pokémon
        let index2 = PokemonDetailsVar.id; // Verwende die ID, um die Position festzulegen
        PokemonDetails[index2 - 1] = PokemonDetailsVar; // Speichert PokemonDetailsVar an der Position `index2 - 1`
    }));
}

async function fetchDetailsPokemon(path) {
    try {
        let response = await fetch(path);
        let PokemonDetailsVar = await response.json();
        return PokemonDetailsVar; // Rückgabe des vollständigen Detail-Objekts
    } catch (error) {
        console.error("Fehler:", error);
    }
}

async function searchPokeName(input) {
    ToogleLoadingSpinner();
    let Pokemon2 = await SearchFetchAllPokemon()
    document.getElementById('content').innerHTML = '';
    const filteredPokemon = Pokemon2.filter(pokemon =>
        pokemon.name.includes(input.toLowerCase()));
    renderPokemon(filteredPokemon);
}

function updatePath() {
    path = `https://pokeapi.co/api/v2/pokemon?limit=25&offset=${offset}`;
}

function handleClick(button) {
    let nextBtn = document.getElementById('nextBtn');
    let backBtn = document.getElementById('backBtn');
    if (button.id === "nextBtn") {
        loadNextPokemonsBtn(nextBtn, backBtn);
    } else if (button.id === "backBtn") {
        loadLastPokemonBtn(nextBtn, backBtn);
    }
}

function loadNextPokemonsBtn(nextBtn, backBtn) {
    if (offset == 50) {
        nextBtn.disabled = true;
        offset += 25;
        updatePath();
        fetchDataJson(path);
    } else {
        backBtn.disabled = false;
        offset += 25;
        updatePath();
        fetchDataJson(path);
    }
}

function loadLastPokemonBtn(nextBtn, backBtn) {
    if (offset == 25) {
        offset -= 25;
        updatePath();
        fetchDataJson(path);
        backBtn.disabled = true;
        nextBtn.disabled = false;
    } else {
        offset -= 25;
        updatePath();
        fetchDataJson(path);
        nextBtn.disabled = false;
    }
}

async function renderPokemon(array) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        let detailedUrl = element.url;
        let match = detailedUrl.match(/(\d+)(?=\/$)/);
        let index2 = match[0] - 1;
        let detailsElement = PokemonDetails[index2];
        let classUrl = getType(detailsElement);
        let classImages = await fetchClassImage(classUrl);
        let number = detailsElement.id;
        document.getElementById('content').innerHTML += PokeCardHTML(element, detailsElement, number, index2);
        renderClasses(classImages, number);
    }
    ToogleLoadingSpinner();
}

async function fetchClassImage(classUrl) {
    let classImages = []
    for (let index = 0; index < classUrl.length; index++) {
        const element = classUrl[index];
        const response = await fetch(element);
        const ClassImageObj = await response.json();
        let image = ClassImageObj.sprites["generation-viii"]["sword-shield"].name_icon;
        classImages.push(image);
    }
    return classImages;
}

function getType(detailsElement) {
    let classUrl = []
    detailsElement.types.forEach(element => {
        classUrl.push(element.type.url);
    });
    return classUrl;
}

function renderClasses(classImages, number) {
    classImages.forEach(element => {
        renderCard = document.getElementById(`card-body${number}`);
        const imgElement = document.createElement('img');
        imgElement.src = element;
        imgElement.classList.add('classImage');
        renderCard.appendChild(imgElement);
    });
}