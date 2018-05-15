window.onload = function() {

  document.getElementById('save_note').onclick = function() {
      var value = document.getElementById('notes').value;


      chrome.storage.sync.set({'myLine': value});
    };

      chrome.storage.sync.get('myLine', function(data) {
        document.getElementById("notes").innerHTML = data.myLine;
      });

  chrome.storage.sync.get('storageArr', function(data) {
    for (var i = 0, len = data.storageArr.length; i < len; i++) {
      if (typeof data.storageArr[i] == "string") {
        addTask(data.storageArr[i]);
      };
    };
  });

};

document.getElementById('delete_note').onclick = function() {
        document.getElementById("saveLine").innerHTML = ""
}



var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

var storageArr = [];

var createNewTaskElement = function(taskString) {
  var listItem = document.createElement("li");
  var checkBox = document.createElement("input");
  var label = document.createElement("label");
  var editInput = document.createElement("input");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";

  label.innerText = taskString;
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

var addTask = function(taskInput) {
  var listItem = createNewTaskElement(taskInput);
  storageArr.push(taskInput);
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput = "";
  chrome.storage.sync.set({'storageArr': storageArr});

}

// Edit an existing task
var editTask = function() {
  var listItem = this.parentNode;

  var editInput = listItem.querySelector("input[type=text]");
  var label = listItem.querySelector("label");
  var containsClass = listItem.classList.contains("editMode");
  itemRemove = listItem.querySelector('label').innerHTML;
  storageArr = storageArr.filter(function(item) {
    return item !== itemRemove;
  });
  console.log(label);


    //if the class of the parent is .editMode
  if(containsClass) {
      //switch from .editMode
      //Make label text become the input's value
    label.innerText = editInput.value;
  } else {
      //Switch to .editMode
      //input value becomes the label's text
    editInput.value = label.innerText;
  }

    // Toggle .editMode on the parent
  listItem.classList.toggle("editMode");

  storageArr.push(label.innerText);
  chrome.storage.sync.set({'storageArr': storageArr});

}


// Delete an existing task
var deleteTask = function() {
  console.log("Delete task...");
  var listItem = this.parentNode;
  itemRemove = listItem.querySelector('label').innerHTML;
  storageArr = storageArr.filter(function(item) {
    return item !== itemRemove;
  })
  chrome.storage.sync.set({'storageArr': storageArr});
  //Remove the parent list item from the ul
  var ul = listItem.parentNode;
  ul.removeChild(listItem);

}

// Mark a task as complete
var taskCompleted = function() {
  //Append the task list item to the #completed-tasks

  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
  itemRemove = listItem.querySelector('label').innerHTML;
  storageArr = storageArr.filter(function(item) {
    return item !== itemRemove;
  })
  chrome.storage.sync.set({'storageArr': storageArr});
}

// Mark a task as incomplete
var taskIncomplete = function() {
  // When checkbox is unchecked
  // Append the task list item #incomplete-tasks
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  itemAdd = listItem.querySelector('label').innerHTML;
  storageArr.push(itemAdd);
  chrome.storage.sync.set({'storageArr': storageArr});
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  //select taskListItem's children
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");

  //bind editTask to edit button
  editButton.onclick = editTask;

  //bind deleteTask to delete button
  deleteButton.onclick = deleteTask;

  //bind checkBoxEventHandler to checkbox
  checkBox.onchange = checkBoxEventHandler;
}

// Set the click handler to the addTask function
//addButton.onclick = addTask;
addButton.addEventListener("click", function(e) {
  var taskInput = document.getElementById("new-task");
  addTask(taskInput.value);
  taskInput.value = "";
});

// Cycle over the incompleteTaskHolder ul list items
for(var i = 0; i <  incompleteTasksHolder.children.length; i++) {
    // bind events to list item's children (taskCompleted)
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}
// Cycle over the completeTaskHolder ul list items
for(var i = 0; i <  completedTasksHolder.children.length; i++) {
    // bind events to list item's children (taskIncompleted)
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);

}
