//form elemanlarını seçme

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners();

function eventListeners(){
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

//Türkçe karakter sorunu için
String.prototype.toTRLowerCase = function() {
    for (var i = ["Ç", "Ü", "Ğ", "I", "İ", "Ş", "Ö"], r = ["ç", "ü", "ğ", "ı", "i", "ş", "ö"], t = this, n = 0; n < i.length; n++)
        t = t.replace(new RegExp(i[n],"g"), r[n]);
    return t.toLowerCase()
} 

function clearAllTodos(e){
    if(confirm("Tümünü silmek istediğinize emin misiniz?")){
        //arayüzden todoları temizleme
        //todoList.innerHTML = ""; //yavaş
        
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toTRLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toTRLowerCase();
        if (text.indexOf(filterValue) === -1){
            //Bulamayınca
            listItem.setAttribute("style", "display : none !important");
        }
        else{
            listItem.setAttribute("style", "display : block");

        }
    });

}

function deleteTodo(e){
    if ( e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromLocalStorage(e.target.parentElement.parentElement.textContent)
        showAlert("success", "Todo başarıyla silindi!!")
    }
}

function deleteTodoFromLocalStorage(deletetodo){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo, index){
        if(todo === deletetodo){
            todos.splice(index, 1); // arrayden item silme . o indexten itibaren 1 todo silecek
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));

}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}
function addTodo(e){
    let todos = getTodosFromStorage();
    const newTodo = todoInput.value.trim();
    if (newTodo === ""){
        showAlert("danger", "Lütfen bir todo giriniz!!");
    }
    else if (todos.indexOf(newTodo) != -1 ) {
        showAlert("warning", "Farklı bir todo giriniz.")
    }
    else  {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Yeni Todo başarıyla eklendi.");
    }

    e.preventDefault();
}


function getTodosFromStorage(){
    let todos;
    if(localStorage.getItem("todos") === null){
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message){
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    setTimeout(function(){alert.remove()}, 2000);
    console.log(alert);
}

function addTodoToUI(newTodo){//string değerini lisritem olarak uı a ekleme


    //list item oluşturma
    const listItem = document.createElement("li");
    //llink oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between";
    //text node oluşturma
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    // todoliste listitemi ekleme
    todoList.appendChild(listItem);
    todoInput.value = "";
}