import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";

const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("cars/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        let  aKeys = Object.keys(oItems);
        $$("#carList").html("");
        for(let n = 0; n < aKeys.length; n++){
            let sCardP =  document.createElement("p");
            const sKey = aKeys[n];
            const oItem =oItems[aKeys[n]];
            if (oItem.completed){
                sCardP.classList.add("completed");  
            }
            
         sCardP .innerHTML= `
            <div class="card">
            <div class="card-content card-content-padding">${oItems[aKeys[n]].brand}<div class=\"row\"><div class=\"col\">
            <button id= d${sKey}  class="delete">I don't need this</button>
            </div>
            <div class=\"col\">
            <button id= f${sKey}  class="finish">I bought this</button></div></div></div></div>
            </div>
            <div class="card">
            <div class="card-content card-content-padding">${oItems[aKeys[n]].year}</div>
            </div>
            <div class="card">
            <div class="card-content card-content-padding">${oItems[aKeys[n]].color}</div>
            </div>
            <div class="card">
            <div class="card-content card-content-padding"><img src="${oItems[aKeys[n]].url}" width="200" height="300"/></div>
            </div>
            `
            $$("#carList").append(sCardP);
        }
        createDeleteHandlers();
        createFinishHandlers();
    });

});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("cars/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});
function createDeleteHandlers(){
    var aClassname = document.getElementsByClassName("delete");
    const sUser = firebase.auth().currentUser.uid;
  
    for(var n = 0; n < aClassname.length; n++){
      aClassname[n].addEventListener("click", (evt) =>{
        const sId = evt.target.id.substr(1); 
        firebase.database().ref("cars/"+sUser+"/"+ sId).remove();
      })
    }
}
function createFinishHandlers(){
    var aClassname = document.getElementsByClassName("finish");
    const sUser = firebase.auth().currentUser.uid;
    for(var n = 0; n < aClassname.length; n++){
      aClassname[n].addEventListener("click", (evt) =>{
        const sId = evt.target.id.substr(1);
        const sFinished =  new Date().toISOString().replace(".", "_");
        firebase.database().ref("cars/"+sUser+"/"+ sId + "/completed").set(sFinished);
      })
    }
}