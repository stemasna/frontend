let dati = [];

function fetchDati(){
    fetch('http://localhost:3000/utenti/   ')
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

function CaricaDati(){
    
    while(container.firstChild) container.removeChild(container.firstChild);

    for(var k=0; k<dati.length; ++k){
        
        const tr = document.createElement("tr");
        for(var prop in dati[k]){
            let item = dati[k][prop];
            if(prop === 'email'){
                appendColumn(tr, (item));
                //console.log(item.password)
                //appendColumn(tr, (item.password));
            }
        }


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
    document.querySelector(".overlay").style.display = "block"; 
}
function OnModifica(event){
    const row = event.target.parentNode.parentNode;
    
    const id = row.querySelector("td").innerHTML;
    idModifica = id;
    const persona = dati.find(x => x.email == id);
    if(persona==null) return;

    const modal = document.querySelector("#modal-modifica");
    modal.querySelector("[name='email']").value = persona.email;
    modal.querySelector("[name='password']").value = persona.password;
    modal.style.display = "flex"; // mostra modale
    document.querySelector(".overlay").style.display = "block"; // mostra overlay
}
function OnElimina(event){
    const row = event.target.parentNode.parentNode;
    const id = row.querySelector("td").innerHTML;
    
    container.removeChild(row);
    
    dati = dati.filter(x => x.email != id);

    fetch('http://localhost:3000/utenti/deleteutenti/   '+id, {
        method: 'DELETE'
    })
}

function Annulla(){
    document.querySelectorAll(".modal, .overlay")
    .forEach(modal => modal.style.display = "none");
}
function ChiediChiudiOverlay(){
    if(confirm("Vuoi annullare le modifiche?"))
        Annulla()
}

function OnSalva(){
    const modal = document.querySelector("#modal-modifica");
    const persona = {
        email: idModifica,
        email: modal.querySelector("[name='email']").value,
        password: modal.querySelector("[name='password']").value,
    };
    dati = dati.map(
        x => x.email == idModifica ? persona : x
    );

    fetch('http://localhost:3000/utenti/updateutente'+idModifica, {
        method: 'PUT',
        body: ObjectToURL(persona),
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    CaricaDati();
    idModifica = null;

    Annulla();
}
function OnSalvaNuovo(){
    const modal = document.querySelector("#modal-nuovo");
    const persona = {
        email: modal.querySelector("[name='email']").value,
        password: modal.querySelector("[name='password']").value,
       
    };
    dati.push(persona);

    fetch('http://localhost:3000/utenti/addutente', {
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