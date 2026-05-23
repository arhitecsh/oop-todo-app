const log = console.log;

class LocalStorage {
    #keyname
    constructor (keyname) {
        this.#keyname = keyname;
    }
    getItem() {
        const items = localStorage.getItem(this.#keyname)
        return items ? JSON.parse(items) : []
    }
    setItem(itemsList) {
        localStorage.setItem(this.#keyname, JSON.stringify(itemsList))
    }
}

class DOM {
    querry(selector) {
        return document.querySelector(selector)
    }
    create(type, textContent, ...classNames) {
        const item = document.createElement(type);
        item.textContent = textContent;
        item.classList.add(...classNames);
        return item
    }
}

class Item {
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }
}

class TodoItem extends Item {
    constructor (id,text, completed = false) {
        super(id,text)
        this.completed = completed;
    }
}

class TodoApp {
    constructor() {

        this.dom = new DOM;
        this.storage = new LocalStorage;
        this.todoList = this.storage.getItem();
        this.todoInput = this.dom.querry("[data-add-todo-input]")
        this.todoContainer = this.dom.querry("[data-todo-container]")
        
        this.bindEvents();
        this.render()
    }  


    addTodo(text) {
        const newTodo = new TodoItem(Date.now(), text)
        this.todoList.push(newTodo)
        this.storage.setItem(this.todoList)
    }
        
    removeTodo(id) {
        this.todoList = this.todoList.filter(todo => todo.id !== id)
        this.storage.setItem(this.todoList)
        this.render()
    }

    toggleTodo(id) {
        const todo = this.todoList.find(todo => todo.id === id)
        if (todo) {
            todo.completed = !todo.completed;
            this.render()
        }

    }

    bindEvents() {
        this.todoInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
                this.addTodo(e.target.value.trim())
                this.todoInput.value = ""
                this.render()
            }
        })

        this.todoContainer.addEventListener('click', (e) => {
            const el = e.target;

            if(el.classList.contains('remove-btn')) {
                const id = Number(el.dataset.id)
                this.removeTodo(id)
            } else if(el.classList.contains('todo-item')) {
                const id = Number(el.dataset.id)
                this.toggleTodo(id)
            }

        })
    }

    render() {  
        this.todoContainer.innerHTML = '';

        this.todoList.forEach(todo => {
            const Todoitem = this.dom.create('div', todo.text, 'todo-item');
            Todoitem.dataset.id = todo.id;

            const removebtn = this.dom.create('button', '×', 'remove-btn');
            removebtn.dataset.id = todo.id;
            removebtn.disabled = !todo.completed;

            Todoitem.appendChild(removebtn)
            this.todoContainer.appendChild(Todoitem);
        })
    }
}

new TodoApp();
