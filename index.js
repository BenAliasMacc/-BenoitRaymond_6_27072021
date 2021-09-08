const main = document.querySelector(".main");
const passerAuContenu = document.querySelector(".passer-au-contenu");
let tagValue = "";

// Fonctions

// Apparition du bouton "Passer au contenu"
const renderPasserAuContenu = () => {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled >= 50) {
      passerAuContenu.style.display = "block";
    } else {
      passerAuContenu.style.display = "none";
    }
  });
};
renderPasserAuContenu();

// Création de la fonction d'affichage des profils photographes
const renderPhotographe = (arrayOfPhotographe) => {
  arrayOfPhotographe.forEach((photographer) => {
    let tagHTML = "";
    photographer.tags.forEach((tag) => {
      tagHTML += `
        <button onclick="newFilterTag('${tag}')" class="lien-des-tags" tag="${tag}">#${tag}</button>
        `;
    });

    main.innerHTML += `
        <article class="card">
        <a href="./page-photographe.html?id=${photographer.id}&name=${photographer.name}" class="card__img">
          <img src="./Sample Photos/Miniatures/${photographer.portrait}" alt="" />
          <h2>${photographer.name}</h2>
        </a>
        <div class="card__text-content">
          <h3 class="card__text-content__titre">${photographer.city}, ${photographer.country}</h3>
          <p class="card__text-content__slogan">
            ${photographer.tagline}
          </p>
          <p class="card__text-content__prix">${photographer.price}€/jour</p>
        </div>
        <div class="card__link">
          ${tagHTML}
        </div>
        </article>
        `;
  });
};
let currentArrayOfPhotographe = [];
// Création de la fonction d'affichage des profils photographes
const filterTag = (arrayOfPhotographe) => {
  const navigationTags = document.querySelectorAll(".lien-des-tags");
  navigationTags.forEach((btnTag) => {
    btnTag.addEventListener("click", (e) => {
      let currentTag = e.currentTarget.getAttribute("tag");
      const newArrayOfPhotographe = arrayOfPhotographe.filter((p) =>
        p.tags.includes(currentTag)
      );
      currentArrayOfPhotographe = [...newArrayOfPhotographe];
      main.innerHTML = "";
      renderPhotographe(newArrayOfPhotographe);
    });
  });
};

function newFilterTag(tag) {
  const newArrayOfPhotographe = currentArrayOfPhotographe.filter((p) =>
    p.tags.includes(tag)
  );
  currentArrayOfPhotographe = [...newArrayOfPhotographe];
  main.innerHTML = "";
  renderPhotographe(newArrayOfPhotographe);
}

// Appel à la base de donnée JSON
const fetchAllData = async () => {
  await fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      renderPhotographe(data.photographers);

      filterTag(data.photographers);
    });
};

fetchAllData();
