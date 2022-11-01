
let textOptionEl = document.querySelectorAll(".btnOpcion");
let advTextOptionEl = document.querySelectorAll(".advBtnOpcion");

let writingAreaEL = document.getElementById("text-input");
let linkBtnEl = document.getElementById("createLink");
let formatBtnsEL = document.querySelectorAll(".format");

const initializer = () =>{
    highlighter(formatBtnsEL, false);
}

const highlighter = (className, needsRemoval) =>{
    className.forEach((button) =>{
        button.addEventListener("click", () =>{
            if(needsRemoval){
                let alredyActive = false;
                if(button.classList.contains("activo")){
                    alredyActive = true;
                }
                highlighterRemover(className);
                if(!alredyActive){
                    button.classList.add("activo");
                }
            }
            else{
                button.classList.toggle("activo");
            }
        });
    });
};

const highlighterRemover = (className) =>{
    className.forEach((button) =>{
        button.classList.remove("activo");
    });
}

window.onload = initializer();

const modifyText = (command, defaultUI, value) =>{
    document.execCommand(command, defaultUI, value);
};

textOptionEl.forEach((button) =>{
    button.addEventListener("click", () =>{
        modifyText(button.id, false, null);
    });
})

linkBtnEl.addEventListener("click", () =>{
    let userLink = prompt("Ingrese un URL");
    if(/http/i.test(userLink)){
        modifyText(linkBtnEl.id, false, userLink);
    }
    else{
        userLink = "http://" + userLink;
        modifyText(linkBtnEl.id, false, userLink);
    }
})