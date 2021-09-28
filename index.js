// DOM
//-----------------------------------------------------------------------
const main = document.querySelector(".main");
const passerAuContenu = document.querySelector(".passer-au-contenu");
const navigationTags = document.querySelectorAll(".lien-des-tags");

// Variables globales
//-----------------------------------------------------------------------
let photographes = [];
let tagHTML = "";
let currentArrayOfPhotographe = [];
let currentTag = "";

// Récupération de l'ID dans l'URL
//------------------------------------------------
const queryString_URL_Tag = window.location.search;
const searchParamsTag = new URLSearchParams(queryString_URL_Tag);
const tagFromUrl = searchParamsTag.get("tag");
currentTag = tagFromUrl;

// Récupération des données du fetch
//------------------------------------------------------------
const fetchAllData = async () => {
  await fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      photographes = data.photographers;

      affichagePhotographes(photographes);

      if (tagFromUrl) {
        filterTag();
      }
    });
};
fetchAllData();

// Apparition du bouton "Passer au contenu"
const renderPasserAuContenu = () => {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled >= 50) {
      passerAuContenu.style.display = "flex";
    } else {
      passerAuContenu.style.display = "none";
    }
  });
};
renderPasserAuContenu();

// Affichage cartes des photographes
const affichagePhotographes = (arrayOfPhotographe) => {
  arrayOfPhotographe.forEach((photographe) => {
    tagHTML = "";
    photographe.tags.forEach((tag) => {
      tagHTML += `
        <button onclick="newFilterTag('${tag}')" class="lien-des-tags" data-tag="${tag}">#${tag}</button>
        `;
    });

    main.innerHTML += `
        <article class="card">
          <a href="./page-photographe.html?id=${photographe.id}&name=${photographe.name}" class="card__image" role="button">
            <img src="./Sample Photos/Photographers ID Photos/${photographe.portrait}" alt="portrait ${photographe.name}" />
            <h2>${photographe.name}</h2>
          </a>
          <div class="card__infos">
            <h3 class="card__infos__titre">${photographe.city}, ${photographe.country}</h3>
            <p class="card__infos__slogan">
              ${photographe.tagline}
            </p>
            <p class="card__infos__prix" tabindex="0" aria-label="${photographe.price}€ par jour">${photographe.price}€/jour</p>
          </div>
          <div class="card__liens"  >
            ${tagHTML}  
          </div>
        </article>
        `;
  });
};

// Filtre principal
const filterTag = () => {
  const newArrayOfPhotographe = photographes.filter((p) =>
    p.tags.includes(currentTag)
  );
  currentArrayOfPhotographe = [...newArrayOfPhotographe];
  main.innerHTML = "";
  affichagePhotographes(newArrayOfPhotographe);
};

navigationTags.forEach((btnTag) => {
  btnTag.addEventListener("click", (e) => {
    currentTag = e.currentTarget.dataset.tag;
    filterTag();
  });
});

// Filtre secondaire
function newFilterTag(tag) {
  if (currentArrayOfPhotographe == "") {
    currentTag = tag;
    filterTag();
  } else {
    const newArrayOfPhotographe = currentArrayOfPhotographe.filter((p) =>
      p.tags.includes(tag)
    );
    currentArrayOfPhotographe = [...newArrayOfPhotographe];
    main.innerHTML = "";
    affichagePhotographes(newArrayOfPhotographe);
  }
}
