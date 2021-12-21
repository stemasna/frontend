// contenitore globale dei dati degli studenti
let dati = [];

function fetchDati(){
    fetch('http://localhost:3000/updateutente', {
        mode: 'no-cors',
    })
    .then(res=>res.json())
    .then(json=>{
        dati = json;
        CaricaDati();
    })
    .catch(err=>console.error(err));
}
fetchDati();

const container = document.querySelector("tbody");

let idModifica = null;

function appendColumn(container, data){
    const td = document.createElement("td");
    td.innerHTML = data;
    container.appendChild(td);
}

function InterpretDate(dateString){
    let parts = dateString.split('/');
    return new Date(+parts[0], parts[1]+1, +parts[2]);
}

function CaricaDati(){
    while(container.firstChild) container.removeChild(container.firstChild);

    for(var k=0; k<dati.length; ++k){
        const tr = document.createElement("tr");
       
        const azioni = document.createElement("td");
        azioni.classList.add("btn-group")
        
        const modifica = document.createElement("button");
        modifica.innerHTML="MODIFICA";
        modifica.classList.add("btn","btn-info");
        modifica.addEventListener('click', OnModifica);

        const elimina = document.createElement("button");
        elimina.innerHTML="ELIMINA";
        elimina.classList.add("btn","btn-danger");
        elimina.addEventListener('click', OnElimina);
        
        azioni.appendChild(modifica);
        azioni.appendChild(elimina);

        tr.appendChild(azioni);

        container.appendChild(tr);
    }
}

function OnNuovo(){
    document.querySelector("#modal-nuovo").style.display = "flex";
    document.querySelector(".overlay").style.display = "block"; // mostra overlay
}
function OnModifica(event){
    const row = event.target.parentNode.parentNode;
    // prima colonna
    const id = row.querySelector("td").innerHTML;
    idModifica = id;
    const persona = dati.find(x => x.username == id);
    if(persona==null) return;

    const modal = document.querySelector("#modal-modifica");
    modal.querySelector("[name='nome']").value = persona.nome;
    modal.querySelector("[password='password']").value = persona.cognome;
    modal.style.display = "flex"; // mostra modale
    document.querySelector(".overlay").style.display = "block"; // mostra overlay
}
function OnElimina(event){
    const row = event.target.parentNode.parentNode;
    const id = row.querySelector("td").innerHTML;
    // rimuovo la riga dall'HTML
    container.removeChild(row);
    // rimuovo elemento in base all'ID
    dati = dati.filter(x => x.username != id);

    fetch('/utenti/deleteutenti/'+id, {
        method: 'DELETE'
    })
}
// chiude la modale
function Annulla(){
    // nascondi tutte le modali e overlay
    document.querySelectorAll(".modal, .overlay")
    .forEach(modal => modal.style.display = "none");
}
function ChiediChiudiOverlay(){
    if(confirm("Vuoi annullare le modifiche?"))
        Annulla()
}
// salva dati e ricarica la tabella
function OnSalva(){
    const modal = document.querySelector("#modal-modifica");
    const persona = {
        username: idModifica,
        password: modal.querySelector("[password='password']").value,
       
    };
    dati = dati.map(
        x => x.username == idModifica ? persona : x
    );

    fetch('/utenti/updateutenti/'+idModifica, {
        method: 'PUT',
        body: ObjectToURL(persona),
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    CaricaDati();
    idModifica = null;

    // chiudere modale
    Annulla();
}
function OnSalvaNuovo(){
    const modal = document.querySelector("#modal-nuovo");
    const persona = {
        username: parseInt(Math.random()*100)+dati.length,
        password: modal.querySelector("[password='password']").value,
    };
    dati.push(persona);

    fetch('/utenti/addutenti', {
        method: 'POST',
        body: ObjectToURL(persona),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(async res=>{
        if(res.status == 200)
            return res.text()
        else{
            error = await res.text()
            throw Error(error);
        }
    })
    .catch(err=>console.error(err));

    CaricaDati();
    Annulla();
}

function ObjectToURL(object){
    let parts = [];
    for(var part in object){
        parts.push(part+'='+object[part]);
    }
    return parts.join('&');
}
function registrato(object){
    for(var k=0; k<dati.length; ++k){
        if(dati[k]!=object)
            console.error("utente non registrato");
        else
            location.href ="C:\Users\Utente\Desktop\progetto\pp\views\index.html";
    }
}