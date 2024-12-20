function toggleLargeView() {
    document.getElementById('overlayLargeView').classList.toggle('dNone');
    document.getElementById('content').classList.toggle('blur');
    document.getElementById('header').classList.toggle('blur');
    document.getElementById('footer').classList.toggle('blur');
    document.getElementById('navigation').classList.toggle('blur');
    document.getElementById('content').classList.toggle('disabled');
    document.getElementById('navigation').classList.toggle('disabled');
    document.body.classList.toggle('disableOverflow');
}

async function renderLargeView(index) {
    let currentPokemon = PokemonDetails[index];
    let bigPicture = currentPokemon.sprites.other.dream_world.front_default;
    let pokeStats = currentPokemon.stats;
    let pokeType = currentPokemon.types[0].type.name;
    let classUrl = getType(currentPokemon);
    let classImages = await fetchClassImage(classUrl);
    let [next, back] = getNextAndBackBtnValue(index);
    document.getElementById('overlayLargeView').innerHTML = largeViewHTML(bigPicture, pokeStats, pokeType, currentPokemon, index, next, back);
    document.getElementById('card-body').classList.remove('displayRow');
    renderClassesLargeView(classImages);
}

async function fetchAttacks(index) {
    document.getElementById('card-body').classList.remove('displayRow');
    let currentPokemon = PokemonDetails[index];
    let fetchPromises = currentPokemon.abilities.map(async (element) => {
        let response = await fetch(element.ability.url);
        return response.json();
    });
    try {
        let abilitiesData = await Promise.all(fetchPromises);
        renderAttacksHtml(abilitiesData);
    } catch (error) {
        console.error('Error fetching abilities:', error);
    }
}

function getGermanEffect(effectEntries) {
    const germanEntry = effectEntries.find(entry => entry.language.name === "de");
    return germanEntry ? germanEntry.short_effect : effectEntries[0].short_effect;
}

function renderValues(index) {
    document.getElementById('card-body').classList.remove('displayRow');
    let currentPokemon = PokemonDetails[index];
    let pokeStats = currentPokemon.stats;
    let pokeType = currentPokemon.types[0].type.name;
    const cardBody = document.getElementById('card-body');
    cardBody.innerHTML = valuesHTML(pokeStats, pokeType);
}

function calculateStatsBarWidth(pokeStats) {
    const maxWidth = 300; 
    const widths = pokeStats.map(stat => [stat.base_stat, maxWidth - stat.base_stat]).flat();
    return widths;
}

async function fetchEvolutionChain(index) {
    let currentPokemon = PokemonDetails[index];
    let speciesUrl = currentPokemon.species.url;
    let evolutionData = await fetchEvoUrl(speciesUrl);
    renderEvolutionChain(evolutionData);
}

function renderEvolutionChain(evolutionData) {
    document.getElementById('card-body').innerHTML = ''
    for (let index = 0; index < evolutionData.length; index++) {
        const element = evolutionData[index];
        const match = element.match(/(\d+)(?=\/$)/);
        const number = match ? match[0] : null;
        let index2 = number - 1;
        addEvolutionToHTML(index2, index === evolutionData.length - 1);
    }
}

async function fetchEvoUrl(speciesUrl) {
    try {
        let response = await fetch(speciesUrl);
        let PokemonSpecies = await response.json();
        let evolutionUrl = PokemonSpecies.evolution_chain.url;

        let evolutionChainData = await fetchEvolutionDetails(evolutionUrl);
        return evolutionChainData;
    } catch (error) {
        console.error("Fehler:", error);
        return [];
    }
}

function getNextAndBackBtnValue(index) {
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

async function fetchEvolutionDetails(evolutionUrl) {
    let evolutions = [];
    try {
        let response = await fetch(evolutionUrl);
        let evolutionChain = await response.json();
        let currentChain = evolutionChain.chain;
        while (currentChain) {
            let nextEvoStepUrl = currentChain.species.url;
            evolutions.push(nextEvoStepUrl);
            currentChain = currentChain.evolves_to[0];
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
    return evolutions;
}

function renderClassesLargeView(classImages) {
    classImages.forEach(element => {
        renderCard = document.getElementById(`cardType`);
        const imgElement = document.createElement('img');
        imgElement.src = element;
        imgElement.classList.add('classImage');
        renderCard.appendChild(imgElement);
    });
}

function renderAttacksHtml(abilitiesData) {
    const cardBody = document.getElementById('card-body');
    cardBody.innerHTML = '';
    abilitiesData.forEach((ability, index) => {
        const h5 = document.createElement('h5');
        h5.textContent = `Attacke ${index + 1}: ${ability.name}`;
        const span = document.createElement('span');
        span.textContent = getGermanEffect(ability.effect_entries);
        cardBody.appendChild(h5);
        cardBody.appendChild(span);
    });
}

function addEvolutionToHTML(index2, isLast) {
    const cardBody = document.getElementById('card-body');
    cardBody.classList.add('displayRow');
    let currentPokemon = PokemonDetails[index2];
    let [img, arrow, span, index] = createImgAndSpan(currentPokemon);
    let divContainer = createAndPopulateDiv(span, img, index);
    cardBody.appendChild(divContainer);
    document.getElementById(`${index}`).onclick = () => { renderLargeView(index) };
    if (!isLast) {
        cardBody.appendChild(arrow);
    };
}

function createAndPopulateDiv(span, img, index) {
    let divContainer = document.createElement('div');
    divContainer.classList.add('imgAndName');
    divContainer.id = `${index}`;
    divContainer.appendChild(img);
    divContainer.appendChild(span);
    return divContainer;
}

function createImgAndSpan(currentPokemon) {
    let index = currentPokemon.id - 1;
    let img = document.createElement('img');
    img.src = currentPokemon.sprites.other.dream_world.front_default;
    img.classList.add('evoImage');
    let arrow = document.createElement('img');
    arrow.src = './img/evoArrow.png';
    arrow.classList.add('evoArrow');
    let span = document.createElement('span');
    span.innerHTML = currentPokemon.name;
    span.classList.add('noMargin');
    return [img, arrow, span, index];
}