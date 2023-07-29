let id = 0;

let todos = [];

const getTodoId = (todo) => 'todo-' + todo.id;

const todoTextDiv = (todo) => `<div id='todo-text-${todo.id}' class='todo-text'>${todo.text}</div>`;

const updateTodo = (todo, add) => {
    const todoId = getTodoId(todo);
    const checkboxId = 'cb-' + todo.id;
    const checked = todo.done ? 'checked' : '';
    const checkbox = `<input type='checkbox' id='${checkboxId}' ${checked}>`;
    const text = `<div id='todo-text-${todo.id}' class='todo-text'>${todo.text}</div>`;
    const removeButton = `<button id='rm-${todo.id}' class='btn btn-danger bi bi-trash'></button>`;
    const divHtml = `${checkbox} ${todoTextDiv(todo)} ${removeButton}`;
    if (add) {
        $('.todos').append(`<div id='${todoId}' class='mt-1 ${todo.done ? "done" : ""}'>${divHtml}</div>`);
    }
    else
        $(todoId).html(divHtml);
    $('#' + checkboxId).change(function() {
        // console.log('cb changed');
        todo.done = this.checked;
        localStorage.setItem('todos', JSON.stringify(todos))
        $('#' + todoId).toggleClass('done');
    });
    $(`#todo-text-${todo.id}`).dblclick(function() {
        // console.log('edit');
        const btnId = 'btn' + todo.id;
        const inpId = 'inp' + todo.id;
        const input = `<input type="text" id="${inpId}" value="${todo.text}">`;
        const btn = `<button id='${btnId}' class='btn btn-primary'>Save</button>`;
        const html = input + btn;
        $(this).html(html);
        $('#' + btnId).click(() => {
            todo.text = $('#' + inpId).val();
            localStorage.setItem('todos', JSON.stringify(todos))
            $(`#todo-text-${todo.id}`).html(todoTextDiv(todo));
        });
        $('#' + inpId).dblclick((e) => e.stopPropagation());
    });
    $(`#rm-${todo.id}`).click(() => {
        const index = todos.findIndex(t => t.id == todo.id);
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos))
        $('#' + getTodoId(todo)).remove();
    });
};

const onAddClick = () => {
    const text = $('#add-inp').val();
    $('#add-inp').val('')
    const todo = { id, text, done: false };
    todos.push(todo);
    id++;
    updateTodo(todo, true);
    localStorage.setItem('todos', JSON.stringify(todos));
};

const setTheme = (dark) => {
    if (dark === true) {
        $('body').css('background-color', 'black');
        $('body').css('color', 'white');
        $('#cb-theme').prop('checked', true);
    }
    if (dark === false) {
        $('body').css('background-color', 'white');
        $('body').css('color', 'black');
        $('#cb-theme').prop('checked', false);
    }
}

$(document).ready(() => {
    const items = localStorage.getItem('todos');
    const dark = JSON.parse(localStorage.getItem('dark'));
    setTheme(dark);
    if (items) {
        todos = JSON.parse(items);
        if (todos.length > 0)
            id = todos[todos.length - 1].id + 1;
        for (const todo of todos)
            updateTodo(todo, true);
    }   
    $('button#add').click(onAddClick);
    $('#cb-theme').change(function() {
        const checked = this.checked;
        localStorage.setItem('dark', JSON.stringify(checked));
        setTheme(checked);
    }); 
});
