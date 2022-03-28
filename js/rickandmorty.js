const RNMapiURI = "https://rickandmortyapi.com/graphql";
const chars = document.querySelector('.characters');
const characterContent = document.querySelector('.characters');
const getCharactersButton = document.querySelector('.get-characters');
const pagination = document.querySelector('.pagination');
const pagePrev = pagination.querySelector('.page-prev');
const pageNext = pagination.querySelector('.page-next');
const pageCurrent = pagination.querySelector('.page-current .page-link');
const search = document.querySelector('.search');
const searchInput = search.querySelector('input');
const modal = document.querySelector('#characterModal');
const modalTitle = modal.querySelector('.modal-title');
const modalbody = modal.querySelector('.modal-body');

let timer;              // Timer identifier
const waitTime = 500;   // Wait time in milliseconds 

// console.log(searchInput)

let page = 1;


pagePrev.addEventListener('click', () => {
    page = pagePrev.getAttribute('page-num');
    
    if(page !== 'null'){
        chars.innerHTML = ``;
        getCharacters(page);
    }
});


pageNext.addEventListener('click', () => {
    page = pageNext.getAttribute('page-num');
    chars.innerHTML = ``;
    getCharacters(page);
});


getCharactersButton.addEventListener('click', () => {
    getCharacters();
    toggleCharShow();
    toggleCharBtnHide();
});


search.addEventListener('keyup', e => {
    e.preventDefault();

    searchContent = searchInput.value;

    clearTimeout(timer);

    timer = setTimeout(() => {
        getCharacters(searchContent);
        chars.innerHTML = ``;
    }, waitTime);
});




const toggleCharShow = () => {
    characterContent.style.display = "flex";
    search.style.display = "flex";
    pagination.style.display = "flex";
}


const toggleCharBtnHide = () => {
    getCharactersButton.style.display = "none";
}

// Get Character data
const getCharacters = async () => {

    if(typeof searchContent !==  'undefined'){
        args = `(page: ${page}, filter: { name: "${searchContent}" })`;
    } else if(page) {
        args = `(page: ${page})`;
    }

    // console.log('args: ' + args);
    

    // query
    const query = `
        {
            characters${args} {
                info {
                    count
                    pages
                    next
                    prev
                }
                results {
                    id
                    name
                    species
                    gender
                    status
                    image
                    episode {
                        id
                        name
                    }
                    location {
                        name
                    }
                }
            }
        }
    `;
    // api request
    fetch(RNMapiURI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        // stringify api request
        body: JSON.stringify({
            query
        })
    }).then(response => {
        // return response
        return response.json();
    }).then(data => {
        // display data
        const characters = data.data.characters.results;
        const paginationData = data.data.characters.info;

        // console.log(characters);

        characters.forEach(character => {

            let div = document.createElement("div");
            div.setAttribute('class', 'col-md-3');

            // console.log(character.id);

            div.innerHTML = `<div class="card mb-4">
                <img src="${character.image}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                <p class="card-text mb-0"><strong>Species:</strong> ${character.species}</p>
                <p class="card-text mb-0"><strong>Gender:</strong> ${character.gender}</p>
                <p class="card-text mb-0"><strong>Location:</strong> ${character.location.name}</p>
                <p class="card-text"><strong>Status:</strong> ${character.status}</p>
                <a data-bs-toggle="modal" character-id="${character.id}" data-bs-target="#characterModal" class="modal-trigger btn btn-secondary">See Episodes</a>
                </div>
            </div>`;

            chars.appendChild(div);

        })

        let modalTrigger = document.querySelectorAll('.modal-trigger');
        modalTrigger = Array.from(modalTrigger);

        modalTrigger.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const characterId = trigger.getAttribute('character-id');
                getEpisodes(characterId);
            });
        })

        pagePrev.setAttribute('page-num', paginationData.prev);
        pageNext.setAttribute('page-num', paginationData.next);

        if(paginationData.prev == null){
            pagePrev.style.display = 'none';
            pageCurrent.textContent = paginationData.next - 1;
        } else {
            pagePrev.style.display = 'block';
            pageCurrent.textContent = paginationData.next - 1;
        };

    }).catch(error => {
        console.log('cannot fetch data');
    });
}



// Get Character data
const getEpisodes = async (characterId) => {

    // query
    const query = `
    {
        character(id: "${characterId}"){
            name
            episode {
                id
                episode
                name
                air_date
            }
        }
    }
    `;
    // api request
    fetch(RNMapiURI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        // stringify api request
        body: JSON.stringify({
            query
        })
    }).then(response => {
        // return response
        return response.json();
    }).then(data => {
        // display data
        const charName = data.data.character.name;
        const episodes = data.data.character.episode;

        modalTitle.textContent = `${charName} appears in these episodes`;

        modalbody.innerHTML = '';

        episodes.forEach((episode) => {
            
            let episodeInfo = document.createElement("p");

            console.log(episode);

            episodeInfo.innerHTML = `<strong>${episode.name}(${episode.episode})</strong> - ${episode.air_date}`;

            console.log(episodeInfo);

            modalbody.appendChild(episodeInfo);

        });

    }).catch(error => {
        console.log('cannot fetch data');
    });
}