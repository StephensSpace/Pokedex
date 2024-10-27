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
        renderPokemon(Pokemon)
    } catch (error) {
        console.error("Fehler:", error);
    }

}

function checkInputLength() {
    const input = document.getElementById("searchInput").value;
    clearTimeout(timeoutId);

    if (input.length >= 3) {  // Prüfung auf mindestens 3 Buchstaben
        timeoutId = setTimeout(() => {
            searchPokeName(input);
        }, 300);  // Die Suchfunktion aufrufen und den Input übergeben
    } else if (input.length == 0) {
        fetchDataJson(path)
    } else if (input.length == 4) {

    }
}

async function SearchFetchAllPokemon() {
    try {
        let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500&offset=0");
        let Pokemon2 = await response.json();
        Pokemon2 = Pokemon2.results;
        await PokeSearchDetailFetch(Pokemon2)
    } catch (error) {
        console.error("Fehler:", error);
    }
}

async function PokeSearchDetailFetch(Pokemon2) {
    for (let index = 0; index < Pokemon2.length; index++) {
        const element = Pokemon2[index];
        let detailedUrl = element.url;
        await fetchDetailsPokemon(detailedUrl) - 1;
    }
}

async function fetchDetailsPokemon(path) {
    try {
        let response = await fetch(path);
        let PokemonDetailsVar = await response.json();
        let index2 = PokemonDetailsVar.id
        if (PokemonDetails.length < index2) {
            PokemonDetails.push(PokemonDetailsVar);
            return index2
        } else {
            return index2
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
}

function searchPokeName(input) {
    ToogleLoadingSpinner();
    SearchFetchAllPokemon();
    document.getElementById('content').innerHTML = '';
    const filteredPokemon = Pokemon.filter(pokemon =>
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
        nextBtnClick(nextBtn, backBtn);
    } else if (button.id === "backBtn") {
        backBtnClick(nextBtn, backBtn);
    }
}

function nextBtnClick(nextBtn, backBtn) {
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

function backBtnClick(nextBtn, backBtn) {
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

function getNextAndBack(index) {
    let next = index + 1
    let back = index - 1
    next = next === 25 ? 0 : next;
    next = next === 50 ? 25 : next;
    next = next === 75 ? 50 : next;
    next = next === 100 ? 75 : next;
    back = back === 74 ? 99 : back;
    back = back === 49 ? 74 : back;
    back = back === 24 ? 49 : back;
    back = back === -1 ? 24 : back;
    return [next, back];
}
