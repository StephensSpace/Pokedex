function valuesHTML(pokeStats, pokeType) {
    let widths = calculateStatsBarWidth(pokeStats);
    console.log(widths)
    return `<ul class="list-group list-group-flush ${pokeType}">
            <li class="list-group-item"><b>Health: ${widths[0]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[0]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[1]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Attack: ${widths[2]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[2]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[3]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Defense: ${widths[4]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[4]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[5]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Special Attack: ${widths[6]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[6]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[7]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Special Defense: ${widths[8]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[8]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[9]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Speed: ${widths[10]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[10]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[11]}px;"></div>
                </div>
            </li>
        </ul>`
}

function largeViewHTML(bigPicture, pokeStats, pokeType, currentPokemon, index, next, back) {
    let widths = calculateStatsBarWidth(pokeStats);
    console.log(widths)
    let number = index + 1;
    return `<img src="./buttons/left.png" alt="" onclick="event.stopPropagation(); renderLargeView(${back})" class="LargeViewBtn">
<div class="card ${pokeType}" style="width: 36rem; height: 90vh;" onclick="event.stopPropagation()">
    <h3 class="card-header">#${number} ${currentPokemon.name}</h3>
    <img src="${bigPicture}" class="card-img-top largeImg" alt="...">
    <div id="cardType"></div>
    <nav>
        <button onclick="renderValues(${index}); event.stopPropagation()" class="btn btn-secondary btn-lg">Werte</button>
        <button onclick="fetchAttacks(${index}); event.stopPropagation()" class="btn btn-secondary btn-lg">Angriffe</button>
        <button onclick="fetchEvolutionChain(${index}); event.stopPropagation()" class="btn btn-secondary btn-lg">Evolution</button>
    </nav>
    <div class="card-body" id="card-body">
        <ul class="list-group list-group-flush ${pokeType}">
            <li class="list-group-item"><b>Health: ${widths[0]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[0]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[1]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Attack: ${widths[2]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[2]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[3]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Defense: ${widths[4]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[4]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[5]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Special Attack: ${widths[6]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[6]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[7]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Special Defense: ${widths[8]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[8]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[9]}px;"></div>
                </div>
            </li>
            <li class="list-group-item"><b>Speed: ${widths[10]}</b>
                <div class="displayRow">
                    <div class="statsBar" style="width: ${widths[10]}px;"></div>
                    <div class="statsBar2" style="width: ${widths[11]}px;"></div>
                </div>
            </li>
        </ul>
    </div>
</div>
<img src="./buttons/right.png" alt="" onclick="event.stopPropagation(); renderLargeView(${next})" class="LargeViewBtn">`;
}

function PokeCardHTML(element, detailsElement, number, index2) {

    return `<div class="card ${detailsElement.types[0].type.name}" style="width: 18rem;" onclick="toggleLargeView(); renderLargeView(${index2});">
                <div class="cardHeader"><h3>#${number} ${element.name}</h3></div>
                <div class="cardImage">
                <figure>
                    <img src=${detailsElement.sprites.other.dream_world.front_default} class="card-img-top" alt="...">
                </figure>
                </div>
                <div class="card-body" id="card-body${number}">                
            </div>
            </div>`
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