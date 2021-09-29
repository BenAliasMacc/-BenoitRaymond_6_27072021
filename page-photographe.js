// DOM
//--------------------------------------------------
// Général
const body = document.querySelector("body");
const main = document.querySelector("main");

// Profil photographe
const photographeInformations = document.querySelector(
  ".photographe__informations"
);
const photographeIllustrations = document.querySelector(
  ".photographe__illustration"
);

// Filtre
const boutonFiltre = document.querySelector(".filtre__liste__active");
const listeFiltres = document.querySelectorAll(".filtre__liste__inactive");
const chevronFiltre = document.querySelector(".fa-chevron-down");
const trieActuel = document.querySelector(".trie-actuel");

// Cartes
const cartes = document.querySelector(".cartes");

// Modal
const modal = document.querySelector(".modal");
const nomPhotographe = document.getElementById("nom_photographe");
const BoutonContact = document.querySelector(".photographe__contacte");
const closeModal = document.querySelector(".modal__content__close");
const focusModal = document.getElementsByClassName("focus-modal");
const submit = document.querySelector(".modal__content__submit");

// LightBox
const lightbox = document.querySelector(".lightbox");
const lightboxContainer = document.querySelector(".lightbox__container__media");
const closeLightbox = document.querySelector(".lightbox__container__close");
const lightboxNext = document.querySelector(".lightbox__container__next");
const lightboxPrev = document.querySelector(".lightbox__container__prev");
const focusLightbox = document.getElementsByClassName("focus-lightbox");

// Container like et prix
const totalLikes = document.getElementById("total-like");
const prix = document.getElementById("prix");

// Récupération de l'ID dans l'URL
//------------------------------------------------
const queryString_URL_Id = window.location.search;
const searchParamsId = new URLSearchParams(queryString_URL_Id);
const idPhotographeFromUrl = searchParamsId.get("id");

// Variables globales
//------------------------------------------------
let trie = "";
let option = "";
let photographe = "";
let photographeMedias = [];
let count = 0;
let currentIndex = 0;
let tagHTML = "";
let premierFocusModal = focusModal[0];
let dernierFocusModal = focusModal[focusModal.length - 1];
let premierFocusLightbox = focusLightbox[0];
let dernierFocusLightbox = focusLightbox[focusLightbox.length - 1];

// Récupération des données du fetch
//------------------------------------------------------------
const fetchAllData = async () => {
  await fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      // Infos du photographe
      photographe = data.photographers.find((photographer) => {
        return photographer.id == idPhotographeFromUrl;
      });

      // Tableau des médias du photographe sélectionné
      photographeMedias = data.media.filter((media) => {
        return idPhotographeFromUrl == media.photographerId;
      });

      tagsPhotographe();

      informationsPhotographe();

      illustrationsPhotographe();

      affichageMedias();

      trieMedias();

      calculTotalLike();

      prixJournalier();
    });
};

fetchAllData();

// Affichage informations du photographe
//-----------------------------------------------------
const tagsPhotographe = () => {
  photographe.tags.forEach((tag) => {
    tagHTML += `
      <li class="photographe__informations__tags__tag">
        <a href="./index.html?tag=${tag}" type="button">#${tag}</a>
      </li>
    `;
  });
};

const informationsPhotographe = () => {
  photographeInformations.innerHTML = `
    <h1 class="photographe__informations__nom">${photographe.name}</h1>
    <h2 class="photographe__informations__localisation">${photographe.city}, ${photographe.country}</h2>
    <p class="photographe__informations__slogan">
      ${photographe.tagline}
    </p>
    <ul class="photographe__informations__tags">
      ${tagHTML}
    </ul>
  `;
};

const illustrationsPhotographe = () => {
  photographeIllustrations.innerHTML = `
    <img src="./Sample Photos/Photographers ID Photos/${photographe.portrait}" alt="${photographe.name}"/>
  `;
};

// Menu déroulant Filtre
//----------------------------------------------------
const actionFiltre = () => {
  chevronFiltre.classList.toggle("rotation");
  listeFiltres.forEach((element) => {
    element.classList.toggle("ouverture");
  });
};

boutonFiltre.addEventListener("click", () => actionFiltre());

// Affichage des médias
//-----------------------------------------------------
function createMediaFactory(photographe, elt) {
  if (elt.hasOwnProperty("image")) {
    return `<img src="./Sample Photos/${photographe}/${elt.image}" alt="${elt.title}">`;
  } else if (elt.hasOwnProperty("video")) {
    return `<video src="./Sample Photos/${photographe}/${elt.video}"" alt="${elt.title}"></video>`;
  }
}

const affichageMedias = () => {
  if (trie === "") {
    photographeMedias.sort((a, b) => (a.likes < b.likes ? 1 : -1));
  }
  photographeMedias.forEach((detailsMedia) => {
    cartes.innerHTML += `
        <article class="carte">
          <button class="carte__media" title="${
            detailsMedia.title
          } " data-mediaId="${detailsMedia.id}")>
              ${createMediaFactory(photographe.name, detailsMedia)}
          </button>
          <div class="carte__infos">
            <h2 class="carte__infos__titre">${detailsMedia.title}</h2>
            <button class="carte__infos__favs" data-select="false" data-likes="${
              detailsMedia.likes
            }" type="button">
              <span class="nombres-de-likes">${
                detailsMedia.likes
              }</span><i class="fas fa-heart" aria-label="likes"></i>
            </button>
          </div>
        </article>
      `;
  });
  ouvrirLightbox();

  incrementationLike();
};

