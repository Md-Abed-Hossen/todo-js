const addTaskButton = document.querySelector(".submit-button");
const inputField = document.querySelector(".task-input");
const output = document.querySelector(".output");

let isEditValue = "";

let getLocalStorageData = () => JSON.parse(localStorage.getItem("tasks")) || [];

const addLocalStorage = (value) => {
  localStorage.setItem("tasks", JSON.stringify(value));
};

let addToUi = (taskValue) => {
  const liElement = document.createElement("li");
  liElement.setAttribute("data-id", taskValue.id);
  const todoSpan = document.createElement("span");
  const buttonSpan = document.createElement("span");
  buttonSpan.classList.add("button-span");
  todoSpan.textContent = taskValue.value;
  liElement.appendChild(todoSpan);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    editTodo(todoSpan.textContent, taskValue.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", () => {
    deleteTodo(liElement, taskValue.id);
  });

  buttonSpan.appendChild(editButton);
  buttonSpan.appendChild(deleteButton);
  liElement.appendChild(buttonSpan);
  output.appendChild(liElement);
};

const editTodo = (todoValue, id) => {
  inputField.value = todoValue;
  isEditValue = id;
  addTaskButton.textContent = "Update Task";
};

const deleteTodo = (liElement, id) => {
  const todoData = liElement.querySelector("span").textContent;
  const confirmData = confirm(`Are you sure you want to delete: ${todoData}?`);
  if (!confirmData) return;
  liElement.remove();
  const localData = getLocalStorageData();
  const updateStorageData = localData.filter((value) => value.id !== id);
  addLocalStorage(updateStorageData);
};

addTaskButton.addEventListener("click", (e) => {
  e.preventDefault();
  let taskValue = inputField.value.trim();

  if (!taskValue) {
    alert("No value");
    return;
  }

  if (isEditValue) {
    let storageData = getLocalStorageData();
    storageData = storageData.map((item) =>
      item.id === isEditValue ? { ...item, value: taskValue } : item
    );

    addLocalStorage(storageData);
    isEditValue = "";
    output.innerHTML = "";
    uiLoad();
    addTaskButton.textContent = "Add Task";
    inputField.value = "";
  } else {
    const todoStructure = todoObjectStructure(taskValue);
    const currentTasks = getLocalStorageData();
    currentTasks.push(todoStructure);
    addToUi(todoStructure);
    addLocalStorage(currentTasks);
    inputField.value = "";
  }
});

const uiLoad = () => {
  const storageData = getLocalStorageData();

  storageData.map((data) => {
    addToUi(data);
  });
};

uiLoad();

const todoObjectStructure = (value) => {
  return {
    id: Date.now(),
    value: value,
  };
};
