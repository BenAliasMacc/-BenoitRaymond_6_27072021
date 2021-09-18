const renderImage = document.querySelector(".image");
const renderTitre = document.querySelector(".titre");
const renderAllMedia = document.querySelector(".allMedia");

let media = [
  {
    image:
      "https://images.pexels.com/photos/768089/pexels-photo-768089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    title: "Petits pois",
  },
  {
    image:
      "https://images.pexels.com/photos/3820385/pexels-photo-3820385.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    title: "Yoga",
  },
  {
    image:
      "https://images.pexels.com/photos/4792320/pexels-photo-4792320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    title: "Feuille",
  },
  {
    image:
      "https://images.pexels.com/photos/7210438/pexels-photo-7210438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    title: "Chien",
  },
];

let currentIndex = 0;

console.log(media);

const showNext = () => {
  console.log(media[currentIndex]);
  currentIndex++;
  if (currentIndex === media.length) {
    currentIndex = 0;
  }
  showMedia(currentIndex);
};
const showPrev = () => {
  console.log(media[currentIndex]);
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = media.length - 1;
  }
  showMedia(currentIndex);
};

const showMedia = (index) => {
  renderImage.innerHTML = `
    <img
    src="${media[index].image}"
    alt=""
  />
    `;
  renderTitre.textContent = `${media[index].title}`;
};

showMedia(0);

const showAllMedias = () => {
  media.forEach((element, index) => {
    renderAllMedia.innerHTML += `
    <div class="card" onclick="ouvrirCarte('${index}')">
      <div class="image">
        <img
          src="${element.image}"
          alt=""
        />
      </div>
      <div class="titre">${element.title}</div>
    </div>
    `;
  });
};

showAllMedias();

const ouvrirCarte = (mediaId) => {
  currentIndex = mediaId;
  showMedia(currentIndex);
};
