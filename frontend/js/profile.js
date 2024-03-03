const searchInput = document.getElementById('searchInput').value;
let user = document.getElementById('username').value;
async function search() {
    const response = fetch('/searchVideo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: searchInput, user
    }).then(data => {
        console.log(data);
    });

    const videos = response.json();

    const videoRow = document.getElementById('videoRow');
    videoRow.innerHTML = "";

    let cardCount = 0;
    let currentRow;

    videos.forEach(video => {
        if (cardCount % 4 === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row', 'mb-3');
            videoRow.appendChild(currentRow);
        }

        const card = document.createElement('div');
        card.classList.add('col-md-3', 'mb-3');

        card.innerHTML = `
                <div class="card h-100 card-rounded">
                    <a href="/video/${video.title}">
                        <img class="card-img-top card-img-rounded" src="${video.imageURL}" alt="${video.title}">
                    </a>
                    <div class="card-body pb-2 px-2">
                        <div class="d-flex align-items-center mb-3">
                            <img class="rounded-circle me-2" src="${video.avatarUrl}" alt="Avatar Picture" style="width: 40px;">
                            <div>
                                <h5 class="h6 mb-0">${video.title}</h5>
                                <p class="card-text h6 text-muted"><small>${video.author}</small></p>
                            </div>
                        </div>
                        <p class="card-text cardViews">${video.views}</p>
                    </div>
                </div>
            `;
        currentRow.appendChild(card);
        cardCount++;
    });
}
