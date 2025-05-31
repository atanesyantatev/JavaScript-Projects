const dbName = "ДатаБаза";
let db;
let currentPage = 1;
const patientPerPage = 5;

let request = indexedDB.open(dbName, 3);

request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('пациенты')) {
        let store = db.createObjectStore('пациенты', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('date', 'date', { unique: false });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    loadPatients();
};


function displayPatients(patients) {
    let list = document.getElementById('patient-list');
    list.innerHTML = "";

    let startIndex = (currentPage - 1) * patientPerPage;
    let endIndex = startIndex + patientPerPage;
    let patientsToShow = patients.slice(startIndex, endIndex);

    patientsToShow.forEach(patient => {
        const li = document.createElement('li');
        li.className = 'patient-card';
        li.innerHTML = `
        <div class="patient-info">
          <span>${patient.name}</span>
          <span>${patient.date}</span>
          <span>${patient.diagnosis}</span>
        </div>

          <div class="patient-actions">
            <button class="edit-btn" data-id="${patient.id}">Edit</button>
            <button class="delete-btn" data-id="${patient.id}">Delete</button>
        </div>
        `
        list.append(li);
    });

    list.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            let id = parseInt(e.target.getAttribute('data-id'));
            editPatient(id)
        }


        if (e.target.classList.contains('delete-btn')) {
            let id = parseInt(e.target.getAttribute('data-id'));
            deletePatient(id)
        }
    })


};

let editMode = false;
let currentPatientId = null


function editPatient(id) {
    let transaction = db.transaction(['пациенты'], 'readonly');
    let store = transaction.objectStore('пациенты');
    let request = store.get(id);

    request.onsuccess = (e) => {
        let patient = e.target.result;

        document.getElementById('name').value = patient.name;
        document.getElementById('date').value = patient.date;
        document.getElementById('diagnosis').value = patient.diagnosis;
        editMode = true;
        currentPatientId = id;

        document.querySelector('#patient-form button').textContent = 'Update';
    };

    request.onerror = (e) => {
        console.error('Error in editing patient data', e.target.error)
    }
};


function deletePatient(id) {
    let transaction = db.transaction(['пациенты'], 'readwrite');
    let store = transaction.objectStore('пациенты');
    let request = store.delete(id);

    request.onsuccess = () => {
        console.log('The patient has successfully been deleted.');
        loadPatients();

    }

    request.onerror = (e) => {
        console.error('Error in deleting', e.target.error);

    }
};


function setupPagination(patients) {
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = "";

    let totalPages = Math.ceil(patients.length / patientPerPage);

    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement('button');
        button.className = 'peg-btn';
        button.textContent = i;
        button.addEventListener('click', function () {
            currentPage = i;
            displayPatients(patients);
        })

        pagination.appendChild(button);


    }
};


function loadPatients() {
    const list = document.getElementById('patient-list');
    list.innerHTML = "";

    let transaction = db.transaction(['пациенты'], 'readonly');
    let store = transaction.objectStore('пациенты');
    let request = store.openCursor();

    let allPatients = [];

    request.onsuccess = (e) => {
        let cursor = e.target.result;

        if (cursor) {
            allPatients.push(cursor.value);
            cursor.continue();
        } else {
            filterAndSearchPatients(allPatients)
        }


    }
};


document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let date = document.getElementById('date').value;
    let diagnosis = document.getElementById('diagnosis').value;

    let transaction = db.transaction(['пациенты'], 'readwrite');
    let store = transaction.objectStore('пациенты');


    if (editMode) {
        let editPatient = { id: currentPatientId, name, date, diagnosis };
        store.put(editPatient);

        transaction.oncomplete = () => {
            loadPatients();
            document.getElementById('patient-form').reset();
            editMode = false;
            currentPatientId = null;
            document.querySelector('#patient-form button').textContent = 'Register';
        }
    } else {
        let newPatient = { name, date, diagnosis };
        store.add(newPatient);

        transaction.oncomplete = () => {
            loadPatients();
            document.getElementById('patient-form').reset();

        }
    }
});


function filterAndSearchPatients(allPatients) {
    let list = document.getElementById('patient-list');
    list.innerHTML = "";
    let searchText = document.getElementById('search').value.toLowerCase();
    let filterValue = document.getElementById('filter').value;



    let today = new Date().toISOString().split('T')[0];

    let startOfWeek = new Date();
    let dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    let startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    let filteredPatients = allPatients.filter(patient => {
        let name = patient.name.toLowerCase();
        let diagnosis = patient.diagnosis.toLowerCase();
        let date = patient.date.trim();

        let formattedDate = new Date(date).toISOString().split('T')[0];


        let matchesSearch = name.includes(searchText) || diagnosis.includes(searchText);

        let matchesFilterValue = filterValue === 'all' ||
            (filterValue === 'today' && formattedDate === today) ||
            (filterValue === 'week' && formattedDate >= startOfWeekStr && formattedDate <= today);

        return matchesFilterValue && matchesSearch;
    });

    displayPatients(filteredPatients);
    setupPagination(filteredPatients)

};




document.getElementById('search').addEventListener('change', function () {
    loadPatients();
});


document.getElementById('filter').addEventListener('change', function () {
    loadPatients();
});






// | ФИО                | Диагноз           |  
// |--------------------|------------------|  
// | Иван Петров       | Грипп            |  
// | Анна Смирнова     | Аллергия         |  
// | Сергей Кузнецов   | Гипертония       |  
// | Мария Иванова     | Диабет           |  
// | Алексей Сидоров   | ОРВИ             |  
// | Ольга Васильева   | Астма            |  
// | Дмитрий Фролов    | Язва желудка     |  
// | Екатерина Морозова| Бронхит          |  
// | Николай Ковалев   | Остеохондроз     |  
// | Татьяна Беляева   | Пневмония        |  


let or = new Date().toString();
console.log(or);

