let offset = 0
let path = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=" + `${offset}`;
let Pokemon = [];
let PokemonDetails = [];
// path pokemon/1/ = `pokemon/${id}/`


async function fetchDataJson(path) {
    try {
        document.getElementById('content').innerHTML = '';
        let response = await fetch(path);
        Pokemon = await response.json();
        Pokemon = Pokemon.results;
        renderPokemon()
    } catch (error) {
        console.error("Fehler:", error);
    }
}

function updatePath() {
    path = `https://pokeapi.co/api/v2/pokemon?limit=25&offset=${offset}`;
}

function handleClick(button) {
    // Überprüfe die ID des Buttons
    let nextBtn = document.getElementById('nextBtn')
    let backBtn = document.getElementById('backBtn')
    if (button.id === "nextBtn") {
        nextBtnClick(nextBtn, backBtn)
    } else if (button.id === "backBtn") {
        backBtnClick(nextBtn, backBtn)
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



async function renderPokemon() {
    for (let index = 0; index < Pokemon.length; index++) {
        const element = Pokemon[index];
        let detailedUrl = element.url;
        let index2 = await fetchDetailsPokemon(detailedUrl) - 1;
        let detailsElement = PokemonDetails[index2];
        let classUrl = getType(detailsElement);
        let classImages = await fetchClassImage(classUrl);
        let number = index2 + 1;
        document.getElementById('content').innerHTML += PokeCardHTML(element, detailsElement, number);
        renderClasses(classImages, number)
    }
}

function renderClasses(classImages, number) {
    classImages.forEach(element => {
        renderCard = document.getElementById(`card-body${number}`)
        // Erstelle ein neues <img>-Element
        const imgElement = document.createElement('img');
        // Setze die src-Attribute für das Bild
        imgElement.src = element;
        // Optional: Setze andere Attribute wie alt und class imgElement.classList.add('class-image');
        renderCard.appendChild(imgElement)
    });
}

async function fetchClassImage(classUrl) {
    let classImages = []
    for (let index = 0; index < classUrl.length; index++) {
        const element = classUrl[index];
        const response = await fetch(element);
        const ClassImageObj = await response.json();
        let image = ClassImageObj.sprites["generation-viii"]["sword-shield"].name_icon;
        classImages.push(image)
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

function PokeCardHTML(element, detailsElement, number) {

    return `<div class="card" style="width: 18rem;">
                <div class="cardHeader"><h3>#${number} ${element.name}</h3></div>
                <img src=${detailsElement.sprites.other.dream_world.front_default} class="card-img-top" alt="...">
                <div>

                </div>
                <div class="card-body" id="card-body${number}">
                    
            </div>
            </div>`
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