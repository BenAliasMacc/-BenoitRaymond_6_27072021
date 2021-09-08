const cards = document.querySelector(".cards");
const artiste = document.querySelector(".artiste");
const boutonMenuDeroulant = document.querySelector(
  ".photographies__filtre__liste__active"
);
const sousListeMenu = document.querySelectorAll(
  ".photographies__filtre__liste__inactive"
);
const arrow = document.querySelector("i");
const mediaHTML = document.querySelectorAll(".photographies__card__media");
const image = document.querySelectorAll("img");
const video = document.querySelectorAll("video");
const arrowDown = document.querySelector(".fa-chevron-down");
const contactBouton = document.querySelector(".artiste__contacte");
const modal = document.querySelector(".modal");
const croixModal = document.querySelector(".modal__content__close");
const lightbox = document.querySelector(".lightbox");

let trie = "";
let option = "";
let photographerMedias = [];
let lienMedia = "";

// Récupération de l'ID dans l'URL
//------------------------------------------------
const queryString_URL_Id = window.location.search;
const searchParamsId = new URLSearchParams(queryString_URL_Id);
const idPhotographeFromUrl = searchParamsId.get("id");
const trieActuel = document.querySelector(".trie-actuel");

// Modal
//------------------------------------------------
// Ouverture
const ouvertureModal = () => {
  modal.style.display = "block";
};
// fermeture
croixModal.addEventListener("click", () => (modal.style.display = "none"));

// Ouverture - fermeture menu
//--------------------------------------------------
const ouvertureMenu = () => {
  boutonMenuDeroulant.addEventListener("click", () => {
    arrowDown.classList.toggle("rotation");
    sousListeMenu.forEach((element) => {
      element.classList.toggle("ouverture");
    });
  });
};
ouvertureMenu();

// Affichage informations du photographe
//-----------------------------------------------------
const affichageInfoPhotographe = (arrayOfPhotographe) => {
  arrayOfPhotographe.find((photographer) => {
    // Affichage des tags
    let tagHTML = "";
    photographer.tags.forEach((tag) => {
      tagHTML += `
          <li class="artiste__informations__tags__tag">
            <button value"${tag}">#${tag}</button>
          </li>
          `;
    });

    if (photographer.id === Number(idPhotographeFromUrl)) {
      // Récupération du nom de l'artiste
      artisteName = photographer.name;

      // Affichage du Header
      artiste.insertAdjacentHTML(
        "beforeend",
        `
              <div class="artiste__informations">
                  <h1 class="artiste__informations__nom">${photographer.name}</h1>
                  <h2 class="artiste__informations__localisation">${photographer.city}, ${photographer.country}</h2>
                  <p class="artiste__informations__slogan">
                      ${photographer.tagline}
                  </p>
                  <ul class="artiste__informations__tags">
                      ${tagHTML}
                  </ul>
              </div>

              <button onclick="ouvertureModal()" class="artiste__contacte">Contactez-moi</button>

              <div class="artiste__illustration">
                  <img src="./Sample Photos/Miniatures/${photographer.portrait}" alt="" />
              </div>
              `
      );
    }
  });
};

// Affichage des médias
//-----------------------------------------------------
function createMediaFactory(artiste, elt) {
  if (elt.hasOwnProperty("image")) {
    return `<img src="./Sample Photos/${artiste}/${elt.image}">`;
  } else if (elt.hasOwnProperty("video")) {
    return `<video src="./Sample Photos/${artiste}/${elt.video}" controls></video>`;
  }
}

const affichageMedias = (arrayOfMedia) => {
  if (trie === "") {
    arrayOfMedia.sort((a, b) => (a.likes < b.likes ? 1 : -1));
  }
  arrayOfMedia.filter((element) => {
    //Element du DOM
    const fav = document.querySelectorAll(
      ".photographies__card__text-content__favs"
    );

    incrementationLike(fav);

    if (element.photographerId === Number(idPhotographeFromUrl)) {
      cards.insertAdjacentHTML(
        "beforeend",
        `
          <article class="photographies__card">
            <a class="photographies__card__media" title="${
              element.title
            } "href="./Sample Photos/${artisteName}/${
          element.image || element.video
        }" data-mediaId="${element.id}">
              ${createMediaFactory(artisteName, element)}
            </a>
            <div class="photographies__card__text-content">
                <h2 class="photographies__card__text-content__titre">${
                  element.title
                }</h2>
                <div class="photographies__card__text-content__favs">
                  <span class="nombres-de-likes">${
                    element.likes
                  }</span> <i class="fas fa-heart"></i>
                </div>
            </div>
          </article>
        `
      );
    }
  });
};

