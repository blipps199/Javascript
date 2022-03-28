const apiURI = "https://api.spacex.land/graphql/";
const getCapulesButton = document.querySelector('.get-capsules');

const capsuleContent = document.querySelector('.capsule-data');
const capsuleName = capsuleContent.querySelector('.name');
const capsuleIDs = capsuleContent.querySelector('.id');
const capsuleCapacity = capsuleContent.querySelector('.capacity');
const capsuleActive = capsuleContent.querySelector('.active');
const capsuleDescription = capsuleContent.querySelector('.description');
const capsuleLandings = capsuleContent.querySelector('.landings');
const capsuleReuse = capsuleContent.querySelector('.reuse');
const capsuleStatus = capsuleContent.querySelector('.status');
const capsuleWiki = capsuleContent.querySelector('.wiki');
const capsuleFirstFlight = capsuleContent.querySelector('.first-flight');


getCapulesButton.addEventListener('click', () => {
    getCapsules();
    toggleHide();
})


const toggleShow = () => {
    capsuleContent.style.display = "block";
}


const toggleHide = () => {
    getCapulesButton.style.display = "none";
}


// Get Capsules data
const getCapsules = async () => {
    // query
    const query = `
        {
            capsules {
            id
            type
            }
        }
    `;
    // api request
    fetch(apiURI, {
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
        const list = document.querySelector('.capsules');
        const capsules = data.data.capsules;
        capsules.forEach(capsule => {
            // console.log(capsule.id);
            let li = document.createElement("div");
            li.setAttribute('class', ['col p-2 mb-2 bg-light border']);
            li.appendChild(document.createTextNode(capsule.id));
            li.setAttribute('name', capsule.id)
            li.textContent = `${capsule.id} - ${capsule.type}`;
            list.appendChild(li);
        })

        const capsulesList = document.querySelectorAll('.capsules .col');

        capsulesList.forEach(capLi => {
            capLi.addEventListener('click', () => {
                const capsuleID = capLi.getAttribute('name');
                getCapsule(capsuleID);
                toggleShow();
            });
        });

    }).catch(error => {
        console.log('cannot fetch data');
    });
}

const getCapsule = async (capsuleID) => {
    // query
    const query = `
        {
            capsule(id: "${capsuleID}") {
                id
                dragon {
                    crew_capacity
                    active
                    description
                    wikipedia
                    name
                    first_flight
                }
                landings
                reuse_count
                status
            }
        }
    `;
    // api request
    fetch(apiURI, {
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
        // console.log(data.data.capsule);

        capsuleName.textContent = data.data.capsule.dragon.name;
        capsuleIDs.textContent = data.data.capsule.id;
        capsuleCapacity.textContent = data.data.capsule.dragon.crew_capacity;
        capsuleActive.textContent = data.data.capsule.dragon.active;
        capsuleDescription.textContent = data.data.capsule.dragon.description;
        capsuleLandings.textContent = data.data.capsule.landings;
        capsuleReuse.textContent = data.data.capsule.reuse_count;
        capsuleStatus.textContent = data.data.capsule.status;
        capsuleWiki.href = data.data.capsule.dragon.wikipedia;
        capsuleFirstFlight.textContent = data.data.capsule.dragon.first_flight;

    }).catch(error => {
        console.log('cannot fetch data');
    });
}