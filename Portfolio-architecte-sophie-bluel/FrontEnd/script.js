
//VARIABLES

let work = "yo";
await fetching();
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);
let reponseConnection = "";

console.log(work.length);

if (filename == "index.html") {
    remplirGallerie();
    modalGallerie();
}



//SI TOKEN DANS LOCAL STORAGE
if (filename == "index.html") {
    if (!!window.localStorage.getItem("token")) {

        //LOG IN DEVIENT LOGOUT
        let log = document.getElementById("login-change");

        log.innerText = "Log Out";

        //AJOUT BARRE NOIRE
        let barre = document.getElementById("displaybarre");
        barre.style.display = "block";

        //AJOUTER DES MODIFIERS
        let modifDiv = document.getElementsByClassName("modif");
        for (let i = 0; i < modifDiv.length; i++) {
            modifDiv[i].style.display = "block";
        }

        //GESTION LOGOUT
        let lienLog = document.getElementById("login-click");
        lienLog.setAttribute("href", "index.html");
        lienLog.addEventListener("click", function () {

            window.localStorage.removeItem("token");
        })
    }
}

//RECUPERATION DE LA GALLERIE JSON
async function fetching() {
    work = [];
    let reponses = await fetch("http://localhost:5678/api/works")
    let works = await reponses.json();
    console.log(works);
    work = works;
}

//SUPPRIMER LA GALLERIE INITIALE 
function supprimerGallerie() {
    let maDiv = document.getElementsByClassName("gallery");
    maDiv[0].innerHTML = "";
}

//SUPPRIMER LA GALLERIE MODALE
function supprimerGallerieModal() {
   
    let maDiv = document.getElementById("modal-gallerie");
    maDiv.innerHTML = "";
}

//REMPLISSAGE GALLERIE

async function remplirGallerie() {

    work = [];
    let reponses = await fetch("http://localhost:5678/api/works")
    let works = await reponses.json();
    work = works;
    for (let i = 0; i < work.length; i++) {
        //CERTAINS WORK[I] UNDEFINED LE CODE BUG  
        if (work[i] == undefined) {
            continue;
        }
        else {
            let maDiv = document.getElementsByClassName("gallery");
            let maSection = document.createElement("section")
            let monImage = document.createElement("img");
            monImage.src = work[i].imageUrl;
            let monTitre = document.createElement("figcaption");
            monTitre.innerText = work[i].title;
            maDiv[0].appendChild(maSection);
            maSection.appendChild(monImage);
            maSection.appendChild(monTitre);
        }
    }


}



async function remplirGallerieCategorie(categorie) {

    for (let i = 0; i < work.length; i++) {
        //CERTAINS WORK[I] UNDEFINED LE CODE BUG  
        if (work[i] == undefined) {
            continue;
        }
        else {
            if (work[i].category.name == categorie) {
                let maDiv = document.getElementsByClassName("gallery");
                let maSection = document.createElement("section")
                let monImage = document.createElement("img");
                monImage.src = work[i].imageUrl;
                let monTitre = document.createElement("figcaption");
                monTitre.innerText = work[i].title;
                maDiv[0].appendChild(maSection);
                maSection.appendChild(monImage);
                maSection.appendChild(monTitre);

            }
        }
    }
}




if (filename == "index.html") {

    //GESTION FILTRES

    let buttonTous = document.getElementById("filtre-item1");
    let buttonObjets = document.getElementById("filtre-item2");
    let buttonAppartements = document.getElementById("filtre-item3");
    let buttonHotels = document.getElementById("filtre-item4");

    buttonTous.addEventListener("click", function () {
        supprimerGallerie();
        remplirGallerie();
    })
    buttonObjets.addEventListener("click", function () {
        supprimerGallerie();
        remplirGallerieCategorie("Objets");
    })
    buttonAppartements.addEventListener("click", function () {
        supprimerGallerie();
        remplirGallerieCategorie("Appartements");
    })
    buttonHotels.addEventListener("click", function () {
        supprimerGallerie();
        remplirGallerieCategorie("Hotels & restaurants");
    })
}

if (filename == "login.html") {
    //CONNECTION 
    let buttonConnect = document.getElementById("submit-form");
    buttonConnect.addEventListener("click", async function (event) {

        //EMPECHE LA PAGE DE SE RECHARGER 
        event.preventDefault();
        let forms = document.getElementsByClassName("input-form");
        let mail = forms[0].value;
        let password = forms[1].value;
        let compte = {
            "email": mail,
            "password": password
        }
        let requete = JSON.stringify(compte);
        let response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requete
        })
        let result = await response.json();

        if (!!result.token) {
            window.localStorage.setItem("token", result.token);
            location.href = "index.html";
        }
        else {

            let erreur = document.getElementById("error");

            erreur.style.display = "block";
        }
    })

}



//MODAL

//CAPTER LE NOMBRE DARTICLE DANS LA GALLERIE A LINSTANT T 

// CREATION DE LA GALLERIE DANS LE MODAL 

