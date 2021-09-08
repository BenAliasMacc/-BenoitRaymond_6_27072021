// Lightbox
//------------------------------------------------------------
const creationLightbox = (arrayOfMedia) => {
  const liensMedias = document.querySelectorAll(".photographies__card__media");

  liensMedias.forEach((lien) => {
    lien.addEventListener("click", (e) => {
      e.preventDefault();
      idMedia = lien.getAttribute("data-mediaID");
      titre = lien.getAttribute("title");
      creationLightboxDOM(arrayOfMedia, idMedia);
      navigationClavierLightbox();
      nextLightbox(arrayOfMedia, idMedia);
    });
  });
};

// Création du DOM et affichage du média ciblé
const creationLightboxDOM = (arrayOfMedia, media) => {
  arrayOfMedia.filter((element) => {
    if (element.id == media) {
      console.log(element.id);
      console.log(element);
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

const nextLightbox = (arrayOfMedia, id) => {
  document.querySelector(".lightbox__next").addEventListener("click", () => {
    let i = arrayOfMedia.findIndex((media) => media.id == id);
    let newID = arrayOfMedia[i + 1].id;
    console.log(id);
    creationLightboxDOM(arrayOfMedia, newID);
  });
  nextLightbox(arrayOfMedia, newID);
};

const prevLightbox = () => {};

// Navigation clavier
const navigationClavierLightbox = () => {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      fermetureLightbox();
    }
  });
};
