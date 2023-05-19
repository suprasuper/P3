
//VARIABLES
let work = "yo";
await fetching();


//RECUPERATION DE LA GALLERIE JSON
async function fetching(){
    let reponses = await fetch("http://localhost:5678/api/works")
    let works = await reponses.json();
    work = works;   
}

//SUPPRIMER LA GALLERIE INITIALE 
function supprimerGallerie(){
    let galleries = document.querySelectorAll("figure");
    for(let i =1;i<galleries.length;i++)
    {
       galleries[i].innerHTML="";
    }
}

//REMPLISSAGE GALLERIE
async function remplirGallerie(){
    let galleries = document.querySelectorAll("figure");
    for(let i=0;i<galleries.length;i++)
    {
        //CERTAINS WORK[I] UNDEFINED LE CODE BUG  
       if(work[i]==undefined)
       {
        continue;
       }
       else
       {
        let monImage = document.createElement("img");
        monImage.src=work[i].imageUrl;
        let monTitre = document.createElement("p");
        monTitre.innerText=work[i].title;
        galleries[i+1].appendChild(monImage);
        galleries[i+1].appendChild(monTitre);
       }
    }
}

async function remplirGallerieCategorie(categorie){
    let galleries = document.querySelectorAll("figure");
    for(let i=0;i<galleries.length;i++)
    {
        //CERTAINS WORK[I] UNDEFINED LE CODE BUG  
       if(work[i]==undefined)
       {
        continue;
       }
       else 
       {
        if(work[i].category.name==categorie){
            let monImage = document.createElement("img");
            monImage.src=work[i].imageUrl;
            let monTitre = document.createElement("p");
            monTitre.innerText=work[i].title;
            galleries[i+1].appendChild(monImage);
            galleries[i+1].appendChild(monTitre);
        }
       }
    }
}

//GESTION FILTRES
    let buttonTous = document.getElementById("filtre-item1");
    let buttonObjets = document.getElementById("filtre-item2");
    let buttonAppartements = document.getElementById("filtre-item3");
    let buttonHotels = document.getElementById("filtre-item4");
    
    buttonTous.addEventListener("click",function(){
        supprimerGallerie();
        remplirGallerie();
    })
    buttonObjets.addEventListener("click",function(){
        supprimerGallerie();
        remplirGallerieCategorie("Objets");
    })
    buttonAppartements.addEventListener("click",function(){
        supprimerGallerie();
        remplirGallerieCategorie("Appartements");
    })
    buttonHotels.addEventListener("click",function(){
        supprimerGallerie();
        remplirGallerieCategorie("Hotels & restaurants");
    })

    
supprimerGallerie();
remplirGallerie();





