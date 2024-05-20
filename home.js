// Show timestamp in header
const displayTimestamp = () => {
    let currentTime = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // get date, month, and year
    let day = currentTime.getDate();
    let month = months[currentTime.getMonth()];
    let year = currentTime.getFullYear();

    // get hours and minutes
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let formattedTimestamp = day + " " + month + " " + year + " " + hours + ":" + minutes;

    document.getElementById("timestamp").textContent = formattedTimestamp;
}

displayTimestamp();

setInterval(() => {
    displayTimestamp();
}, 60000);

// Mark task as overdue
const markTaskAsOverdue = (taskId) => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        if (tasks[taskIndex].status !== 3) {
            tasks[taskIndex].status = 3;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

// Add eventlistener to filter dropdown
document.getElementById("filter").addEventListener("change", function () {
    renderTasks(this.value);
});

// Render new tasks
const renderTasks = (filterTask) => {
    let showTasks = document.getElementById("show_tasks");
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    // sort by new date
    tasks.sort((a, b) => new Date(b.taskDate) - new Date(a.taskDate));
    let tasksHTML = "";

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    tasks.forEach((task) => {
        // taskDate
        let taskDateParts = task.taskDate.split('-');
        let taskDay = taskDateParts[2];
        let taskMonth = monthNames[parseInt(taskDateParts[1], 10) - 1];
        let taskYear = taskDateParts[0];
        let formattedTaskDate = `${taskDay} ${taskMonth} ${taskYear}`;

        // dueDate
        let dueDateParts = task.dueDate.split('-');
        let dueDay = dueDateParts[2];
        let dueMonth = monthNames[parseInt(dueDateParts[1], 10) - 1];
        let dueYear = dueDateParts[0];
        let formattedDueDate = `${dueDay} ${dueMonth} ${dueYear}`;

        let getTaskDate = new Date(task.taskDate);
        let getDueDate = new Date(task.dueDate);

        // Today
        let currentDate = new Date();
        let currentDay = currentDate.getDate();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();

        // Compare today with due date
        let currentDateFormatted = `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}-${currentDay < 10 ? '0' : ''}${currentDay}`;
        let isOverdue = task.dueDate < currentDateFormatted;

        if (isOverdue) {
            markTaskAsOverdue(task.id);
        }

        if (filterTask === '0' || !filterTask) {
            // Show all tasks
            tasksHTML += renderTaskHTML(task, formattedTaskDate, formattedDueDate, isOverdue);
        } else if (filterTask === '2' && task.status === 2) {
            // Show tasks with status Done
            tasksHTML += renderTaskHTML(task, formattedTaskDate, formattedDueDate, isOverdue);
        } else if (filterTask === '3' && task.status === 3) {
            // Show tasks with status Overdue
            tasksHTML += renderTaskHTML(task, formattedTaskDate, formattedDueDate, isOverdue);
        }
    });

    showTasks.innerHTML = tasksHTML;

    tasks.forEach((task) => {
        // Mark task as done
        if (task.status == 1) {
            let btnDone = document.getElementById(`btnDone${task.id}`);
            if (btnDone) {
                btnDone.addEventListener('click', () => {
                    markTaskAsDone(task.id);
                });
            }
        }

        //Delete task
        let btnDelete = document.getElementById(`btnDelete${task.id}`);
        if (btnDelete) {
            btnDelete.addEventListener('click', () => {
                deleteTask(task.id);
            });
        }
    });

};

const renderTaskHTML = (task, formattedTaskDate, formattedDueDate, isOverdue) => {
    let taskHTML = '';
    taskHTML += `<div class="card-tasks-${task.priority}" id="${task.id}">
        <div class="wrapper-head-task">
            <div class="task-date">${formattedTaskDate}</div>
            <div class="task-priority-${task.priority}" id="priority">${task.priority}</div>
        </div>
        <div class="task-description ${task.status === 2 ? 'task-done' : ''}">${task.taskDescription}</div>
        <div class="task-due-date ${task.status === 3 && isOverdue ? 'overdate' : ''}">${task.status === 3 && isOverdue ? 'Due date: ' + formattedDueDate + ' (Overdue)' : 'Due date: ' + formattedDueDate}</div>
        <div class="wrapper-action-task">
            ${task.status !== 2 && !(task.status === 3 && isOverdue) ? `<button class="check-task" id="btnDone${task.id}"><i class="ri-check-line" style="font-size: 14pt;"></i></button>` : ''}
            <button class="delete-task" id="btnDelete${task.id}"><i class="ri-delete-bin-line" style="font-size: 14pt;"></i></button>
        </div>
    </div>`;
    return taskHTML;
};
renderTasks();

// Mark task as done
const markTaskAsDone = (taskId) => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].status = 2;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const successMessage = document.getElementById('success');
        const textAlert = document.getElementById('text-alert');
        successMessage.classList.remove('hidden');
        successMessage.style.display = 'block';
        textAlert.textContent = 'Your task are marked as done';

        setTimeout(() => {
            successMessage.classList.add('hidden');
            successMessage.style.display = 'none';
        }, 5000);

        renderTasks();
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

// Delete task
const deleteTask = (taskId) => {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const successMessage = document.getElementById('success');
        const textAlert = document.getElementById('text-alert');
        successMessage.classList.remove('hidden');
        successMessage.style.display = 'block';
        textAlert.textContent = 'Your task are successfully deleted';

        setTimeout(() => {
            successMessage.classList.add('hidden');
            successMessage.style.display = 'none';
        }, 5000);

        renderTasks();
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
};