// Trie des médias
//------------------------------------------------------------
const trieMedias = (arrayOfMedia) => {
  sousListeMenu.forEach((element) => {
    element.addEventListener("click", (e) => {
      trie = e.currentTarget.textContent;
      option = trieActuel.textContent;
      if (trie === "Date") {
        arrayOfMedia.sort((a, b) => (a.date < b.date ? 1 : -1));
        element.textContent = option;
        trieActuel.textContent = trie;
      }
      if (trie === "Titre") {
        arrayOfMedia.sort((a, b) => (a.title < b.title ? 1 : -1));
        element.textContent = option;
        trieActuel.textContent = trie;
      }
      if (trie === "Popularité") {
        arrayOfMedia.sort((a, b) => (a.likes < b.likes ? 1 : -1));
        element.textContent = option;
        trieActuel.textContent = trie;
      }
      cards.innerHTML = "";
      affichageMedias(arrayOfMedia);
    });
  });
};

// Incrémentation des likes
//------------------------------------------------------------
const incrementationLike = (fav, likes) => {
  const nombresDeLikes = document.querySelector(".nombres-de-likes");
  fav.forEach((element) =>
    element.addEventListener("click", () => {
      likes = Number(nombresDeLikes.innerHTML);
      likes += 1;
    })
  );
};

// Lightbox
//------------------------------------------------------------
const lightboxInit = (arrayOfMedia) => {
  const liensMedias = document.querySelectorAll(".photographies__card__media");
  1;

  liensMedias.forEach((lien) => {
    lien.addEventListener("click", (e) => {
      e.preventDefault();
      idMedia = lien.getAttribute("data-mediaID");
      titre = lien.getAttribute("title");
      creationLightbox(arrayOfMedia, idMedia);
    });
  });
};

const creationLightbox = (arrayOfMedia, idMedia) => {
  creationLightboxDOM(arrayOfMedia, idMedia);
  nextLightbox(arrayOfMedia, idMedia);
  prevLightbox(arrayOfMedia, idMedia);
  navigationClavierLightbox(arrayOfMedia, idMedia);
};

// Création du DOM et affichage du média ciblé
const creationLightboxDOM = (arrayOfMedia, idMedia) => {
  arrayOfMedia.filter((element) => {
    if (element.id == idMedia) {
      lightbox.style.display = "flex";
      lightbox.innerHTML = "";
      lightbox.insertAdjacentHTML(
        "beforeend",
        `
      <span class="lightbox__close"  onclick="fermetureLightbox()"></span>
      <span class="lightbox__next"></span>
      <span class="lightbox__prev"></span>
      <figure class="lightbox__container">
        ${createMediaFactory(artisteName, element)}
        <figcaption>${element.title}</figcaption>
      </figure>
     `
      );
    }
  });
};

//Fermeture lightbox
const fermetureLightbox = () => {
  lightbox.style.display = "none";
};

const next = (arrayOfMedia, id) => {
  let i = arrayOfMedia.findIndex((media) => media.id == id);
  if (i === arrayOfMedia.length - 1) {
    i = -1;
  }
  let newID = arrayOfMedia[i + 1].id;
  creationLightbox(arrayOfMedia, newID);
};

const prev = (arrayOfMedia, id) => {
  let i = arrayOfMedia.findIndex((media) => media.id == id);
  if (i === 0) {
    i = arrayOfMedia.length;
  }
  let newID = arrayOfMedia[i - 1].id;
  creationLightbox(arrayOfMedia, newID);
};

const nextLightbox = (arrayOfMedia, id) => {
  document
    .querySelector(".lightbox__next")
    .addEventListener("click", () => next(arrayOfMedia, id));
};

const prevLightbox = (arrayOfMedia, id) => {
  document
    .querySelector(".lightbox__prev")
    .addEventListener("click", () => prev(arrayOfMedia, id));
};

// Navigation clavier
const navigationClavierLightbox = (arrayOfMedia, id) => {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      fermetureLightbox();
    } else if (e.key === "ArrowLeft") {
      prev(arrayOfMedia, id);
    } else if (e.key === "ArrowRight") {
      next(arrayOfMedia, id);
    }
  });
};

// /**
//  * @property {HTMLElement} element
//  * @property {string[]} medias Chemins des medias de la lightbox
//  * @property {string} src Chemins des medias de la lightbox
//  *
//  */
// class Lightbox {
//   static init() {
//     const links = Array.from(
//       document.querySelectorAll(
//         'a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".mp4"]'
//       )
//     );
//     const gallery = links.map((link) => link.getAttribute("href"));
//     const listeTitres = links.map((link) => link.getAttribute("title"));

