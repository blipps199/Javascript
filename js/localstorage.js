const todosDiv = document.querySelector('.todos');
const todoForm = todosDiv.querySelector('form');
const todoInput = todoForm.querySelector('input');
const todoList = todosDiv.querySelector('ul');
const clearTodos = document.querySelector('.clear-todos');

let todos = [];



if(localStorage.getItem('todos')){
    const existingTodos = JSON.parse(localStorage.getItem('todos'));

    console.log('testing');
    existingTodos.forEach(todo => {
        // console.log(capsule.id);
        let li = document.createElement("li");
        li.setAttribute('class', ['col p-2 mb-2 bg-light border list-group-item w-25']);
        li.appendChild(document.createTextNode(todo));
        li.textContent = `${todo}`;
        li.innerHTML;
        todoList.appendChild(li);
    })

}


todoForm.addEventListener('submit', e => {
    e.preventDefault();

    if(localStorage.getItem('todos')){
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    console.log(todos);

    if(todoInput.value != ''){
        todos.push(todoInput.value);
    }

    localStorage.setItem('todos', JSON.stringify(todos));

    const localTodos = JSON.parse(localStorage.getItem('todos'));

    todoList.innerHTML = '';

    localTodos.forEach(todo => {
        // console.log(capsule.id);
        let li = document.createElement("li");
        li.setAttribute('class', ['delete col p-2 mb-2 bg-light border list-group-item w-25']);
        li.appendChild(document.createTextNode(todo));
        li.textContent = `${todo}`;
        li.innerHTML;
        todoList.appendChild(li);
    })

    todoForm.reset();

})


clearTodos.addEventListener('click', () => {
    todoList.innerHTML = '';
    localStorage.removeItem('todos');
    todoForm.reset();
    localTodos = [];
    todos = [];
})

console.log(localStorage.getItem('todos'));