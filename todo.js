//tasks array

const tasks = [];
retrive();

//either click Add or enter button
existingTasks();
taskCount();
hidClear();

//add
document.getElementById("add-btn").addEventListener("click", addTask, false);
document.getElementById("todo-input").addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  },
  false,
);
//adding the task to li
function addTask() {
  const input = document.getElementById("todo-input").value;
  if (input.trim() === "") {
    alert("please enter a task");
  } else {
    let todoList = document.getElementById("todo-list");
    let li = document.createElement("li");
    let sid = Date.now();
    li.id = "li" + sid;
    li.innerHTML =
      '<span class="task-text">' +
      input +
      '</span><input class="tasks" type="checkbox" value="completed"/><input class="remove-btn" type="submit" value="Remove"/>';
    todoList.append(li);
    tasks.push({ name: input, taskId: li.id, completed: false });
    taskCount();
    saveTasks();
    hidClear();
  }
}

// removing or completing
document.getElementById("todo-list").addEventListener(
  "click",
  (e) => {
    if (e.target.type === "checkbox") {
      let p = e.target.parentNode;
      if (e.target.checked) {
        p.querySelector(".task-text").style.textDecoration = "line-through";
        p.querySelector(".task-text").style.color = "#712216";

        updateCom(p.id, true);
        taskCount();
        disClear(1);
        saveTasks();
      } else {
        p.querySelector(".task-text").style.textDecoration = "none";
        p.querySelector(".task-text").style.color = "";

        updateCom(p.id, false);
        taskCount();
        saveTasks();
      }
      hidClear();
    } else if (e.target.value === "Remove") {
      let p = e.target.parentNode;
      if (e.target.previousSibling.checked == false) {
        updateCom(p.id, true, false);
        p.remove();
        taskCount();
        saveTasks();
      } else {
        updateCom(p.id, true, false);
        p.remove();
        taskCount();
        saveTasks();
      }
      hidClear();
    }
  },
  false,
);

//to display how many tasks are remainning
function taskCount() {
  let p = document.getElementById("count");
  let incompleteTasks = tasks.filter((t) => {
    return t.completed === false;
  }).length;
  if (incompleteTasks < 1) {
    p.innerHTML = "Add new Tasks!";
    p.style.color = "#F7F4D5";
  } else {
    let text;
    if (incompleteTasks == 1) {
      text = " task remaining";
    } else {
      text = " tasks remaining";
    }
    p.innerHTML = incompleteTasks + text;
    p.style.color = "#0A3323";
  }
}

//displays the clear button
function disClear(b) {
  let clear = document.getElementById("clear");
  if (b == 1) {
    //clear completed button displayed
    clear.style.display = "block";
  } else {
    //clear completed button hidden
    clear.style.display = "none";
  }
}

//clear button display
function hidClear() {
  let buttons = document.querySelectorAll("input.tasks");
  let c = 0;
  buttons.forEach((i) => {
    if (i.checked) {
      c++;
    }
  });
  if (c == 0) {
    disClear(0);
  } else {
    disClear(1);
  }
}

//Checking all completed tasks and removed
document.getElementById("clear-btn").addEventListener(
  "click",
  (e) => {
    let li = document.querySelectorAll("li");
    li.forEach((i) => {
      if (i.querySelector(".tasks").checked) {
        i.remove();
        updateCom(i.id, true, false);
        saveTasks();
      }
    });
    taskCount();
    hidClear();
  },
  false,
);

// TAsk completed or removed is updated in array
function updateCom(xId, tf, exists = true) {
  tasks.forEach((i, index) => {
    if (i.taskId == xId) {
      i.completed = tf;
      if (exists === false) {
        tasks.splice(index, 1);
      }
    }
  });
}

// saving array to local storage ( called on every single update in array)

function saveTasks() {
  let taskString = JSON.stringify(tasks);
  localStorage.setItem("task", taskString);
}

//Retrive from local storage

function retrive() {
  let retrivedList = localStorage.getItem("task");
  let retrivedArr = JSON.parse(retrivedList);
  if (retrivedArr) {
    retrivedArr.forEach((i) => {
      tasks.push(i);
    });
  }
}

function existingTasks() {
  let todoList = document.getElementById("todo-list");

  tasks.forEach((i) => {
    let li = document.createElement("li");
    li.id = i.taskId;

    li.innerHTML =
      '<span class="task-text">' +
      i.name +
      '</span><input class="tasks" type="checkbox" value="completed"/><input class="remove-btn" type="submit" value="Remove"/>';

    if (i.completed === true) {
      li.querySelector(".tasks").checked = true;
      li.querySelector(".task-text").style.textDecoration = "line-through";
      li.querySelector(".task-text").style.color = "#712216";
    } else {
      li.querySelector(".tasks").checked = false;
      li.querySelector(".task-text").style.textDecoration = "none";
      li.querySelector(".task-text").style.color = "";
    }

    todoList.append(li);
  });

  // Calculate count AFTER all tasks have been loaded onto the page
  taskCount();
  hidClear();
}
