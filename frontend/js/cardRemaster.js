const cardsPerPage = 12;
let firstPage = 1;
let currentPage;

function createPageSelector(totalPages) {
    const pageSelector = document.createElement('div');
    pageSelector.classList.add('page-selector');
    pageSelector.classList.add('text-center');
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.setAttribute('type', 'button');
        pageButton.classList.add('btn', 'btn-outline-none');
        if (i === currentPage) {
            pageButton.classList.add('current-page-button');
        }
        pageButton.addEventListener('click', () => {
            showPage(i);
        });
        pageSelector.appendChild(pageButton);
    }
    return pageSelector;
}

function showPage(pageNumber) {
    currentPage = pageNumber;
    const start = (pageNumber - 1) * cardsPerPage;
    const end = pageNumber * cardsPerPage;
    let videoJsonData = fromDBtoJSON();
    const pageCards = videoJsonData.slice(start, end);

    const section = document.getElementsByClassName('videoRow');

    if (section.length > 0) {
        Array.from(section).forEach(section => {
            section.innerHTML = '';
            pageCards.forEach(cardData => {
                const card = createCard(cardData.title, cardData.author, cardData.avatarUrl, cardData.cardViews, cardData.imageURL);
                if (section.href !== undefined) {
                    section.addEventListener('click', () => ( window.location.href = '/video/' + card.title ));
                }
                section.appendChild(card);
            });
        });

        const pageSelector = document.querySelector('.page-selector');
        if (pageSelector) {
            pageSelector.remove();
        }

        if (Math.ceil(videoJsonData.length / cardsPerPage) > 1) {
            Array.from(section)[0].parentElement.appendChild(createPageSelector(Math.ceil(videoJsonData.length / cardsPerPage)));
        }
    } else {
        console.error("No elements found with class 'videoRow'");
    }
}

function createCard(title, author, avatarUrl, cardViews, imageURL) {
    const col = document.createElement('div');
    col.classList.add('col', 'mb-5');

    const card = document.createElement('div');
    card.classList.add('card', 'h-100', 'card-rounded');

    const img = document.createElement('img');
    img.classList.add('card-img-top', 'card-img-rounded');
    img.src = imageURL;
    img.alt = title;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'pb-2', 'px-2');

    const cardAvatar = document.createElement('div');
    cardAvatar.classList.add('d-flex', 'align-items-center', 'mb-3');

    const avatar = document.createElement('img');
    avatar.classList.add('rounded-circle', 'me-2');
    avatar.src = avatarUrl;
    avatar.alt = "Avatar Picture";
    avatar.style.width = "40px";
    avatar.style.heigt = "40px";

    const cardInfo = document.createElement('div');


    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('h6', 'mb-0');
    cardTitle.textContent = title;

    const cardAuthor = document.createElement('p');
    cardAuthor.classList.add('card-text', 'h6', 'text-muted');

    const authorName = document.createElement("small");
    authorName.textContent = author;

    const cardView = document.createElement('p');
    cardView.classList.add('card-text', 'cardViews');
    cardView.textContent = cardViews;

    cardAuthor.appendChild(authorName)

    cardInfo.appendChild(cardTitle);
    cardInfo.appendChild(cardAuthor);

    cardAvatar.appendChild(avatar);
    cardAvatar.appendChild(cardInfo);

    cardBody.appendChild(cardAvatar);
    cardBody.appendChild(cardView);

    card.appendChild(img);
    card.appendChild(cardBody);

    col.appendChild(card);

    return col;
}

async function getVideos() {
    const response = await fetch('/getAllVideos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => console.log(response));
    return response
}

async function fromDBtoJSON() {
    const dbData = await getVideos();
    let newJsonData = []
    await dbData.forEach(newData => {
        const newVideo = {
            title: newData.title,
            author: newData.author,
            avatarUrl: newData.avatar,
            cardViews: newData.views,
            imageURL: newData.imagePath,
            href: newData.href
        };
        newJsonData.push(newVideo);
    });
console.log(newJsonData);
    return newJsonData
}

const newJson = fromDBtoJSON();

const jsonData = [
    {
        "title": "BAUBEKPIDOR",
        "author": "1337Dumanchik",
        "avatarUrl": "/img/1337Dumanchik.jpg",
        "cardViews": "2 weeks ago",
        "imageURL": "video/imagePath/cs2_gameplay.png",
        "href": "/video/BAUBEKPIDOR"
    },
    {
        "title": "Jujutsu Kaisen S1EP2",
        "author": "megaTerminator228",
        "avatarUrl": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
        "cardViews": "2 weeks ago",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "Interstellar",
        "author": "moviePirate1337",
        "avatarUrl": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
        "cardViews": "5 days ago",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "Markiplier on FlickFusion???",
        "author": "Markiplier",
        "avatarUrl": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
        "cardViews": "3 weeks ago",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "TOP 50 ANIME",
        "author": "ANIMELOVER",
        "avatarUrl": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
        "cardViews": "1 day ago",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "Atomic Heart Walkthrough #1",
        "author": "Storm",
        "avatarUrl": "./img/toji.jpg",
        "cardViews": "1 129 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "CS2 Premier Gaming 20K",
        "author": "Storm",
        "avatarUrl": "./img/toji.jpg",
        "cardViews": "23 451 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "RDR2 Chapter 2 | New Friend!",
        "author": "Storm",
        "avatarUrl": "./img/toji.jpg",
        "cardViews": "13 785 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "Satisfactory | Level 4 | New Logistics System",
        "author": "Storm",
        "avatarUrl": "./img/toji.jpg",
        "cardViews": "1 459 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "Dark Souls | Smoug & Ornstein!",
        "author": "Storm",
        "avatarUrl": "./img/toji.jpg",
        "cardViews": "34 983 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "CS2 Cybersport Preparation",
        "author": "hvngover",
        "avatarUrl": "./img/hvngover.jpg",
        "cardViews": "123 324 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "Baldur's Gate 3 | 10 000 HOURS EXPERIENCE)",
        "author": "QBasy",
        "avatarUrl": "./img/qbasy.jpg",
        "cardViews": "1 234 422 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "ya udalyau dotu",
        "author": "jell1umfish",
        "avatarUrl": "./img/jell1umfish.jpg",
        "cardViews": "6 234 123 592 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "BEST CS2 PLAYER?",
        "author": "hvngover",
        "avatarUrl": "./img/hvngover.jpg",
        "cardViews": "23 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "Darkest Dungeon | Nameless Abomination",
        "author": "Storm",
        "avatarUrl": "./img/toji.jpg",
        "cardViews": "15 741 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "SDP .gitignore",
        "author": "QBasy",
        "avatarUrl": "./img/qbasy.jpg",
        "cardViews": "1 view",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
    {
        "title": "ya skachal dotu opyat'",
        "author": "jell1umfish",
        "avatarUrl": "./img/jell1umfish.jpg",
        "cardViews": "8 000 120 000 views",
        "imageURL": "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
    },
];

showPage(firstPage);
