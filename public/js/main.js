console.log("js file loaded");

let offset = 0;
const limit = 10;
let isLoading = false;
let totalPokemon = 0;

async function loadPokemon() {
    if (isLoading) return;
    if (totalPokemon > 0 && offset >= totalPokemon) {
        document.getElementById("end-message").style.display = "block";
        return;
    }

    isLoading = true;
    document.getElementById("loading").style.display = "block";

    // Step 1: get a batch of 10 Pokemon names
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    let jsonObj = await response.json();

    totalPokemon = jsonObj.count;

    // Step 2: fetch details for each Pokemon in parallel
    const detailPromises = jsonObj.results.map((pokemon) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then((r) => r.json())
            .catch(() => null)
    );

    const details = await Promise.all(detailPromises);

    // Step 3: render each Pokemon as a Bootstrap card
    const container = document.getElementById("pokemon-container");

    details.forEach((jsonObj2) => {
        if (!jsonObj2) return;

        const imageUrl = jsonObj2.sprites.other['official-artwork'].front_default;
        console.log(jsonObj2.sprites.other['official-artwork'].front_default);

        const card = document.createElement("div");
        card.className = "card pokemon-card";
        card.innerHTML = `
            <div class="card-header p-1" style="font-size: 0.75rem; color: #666;">
                #${jsonObj2.id}
            </div>
            <div class="card-body">
                <img src="${imageUrl}" alt="${jsonObj2.name}" />
                <p class="card-text pokemon-name">${jsonObj2.name}</p>
            </div>
        `;

        container.appendChild(card);
    });

    offset += limit;
    isLoading = false;
    document.getElementById("loading").style.display = "none";

    if (offset >= totalPokemon) {
        document.getElementById("end-message").style.display = "block";
    }
}

// Load first 10 on page load
loadPokemon();

document.addEventListener("scroll", function () {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    let scrollbuffer = 5;
    if (scrollTop + clientHeight + scrollbuffer >= scrollHeight) {
        console.log("End of page reached");
        loadPokemon();
    }
});