//     links.forEach((link) =>
//       link.addEventListener("click", (e) => {
//         e.preventDefault();
//         const titre = e.currentTarget.getAttribute("title");
//         new Lightbox(
//           e.currentTarget.getAttribute("href"),
//           titre,
//           gallery,
//           listeTitres
//         );
//       })
//     );
//   }

//   /**
//    * @param {string} src SRC du media
//    * @param {string[]} medias Chemins des medias de la lightbox
//    */
//   constructor(src, title, medias, titres) {
//     this.element = this.buildDOM(src);
//     this.medias = medias;
//     this.titres = titres;
//     this.loadMedia(src, title);
//     this.onKeyUp = this.onKeyUp.bind(this);
//     document.body.appendChild(this.element);
//     document.addEventListener("keyup", this.onKeyUp);
//     console.log(src);
//     console.log(title);
//     console.log(medias);
//     console.log(titres);
//   }

//   loadMedia(src, title) {
//     this.src = null;
//     const mediaImage = document.createElement("img");
//     const mediaVideo = document.createElement("video");
//     const mediaTitle = document.createElement("figcaption");
//     const titleText = document.createTextNode(title);
//     const container = this.element.querySelector(".lightbox__container");
//     container.innerHTML = "";
//     this.src = src;

//     if (src.includes(".mp4")) {
//       container.appendChild(mediaVideo);
//       container.appendChild(mediaTitle);
//       mediaTitle.appendChild(titleText);
//       mediaVideo.setAttribute("controls", "");
//     } else {
//       const loader = document.createElement("div");
//       loader.classList.add("lightbox__container__loader");
//       container.appendChild(loader);
//       mediaImage.onload = () => {
//         container.removeChild(loader);
//         container.appendChild(mediaImage);
//         container.appendChild(mediaTitle);
//         mediaTitle.appendChild(titleText);
//       };
//     }
//     mediaImage.src = src;
//     mediaVideo.src = src;
//   }

//   /**
//    * @param {KeyboardEvent} e
//    */
//   onKeyUp(e) {
//     if (e.key === "Escape") {
//       this.close(e);
//     } else if (e.key === "ArrowLeft") {
//       this.prev(e);
//     } else if (e.key === "ArrowRight") {
//       this.next(e);
//     }
//   }

//   /**
//    * Ferme la lightbox
//    * @param {MouseEvent/KeyboardEvent} e SRC du media
//    */
//   close() {
//     this.element.classList.add("fermeture");
//     window.setTimeout(() => {
//       this.element.parentElement.removeChild(this.element);
//     }, 500);
//     document.removeEventListener("keyup", this.onKeyUp);
//   }

//   next() {
//     let i = this.medias.findIndex((media) => media === this.src);
//     if (i === this.medias.length - 1) {
//       i = -1;
//     }
//     this.loadMedia(this.medias[i + 1]);
//   }

//   prev() {
//     let i = this.medias.findIndex((media) => media === this.src);
//     if (i === 0) {
//       i = this.medias.length;
//     }
//     this.loadMedia(this.medias[i - 1]);
//   }

//   /**
//    * @param {string} src SRC du media
//    * @return {HTMLElement}
//    */
//   buildDOM() {
//     const dom = document.createElement("section");
//     dom.classList.add("lightbox");
//     const lightbox = document.querySelector(".lightbox");
//     dom.innerHTML = `
//     <span class="lightbox__close"></span>
//     <span class="lightbox__next"></span>
//     <span class="lightbox__prev"></span>
//     <figure class="lightbox__container">

//     </figure>
//     `;
//     dom
//       .querySelector(".lightbox__close")
//       .addEventListener("click", this.close.bind(this));
//     dom
//       .querySelector(".lightbox__next")
//       .addEventListener("click", this.next.bind(this));
//     dom
//       .querySelector(".lightbox__prev")
//       .addEventListener("click", this.prev.bind(this));
//     return dom;
//   }
// }

// Récupération des données de la DB
//------------------------------------------------------------
const fetchAllData = async () => {
  await fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      // Tableau des médias de l'artiste sélectionné
      photographerMedias = data.media.filter((media) => {
        return idPhotographeFromUrl == media.photographerId;
      });

      console.log(data.media);
      console.log(photographerMedias);

      affichageInfoPhotographe(data.photographers);

      trieMedias(data.media);

      affichageMedias(data.media);

      // creationLightbox(photographerMedias);
      lightboxInit(photographerMedias);
    });
};

fetchAllData();
