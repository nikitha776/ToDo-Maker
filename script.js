let saveBtn = document.querySelector("#saveBtn");
let title = document.querySelector("#title");
let description = document.querySelector("#description");
let form = document.querySelector("form");
let date = document.querySelector("#date");
let taskContainer = document.querySelector("#taskContainer");
let board = document.querySelector(".board");
let saveChange = document.querySelector("#saveChange");
let starred = document.querySelector(".starred");
let pending = document.querySelector(".pending");
let completed = document.querySelector(".completed");
let errorMsg = document.querySelector(".errorMsg");
let errorTimeout;

let currTask = null;
let count = 0;
let pendingCount = 0;

board.innerText = "Pending : " + pendingCount;
saveChange.disabled = true;

saveBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (title.value === "" || description.value === "" || date.value === "") {
        showError("Please fill in all the fields.");
        return;
    }
    if (findDuplicate()) {
        showError("Title must be unique.");
        return;
    }
    errorMsg.style.display = "none";
    count++;
    pendingCount++;
    board.innerText = "Pending : " + pendingCount;
    createTask();
    resetForm();
});

saveChange.addEventListener("click", (evt) => {
    evt.preventDefault();

    if (title.value === "" || description.value === "" || date.value === "") {
        showError("Please fill in all the fields.");
        return;
    }
    if (findDuplicate(currTask)) {
        showError("Title must be unique.");
        return;
    }

    let div1 = currTask.querySelector(".one");
    let div2 = currTask.querySelector(".two");
    let div3 = currTask.querySelector(".three");
    let msg = currTask.querySelector(".msg");

    if (div1.value !== title.value || div2.value !== description.value || div3.value !== date.value) {
        msg.style.display = "inline";
    } else {
        if(msg.style.display != "inline")
            msg.style.display = "none";
    }

    div1.value = title.value;
    div2.value = description.value;
    div3.value = date.value;

    errorMsg.style.display = "none";
    saveChange.disabled = true;
    saveBtn.disabled = false;
    currTask.style.border = "lightGray solid 1px";

    resetForm();
});

function resetForm() {
    title.value = "";
    description.value = "";
    date.value = "";
}

function createTask() {
    let delBtn = document.createElement("button");
    delBtn.setAttribute("class", "delBtn");
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    let editBtn = document.createElement("button");
    editBtn.setAttribute("class", "editBtn");
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.setAttribute("class", "checkbox");

    let star = document.createElement("i");
    star.classList.add("fa-solid", "fa-star", "star");

    let msg = document.createElement("div");
    msg.setAttribute("class", "msg");
    msg.innerText = "Edited";
    msg.style.display = "none";

    let task = document.createElement("div");
    task.setAttribute("class", "task");

    let divo = document.createElement("div");
    divo.setAttribute("class", "combine");
    let divt = document.createElement("div");

    let div1 = document.createElement("input");
    div1.setAttribute("class", "one");
    div1.type = "text";
    div1.value = title.value;

    let div2 = document.createElement("input");
    div2.setAttribute("class", "two");
    div2.type = "text";
    div2.value = description.value;

    let div3 = document.createElement("input");
    div3.setAttribute("class", "three");
    div3.type = "text";
    div3.value = date.value;

    divt.append(msg);
    divt.prepend(delBtn);
    divt.prepend(editBtn);
    divt.prepend(star);
    divt.prepend(div3);

    divo.append(checkBox);
    divo.append(div1);

    task.append(divo);
    task.append(div2);
    task.append(divt);

    div1.disabled = true;
    div2.disabled = true;
    div3.disabled = true;
    pending.appendChild(task);

    star.addEventListener("click", () => {
        if (star.classList.contains("marked") && !checkBox.checked) {
            star.classList.remove("marked");
            pending.appendChild(task);
        } else {
            star.classList.add("marked");
            starred.appendChild(task);
        }
    });

    editBtn.addEventListener("click", (evt) => {
        title.value = div1.value;
        description.value = div2.value;
        date.value = div3.value;
        currTask = task;
        saveChange.disabled = false;
        saveBtn.disabled = true;
        task.style.border = "black solid 1px";
    });

    delBtn.addEventListener("click", (evt) => {
        if (!checkBox.checked) pendingCount--;
        count--;
        if (checkBox.checked) {
            completed.removeChild(task);
        } else if (star.classList.contains("marked")) {
            starred.removeChild(task);
        } else {
            pending.removeChild(task);
        }
        board.innerText = "Pending : " + pendingCount;
    });

    checkBox.addEventListener("click", (evt) => {
        if (checkBox.checked) {
            pendingCount--;
            completed.appendChild(task);
            task.style.backgroundColor = "#E4E5F2";
            div1.style.backgroundColor = "#E4E5F2";
            editBtn.disabled = true;
        } else {
            if (star.classList.contains("marked")) {
                starred.appendChild(task);
            } else {
                pending.appendChild(task);
            }
            pendingCount++;
            board.innerText = "Pending : " + pendingCount;
            task.style.backgroundColor = "#fff";
            div1.style.backgroundColor = "#fff";
            editBtn.disabled = false;
        }
        board.innerText = "Pending : " + pendingCount;
    });
}

function findDuplicate(excludeTask = null) {
    let tasks = document.querySelectorAll(".task .one");
    for (let task of tasks) {
        if (task.value === title.value && task.parentElement.parentElement !== excludeTask) {
            return true;
        }
    }
    return false;
}

function showError(message) {
    errorMsg.innerText = message;
    errorMsg.style.display = "block";
    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
        errorMsg.style.display = "none";
    }, 3000);
}


