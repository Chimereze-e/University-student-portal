document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.sidebar li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    const classModal = document.getElementById('class-modal');
    const gradeModal = document.getElementById('grade-modal');
    const addClassBtn = document.getElementById('add-class');
    const addGradeBtn = document.getElementById('add-grade');
    const closeButtons = document.querySelectorAll('.close');
    
    addClassBtn.addEventListener('click', () => classModal.style.display = 'block');
    addGradeBtn.addEventListener('click', () => gradeModal.style.display = 'block');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    loadSettings();
    loadClasses();
    loadGrades();
    updateDashboard();
    
    document.getElementById('class-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addClass();
    });
    
    document.getElementById('grade-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addGrade();
    });
    
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-data').addEventListener('click', resetData);
});

function addClass() {
    const courseCode = document.getElementById('course-code').value;
    const courseName = document.getElementById('course-name').value;
    const courseDay = document.getElementById('course-day').value;
    const courseTime = document.getElementById('course-time').value;
    const courseLocation = document.getElementById('course-location').value;
    
    const newClass = {
        code: courseCode,
        name: courseName,
        day: courseDay,
        time: courseTime,
        location: courseLocation
    };
    
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    classes.push(newClass);
    
    localStorage.setItem('classes', JSON.stringify(classes));
    
    loadClasses();
    updateDashboard();
    
    document.getElementById('class-form').reset();
    document.getElementById('class-modal').style.display = 'none';
}

function loadClasses() {
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    const tbody = document.querySelector('#class-schedule tbody');
    
    tbody.innerHTML = '';
    
    classes.forEach((cls, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${cls.code}</td>
            <td>${cls.name}</td>
            <td>${cls.day}</td>
            <td>${cls.time}</td>
            <td>${cls.location}</td>
            <td>
                <button class="delete-class" data-index="${index}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    document.querySelectorAll('.delete-class').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteClass(parseInt(this.getAttribute('data-index')));
        });
    });
}

function deleteClass(index) {
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    classes.splice(index, 1);
    localStorage.setItem('classes', JSON.stringify(classes));
    loadClasses();
    updateDashboard();
}

function addGrade() {
    const course = document.getElementById('grade-course').value;
    const assignment = document.getElementById('grade-assignment').value;
    const score = parseFloat(document.getElementById('grade-score').value);
    const maxScore = parseFloat(document.getElementById('grade-max').value);
    const percentage = (score / maxScore * 100).toFixed(1);
    
    const newGrade = {
        course,
        assignment,
        score,
        maxScore,
        percentage
    };
    
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    grades.push(newGrade);
    
    localStorage.setItem('grades', JSON.stringify(grades));
    
    loadGrades();
    updateDashboard();
    
    document.getElementById('grade-form').reset();
    document.getElementById('grade-modal').style.display = 'none';
}

function loadGrades() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const tbody = document.querySelector('#grade-tracker tbody');
    
    tbody.innerHTML = '';
    
    grades.forEach((grade, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${grade.course}</td>
            <td>${grade.assignment}</td>
            <td>${grade.score}</td>
            <td>${grade.maxScore}</td>
            <td>${grade.percentage}%</td>
            <td>
                <button class="delete-grade" data-index="${index}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    document.querySelectorAll('.delete-grade').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteGrade(parseInt(this.getAttribute('data-index')));
        });
    });
    
    updateGPA();
}

function deleteGrade(index) {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    grades.splice(index, 1);
    localStorage.setItem('grades', JSON.stringify(grades));
    loadGrades();
    updateDashboard();
}

function updateGPA() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    
    if (grades.length === 0) {
        document.getElementById('gpa-result').textContent = 'Current GPA: --';
        return;
    }
    
    const totalPercentage = grades.reduce((sum, grade) => sum + parseFloat(grade.percentage), 0);
    const avgPercentage = totalPercentage / grades.length;
    
    let gpa;
    if (avgPercentage >= 70) gpa = 5.0;
    else if (avgPercentage >= 60) gpa = 4.0;
    else if (avgPercentage >= 50) gpa = 3.0;
    else if (avgPercentage >= 45) gpa = 2.0;
    else if (avgPercentage >= 40) gpa = 1.0;
    else gpa = 0.0;
    
    document.getElementById('gpa-result').textContent = `Current GPA: ${gpa.toFixed(1)}`;
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    
    document.getElementById('student-name').value = settings.name || '';
    document.getElementById('student-id').value = settings.id || '';
    document.getElementById('department').value = settings.department || '';
    document.getElementById('level').value = settings.level || '100';
    
    document.getElementById('username-display').textContent = settings.name || 'Student';
}

function saveSettings() {
    const settings = {
        name: document.getElementById('student-name').value,
        id: document.getElementById('student-id').value,
        department: document.getElementById('department').value,
        level: document.getElementById('level').value
    };
    
    localStorage.setItem('settings', JSON.stringify(settings));
    
    document.getElementById('username-display').textContent = settings.name || 'Student';
    
    alert('Settings saved successfully!');
}

function resetData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        localStorage.clear();
        loadSettings();
        loadClasses();
        loadGrades();
        updateDashboard();
        alert('All data has been reset.');
    }
}

function updateDashboard() {
    updateUpcomingClasses();
    updateRecentGrades();
}

function updateUpcomingClasses() {
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    const upcomingList = document.getElementById('upcoming-classes');
    
    upcomingList.innerHTML = '';
    
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    classes.sort((a, b) => {
        const dayCompare = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
        if (dayCompare !== 0) return dayCompare;
        return a.time.localeCompare(b.time);
    });
    
    const displayCount = Math.min(classes.length, 5);
    for (let i = 0; i < displayCount; i++) {
        const cls = classes[i];
        const item = document.createElement('li');
        item.textContent = `${cls.code} - ${cls.day} ${cls.time}`;
        upcomingList.appendChild(item);
    }
    
    if (classes.length === 0) {
        upcomingList.innerHTML = '<li>No classes added yet</li>';
    }
}

function updateRecentGrades() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const recentList = document.getElementById('recent-grades');
    
    recentList.innerHTML = '';
    
    const displayCount = Math.min(grades.length, 5);
    for (let i = Math.max(0, grades.length - displayCount); i < grades.length; i++) {
        const grade = grades[i];
        const item = document.createElement('li');
        item.textContent = `${grade.course}: ${grade.percentage}%`;
        recentList.appendChild(item);
    }
    
    if (grades.length === 0) {
        recentList.innerHTML = '<li>No grades added yet</li>';
    }
}