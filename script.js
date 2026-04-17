'use strict';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const pendingCount = document.getElementById('pending-count');
const clearDoneBtn = document.getElementById('clear-done');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = loadTodos();
let currentFilter = 'all';
let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;

// ─── Persistence ────────────────────────────────────────────────────────────

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem('projeto01-todos')) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem('projeto01-todos', JSON.stringify(todos));
}

// ─── Rendering ───────────────────────────────────────────────────────────────

function getFilteredTodos() {
  if (currentFilter === 'pending') return todos.filter(t => !t.done);
  if (currentFilter === 'done') return todos.filter(t => t.done);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();
  list.innerHTML = '';

  if (filtered.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = 'Nenhuma tarefa encontrada.';
    list.appendChild(li);
  } else {
    filtered.forEach(todo => {
      list.appendChild(createItem(todo));
    });
  }

  const pending = todos.filter(t => !t.done).length;
  pendingCount.textContent = `${pending} tarefa${pending !== 1 ? 's' : ''} pendente${pending !== 1 ? 's' : ''}`;
}

function createItem(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.done ? ' done' : ''}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', () => toggleTodo(todo.id));

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = todo.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.textContent = '×';
  deleteBtn.title = 'Remover tarefa';
  deleteBtn.addEventListener('click', () => removeTodo(todo.id));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.push({ id: nextId++, text: trimmed, done: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTodos();
  render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

function clearDone() {
  todos = todos.filter(t => !t.done);
  saveTodos();
  render();
}

// ─── Event listeners ─────────────────────────────────────────────────────────

form.addEventListener('submit', e => {
  e.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

clearDoneBtn.addEventListener('click', clearDone);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────────

render();