// Trie des médias
//------------------------------------------------------------
const trieMedias = () => {
  listeFiltres.forEach((element) => {
    element.addEventListener("click", (e) => {
      trie = e.currentTarget.textContent;
      console.log(trie);
      option = trieActuel.textContent;
      console.log(option);
      if (trie.includes("Date")) {
        photographeMedias.sort((a, b) => (a.date < b.date ? 1 : -1));
        element.textContent = option;
        trieActuel.textContent = trie;
      }
      if (trie.includes("Titre")) {
        photographeMedias.sort((a, b) => (a.title < b.title ? 1 : -1));
        element.textContent = option;
        trieActuel.textContent = trie;
      }
      if (trie === "Popularité") {
        photographeMedias.sort((a, b) => (a.likes < b.likes ? 1 : -1));
        element.textContent = option;
        trieActuel.textContent = trie;
      }
      cartes.innerHTML = "";
      affichageMedias();
    });
  });
};

// Modal
//------------------------------------------------
// Ouverture - Fermeture
BoutonContact.addEventListener("click", () => {
  body.style.overflow = "hidden";
  modal.style.display = "block";
  premierFocusModal.focus();
  nomPhotographe.textContent = photographe.name;
});

const fermetureModal = (e) => {
  e.preventDefault();
  body.style.overflow = "visible";
  modal.style.display = "none";
};

closeModal.addEventListener("click", (e) => {
  fermetureModal(e);
});

submit.addEventListener("click", (e) => {
  fermetureModal(e);
});

// Accessibilité avec la touche Tab
const trapModal = (e) => {
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === premierFocusModal) {
        e.preventDefault();
        dernierFocusModal.focus();
      }
    } else {
      if (document.activeElement === dernierFocusModal) {
        e.preventDefault();
        premierFocusModal.focus();
      }
    }
  }

  if (e.key === "Escape" || e.key === "Esc") {
    fermetureModal(e);
  }
  console.log(document.activeElement.textContent);
};

modal.addEventListener("keydown", trapModal);

// Incrémentation des likes et container total like et prix
//------------------------------------------------------------
const incrementationLike = () => {
  const likes = document.querySelectorAll(".carte__infos__favs");
  likes.forEach((element) =>
    element.addEventListener("click", () => {
      ajoutLike(element);
      count = 0;
      calculTotalLike();
    })
  );
};

const ajoutLike = (like) => {
  if (like.dataset.select == "true") {
    like.dataset.select = "false";
    like.childNodes[1].textContent = Number(like.childNodes[1].textContent) - 1;
    like.childNodes[2].classList.remove("remplissage");
  } else {
    like.dataset.select = "true";
    like.childNodes[1].textContent = Number(like.childNodes[1].textContent) + 1;
    like.childNodes[2].classList.add("remplissage");
  }
};

const calculTotalLike = () => {
  const nombreDeLikes = document.querySelectorAll(".nombres-de-likes");
  nombreDeLikes.forEach((element) => {
    element = Number(element.textContent);
    count += element;
    totalLikes.textContent = count;
  });
};

const prixJournalier = () => {
  prix.textContent = `
    ${photographe.price}
  `;
};

// Lightbox
//------------------------------------------------------------
// Ouverture Lightbox
const ouvrirLightbox = () => {
  premierFocusLightbox.focus();
  const cartes = document.querySelectorAll(".carte__media");
  cartes.forEach((carte, index) =>
    carte.addEventListener("click", () => {
      currentIndex = index;
      main.style.display = "none";
      lightbox.style.display = "flex";
      lightbox.setAttribute;
      affichageLightbox(currentIndex);
      const video = lightboxContainer.childNodes[1];
      video.setAttribute("controls", "controls");
    })
  );
};

// Fermeture Lightbox
const fermerLightbox = () => {
  main.style.display = "block";
  lightbox.style.display = "none";
};

closeLightbox.addEventListener("click", fermerLightbox);

// Affichage Lightbox
const affichageLightbox = (mediaId) => {
  lightboxContainer.innerHTML = `
    ${createMediaFactory(photographe.name, photographeMedias[mediaId])}
    <figcaption>${photographeMedias[mediaId].title}</figcaption>
  `;
};

// Navigation
const showNext = () => {
  currentIndex++;
  if (currentIndex === photographeMedias.length) {
    currentIndex = 0;
  }
  affichageLightbox(currentIndex);
  const video = lightboxContainer.childNodes[1];
  video.setAttribute("controls", "controls");
};

lightboxNext.addEventListener("click", showNext);

const showPrev = () => {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = photographeMedias.length - 1;
  }
  affichageLightbox(currentIndex);
  const video = lightboxContainer.childNodes[1];
  video.setAttribute("controls", "controls");
};

lightboxPrev.addEventListener("click", showPrev);

// Navigation Clavier
const navigationClavierLightbox = () => {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      fermerLightbox();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    } else if (e.key === "ArrowRight") {
      showNext();
    }
  });
};

navigationClavierLightbox();

// Accessibilité avec la touche Tab
const trapLightbox = (e) => {
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === premierFocusLightbox) {
        e.preventDefault();
        dernierFocusLightbox.focus();
      }
    } else {
      if (document.activeElement === dernierFocusLightbox) {
        e.preventDefault();
        premierFocusLightbox.focus();
      }
    }
  }
};

lightbox.addEventListener("keydown", trapLightbox);
