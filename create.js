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


// Today input date
const setTodayInput = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    let todayFormatted = yyyy + '-' + mm + '-' + dd;
    document.getElementById('due_date').setAttribute('min', todayFormatted);
}

setTodayInput();

// Add new task action button
document.getElementById('addNewTask').addEventListener("click", () => {
    let dueDate = document.getElementById('due_date').value;
    let taskDescription = document.getElementById('task_description').value;
    let priority = document.getElementById('priority').value;

    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let taskDate = year + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;

    if(dueDate === ''){
        document.getElementById('error_due_date').textContent = 'Due date can not be empty';
    }else{
        document.getElementById('error_due_date').textContent = '';
    }

    if(taskDescription === ''){
        document.getElementById('error_task_description').textContent = 'Task description can not be empty';
    }else{
        document.getElementById('error_task_description').textContent = '';
    }

    if(priority === ''){
        document.getElementById('error_priority').textContent = 'You have to choose a priority.';
    }else{
        document.getElementById('error_priority').textContent = '';
    }
    
    const errorMessage = document.getElementById('error');
    errorMessage.classList.remove('hidden');
    if(dueDate === '' || taskDescription === '' || priority === ''){
        errorMessage.style.display = 'block';

        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
        return;
    }

    const generateRandomId = (length) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let randomId = '';
        for(let i = 0; i < length; i++){
            randomId += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return randomId;
    }

    let newTask = {
        id: generateRandomId(10),
        taskDate: taskDate,
        dueDate: dueDate,
        taskDescription: taskDescription,
        priority: priority,
        status: 1,
    };

    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    window.location.href = 'home.html';
});

