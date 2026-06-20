const cl = console.log;

let base_url ='https://jsonplaceholder.typicode.com'
let todo_url = `${base_url}/todos`

const todoform = document.getElementById('todoform')
const title = document.getElementById('title')
const completed = document.getElementById('completed')
const userId = document.getElementById('userId')
const todoContainer = document.getElementById('todoContainer')
const addTodo = document.getElementById('addTodo')
const updateTodo = document.getElementById('updateTodo')
const spinner = document.getElementById('spinner')



let todoArr = [];

function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon :icon,
        timer : 4000
    })
}

function fetchData(){
    spinner.classList.remove('d-none')
    let todo_url = `${base_url}/todos`
 
    let xhr = new XMLHttpRequest();

    xhr.open('GET', todo_url)
    xhr.send(null)

    xhr.onload = function(){
        cl(xhr.response);
        cl(xhr.status);

        if(xhr.status >= 200 && xhr.status <=299){
            todoArr = JSON.parse(xhr.response)
            // cl(data);
            createCard(todoArr)
             $(function () {
             $('[data-toggle="tooltip"]').tooltip()
        })
             spinner.classList.add('d-none')

        }else{
             spinner.classList.add('d-none')
            snackbar('api failed', 'error')

        }
    }
}

fetchData()

function createCard(arr){
    let res = '';

    arr.forEach(ele =>{
        res += `<div class="col-md-6 mb-4" id=${ele.id}>
                <div class="card todocard">
                    <div class="card-body">
                        <h4>
                            title : <span class="title" data-toggle="tooltip" data-placement="top" title="${ele.title}">${ele.title}</span>
                        </h4>
                        <h5>
                            <strong>status:</strong>
                          
                            <span class="badge ${ele.completed ?"badge-success" :"badge-danger"}">
                                   ${ele.completed ?"completed" : "pending"}
                            </span> 
                        </h5>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-outline-primary" onclick="onedit(this)">Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="ondelete(this)">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`
        
    });
    todoContainer.innerHTML = res;
}

function onSubmit(ele){
     spinner.classList.remove('d-none')
    ele.preventDefault();

    let newObj={
        title : title.value,
        completed : completed.value === "Yes",
        userId : userId.value
    }
    todoArr.push(newObj)

    let xhr = new XMLHttpRequest();

    xhr.open('POST', todo_url)
    xhr.send(JSON.stringify(newObj));

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
            let col = document.createElement('div');
            col.className = 'col-md-6 mb-4';
            col.id = res.id;
            col.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h4>
                            title : <span class="title">${newObj.title}</span>
                        </h4>
                        <h5>
                            <strong>status:</strong>
                          
                            <span class="badge ${newObj.completed ?"badge-success":"badge-danger"}">
                                   ${newObj.completed ?"completed" : "pending"}
                            </span> 
                        </h5>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary" onclick="onedit(this)">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="ondelete(this)">Delete</button>
                    </div>
                </div>`
            todoContainer.prepend(col);
             spinner.classList.add('d-none')
             todoform.reset();
        }else{
             spinner.classList.add('d-none')
        snackbar('failed to submit data', 'error')
        }
    }
}

function onedit(ele){
     spinner.classList.remove('d-none')
    let editId = ele.closest('.col-md-6').id;
    localStorage.setItem('editId', editId)

    let edit_url =` ${base_url}/todos/${editId}`
    document.querySelectorAll('.btn-outline-danger').forEach(element => {
        element.disabled = true;
    });

    let xhr = new XMLHttpRequest();

    xhr.open('GET', edit_url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('Autho', 'get token from');

    xhr.send(null);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
             let editObj = JSON.parse(xhr.response);
           cl(editObj);
            title.value = editObj.title;
             if(editObj.completed){ 
                  completed.value= "Yes"
             }else{ 
                  completed.value= "No"
                 
             }
            cl(editObj.completed)
            userId.value = editObj.userId;
            addTodo.classList.add('d-none');
            updateTodo.classList.remove('d-none');
             spinner.classList.add('d-none')
             todoform.scrollIntoView({
                behavior :'smooth',
                block :'start'
             })
        }else{
             spinner.classList.add('d-none')
            snackbar('something went wrong', 'error')
        }

    }
}

function onupdateTodo(){
     spinner.classList.remove('d-none')
    let updateId = localStorage.getItem('editId')
    let update_url = `${base_url}/todos/${updateId}`

    let updatedObj={
        title : title.value,
        completed : completed.value,
        userId : userId.value,
        id : updateId
    }

    let xhr = new XMLHttpRequest();

    xhr.open('PATCH', update_url)
    xhr.send(JSON.stringify(updatedObj));

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let div = document.getElementById(updateId);
            div.innerHTML = `<div class="card-body">
                        <h4>
                            title : <span class="title">${updatedObj.title}</span>
                        </h4>
                        <h5>
                            <strong>status:</strong>
                          
                            <span class="badge ${updatedObj.completed ?"badge-success" :"badge-danger"}">
                                   ${updatedObj.completed ?"completed" : "pending"}
                            </span> 
                        </h5>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-outline-primary" onclick="onedit(this)">Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="ondelete(this)">Delete</button>
                        </div>
                    </div>
                </div>`

                addTodo.classList.remove('d-none');
                updateTodo.classList.add('d-none');
                todoform.reset();
                document.querySelectorAll('.btn-outline-danger').forEach(element => {
                element.disabled = false;
                spinner.classList.add('d-none')
                snackbar('todo updated successfully!!', 'success')
    });
        const card = div.closest('.card')
        div.scrollIntoView({behavior:'smooth', block:'center'});
        div.style.border = '2px solid green';
        card.classList.add('highlight');
        setTimeout((ele) => {
            ele.classList.remove('highlight')
            
        },4000);
        }else{
             spinner.classList.add('d-none')
            snackbar('failed to edit data', 'error')
        }


    }
}

function ondelete(ele){
     spinner.classList.remove('d-none')
    let removeId = ele.closest('.col-md-6').id;

    let remove_url = `${base_url}/todos/${removeId}`;

    let xhr = new XMLHttpRequest();

    xhr.open('DELETE', remove_url);
    xhr.send(null);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            Swal.fire({
            title: "Are you sure?",
            text: "Data cannot be restored or retrived!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) Swal.fire({
            title: "Deleted!",
            text: "data deleted successfully.",
            icon: "success"
        });
        });
            ele.closest('.col-md-6').remove()
             spinner.classList.add('d-none')
        }else{
            snackbar('failed to delete data', 'error')
             spinner.classList.add('d-none')
        }
    }
}
todoform.addEventListener('submit', onSubmit);
updateTodo.addEventListener('click', onupdateTodo)