async function modalGallerie() {
    work = [];
    let reponses = await fetch("http://localhost:5678/api/works")
    let works = await reponses.json();
    console.log(works);
    work = works;
 
    let x = 0;
    
    for (let i = 0; i < work.length; i++) {
        
        //CERTAINS WORK[I] UNDEFINED LE CODE BUG  
        if (work[i] == undefined) {
            continue;
        }
        else {
            if (i % 5 == 0) {
                x++;
            }

            
            let maDiv = document.getElementById("modal-gallerie");
            let maSection = document.createElement("figure");
            maSection.className = "figureModal";
            maSection.style.gridRowStart = x;
            maSection.style.gridRowEnd = x;
            let monImage = document.createElement("img");
            monImage.src = work[i].imageUrl;
            monImage.className = "imageModal";
            let monBoutton = document.createElement("i");

            monBoutton.className = "fa-solid fa-trash-can";

            monBoutton.dataset.id = work[i].id;

            monBoutton.addEventListener("click", async function (event) {
                event.preventDefault();

                console.log(work[i]);


                await fetch(`http://localhost:5678/api/works/${monBoutton.dataset.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${window.localStorage.getItem("token")}`
                        }
                    })

                supprimerGallerieModal();
                
                supprimerGallerie();
                remplirGallerie();
                modalGallerie();
                

            })

            let monTitre = document.createElement("figcaption");
            monTitre.innerText = "éditer";
            monTitre.className = "captionModal";
            maDiv.appendChild(maSection);
            maSection.appendChild(monImage);
            maSection.appendChild(monBoutton);
            maSection.appendChild(monTitre);
        }
    }

}

//OUVERTURE FERMETURE MODAL 
let modal = document.getElementById("modal1");
let ouvrirModal = document.getElementsByClassName("modif-text");
ouvrirModal[2].addEventListener("click", function () {
    if (modal.style.display = "none") {
        modal.style.display = "flex";
    }
})

let fermerModal = document.getElementById("leaveModal");
fermerModal.addEventListener("click", function () {
    let modal = document.getElementById("modal1");
    modal.style.display = "none";
})

let fermerModal2 = document.getElementById("leaveModal2");
fermerModal2.addEventListener("click", function () {
    let modal = document.getElementById("modal1");
    modal.style.display = "none";
    let modal2 = document.getElementById("page2");
    modal2.style.display = "none";
    let modal1 = document.getElementById("page1");
    modal1.style.display = "block";

})


//FERMETURE MODAL SI ON CLIQUE
document.addEventListener("click",function(event)
 {  
    //SI LE CLICK SE FAIT PAS SUR LE BOUTON MODIFIER 
    if(event.target.className!="modif-text")
    {
        let maModal = document.getElementById("modal1");
        if( !event.target.closest(".modal-wrapper"))
    {
      
      maModal.style.display="none";

    }
    }
    
 
})

//ALLER PAGE2 PR AJOUTER PHOTO MODAL 
let ajoutPhotoModal = document.getElementById("addModal");
ajoutPhotoModal.addEventListener("click", function () {
    let pageUne = document.getElementById("page1");
    pageUne.style.display = "none";
    let pageDeux = document.getElementById("page2");
    pageDeux.style.display = "block";
    let modalWrapper = document.getElementsByClassName("modal-wrapper");
    modalWrapper[0].style.height = "670px";

})


//RETOUR FENETRE MODAL PRECEDENTE
let previousModal = document.getElementById("previousModal");
previousModal.addEventListener("click", function () {
    let modal2 = document.getElementById("page2");
    modal2.style.display = "none";
    let modal1 = document.getElementById("page1");
    modal1.style.display = "block";
})


//AFFICHAGE IMAGE SELECTIONEE 

let premiereFenetre = document.getElementById("premier-container");
let imgPreview = document.getElementById("img-preview");
let inputPhoto = document.getElementById("photo");
inputPhoto.addEventListener("change", function () {

    premiereFenetre.style.display = "none";

    image();

})


//FUNCTION RECUPERER LIMAGE LORS DE LINPUT TYPE FILE 
function image() {
    const files = inputPhoto.files[0];
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            imgPreview.style.display = "block";
            imgPreview.innerHTML = '<img src="' + this.result + '" />';
        });
    }
}

//TESTER FORMULAIRE ENVOIE PHOTO 
/*ICI JE CREER UNE FONCTION QUI QUAND JAI AJOUTER IMAGE TEST SI LES TROIS FORMULAIRES SONT REMPLIS
  (IMAGE/ TITRE / CATEGORIE ) 
  SI CEST LE CAS LE VALIDER DEVIENT VERT 
  JE FAIS APPEL A CETTE FONCTION A CHQUE FOIS QUE JAJOUTE UNE IMAGE OU RENTRE LE TITRE OU CHOISIT UNE CATEGORIE 
  SI JESSAYE DE VALIDER SANS QUE CE SOIT VALIDE : MESSAGE DERREUR 
*/
let titreImage = document.getElementById("titre-formulaire");
let categorieImage = document.getElementById("categorie-formulaire");
let photoImage = document.getElementById("photo");

let valideImage = document.getElementById("valid-form");
valideImage.disabled = "true";



function testFormulaire() {




    let valeurTitreImage = titreImage.value;
    if (!(valeurTitreImage == "") && !(categorieImage.selectedIndex == 0) && !(photoImage.files.length == 0)) {

        valideImage.style.backgroundColor = "#1D6154";
        valideImage.removeAttribute('disabled');
    }
}

titreImage.addEventListener("input", function () {
    testFormulaire();
})

photoImage.addEventListener("change", function () {
    testFormulaire();
})

categorieImage.addEventListener("change", function () {
    testFormulaire();
})


console.log(window.localStorage.getItem("token"))
//ENVOIE NOUVEAU TRAVAIL




valideImage.addEventListener("click", async function () {

    let formData = new FormData();
let selectedPic = inputPhoto.files[0];
let selectedDesc = titreImage.value;
let selectedCat = categorieImage.selectedIndex;
formData.append("image", selectedPic);
formData.append("title", selectedDesc);
formData.append("category", selectedCat);
    console.log(selectedCat);
    console.log(selectedPic);
    console.log(selectedDesc);

    await fetch('http://localhost:5678/api/works/',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            },
            body: formData
        }
    );
    supprimerGallerieModal();
                
                supprimerGallerie();
                remplirGallerie();
                modalGallerie();
})


