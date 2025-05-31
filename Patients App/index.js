const dbName = 'patientsDATABASE';
let db;
let currentPage = 1;
const PatientPerPage = 5;

const request = indexedDB.open(dbName, 3);


request.onupgradeneeded = (e) => {
   const db = e.target.result;
    if (!db.objectStoreNames.contains('patients')) {
        const store = db.createObjectStore('patients', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('date', 'date', { unique: false });
    }

};


request.onsuccess = (e) => {
    db = e.target.result;
    loadPatients();
};


function displayPatients(patients) {
    const list = document.getElementById('patient-list');
    list.innerHTML = "";

    const startIndex = (currentPage - 1) * PatientPerPage;
    const endIndex = startIndex + PatientPerPage;
    const patientsToShow = patients.slice(startIndex, endIndex);

    patientsToShow.forEach(patient => {
        const li = document.createElement('li');
        li.className = 'patient-card';
        li.innerHTML = `
        <div class = "patient-info">
         <span>${patient.name}</span>
         <span>${patient.date}</span>
         <span>${patient.diagnosis}</span>
        </div>
         <div class = "patient-actions">
          <button class = "edit-btn" data-id = "${patient.id}">Edit</button>
          <button class = "delete-btn" data-id = "${patient.id}">Delete</button>
         </div>
        `

        list.appendChild(li)
    });

    list.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'))
            editPatient(id)
        }

        if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'))
            deletePatient(id)
        }


    });


};



function deletePatient(id) {
    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    const request = store.delete(id);

    request.onsuccess = () => {
        console.log('The Patient has successfully deleted.');
        loadPatients();

    }

    request.onerror = (e) => {
        console.error('Error in deleting patient', e.target.result)
    }
};





function setupPagination(patients) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = "";


    const totalPages = Math.ceil(patients.length / PatientPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = 'peg-btn'
        button.textContent = i;
        button.addEventListener('click', function () {
            currentPage = i;
            displayPatients(patients);
        });
        pagination.appendChild(button);
    }
};


let editMode = false;
let currentPatientId = null;


function editPatient(id) {
    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    const request = store.get(id);

    request.onsuccess = (e) => {
        const patient = e.target.result;

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


function loadPatients() {
    const transaction = db.transaction(['patients'], 'readonly');
    const store = transaction.objectStore('patients');
    const request = store.openCursor();

    const allPatients = [];

    request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
            allPatients.push(cursor.value);
            cursor.continue();
        } else {
            filterAndSearchPatients(allPatients)
        }
    }
};


document.getElementById('patient-form').addEventListener('submit', function () {
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const diagnosis = document.getElementById('diagnosis').value;


    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');

    if (editMode) {
        const updatePatient = { id: currentPatientId, name, date, diagnosis };
        store.put(updatePatient);


        transaction.oncomplete = () => {
            loadPatients();
            document.getElementById('patient-form').reset();
            editMode = false;
            currentPatientId = null;
            document.querySelector('#patient-form button').textContent = 'Register';
        }


    } else {
        const newPatient = { name, date, diagnosis };
        store.add(newPatient);

        transaction.oncomplete = () => {
            loadPatients();
            document.getElementById('patient-form').reset();

        }
    }



});




// function filterAndSearchPatients(allPatients) {
//     const searchText = document.getElementById('search').value.toLowerCase();
//     const filterValue = document.getElementById('filter').value;
//     const list = document.getElementById("patient-list");
//     list.innerHTML = ""; 
    

//     const today = new Date().toISOString().split('T')[0];

//     const startOfWeek = new Date();
//     const dayOfWeek = startOfWeek.getDay();
//     startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
//     const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

//     const filterPatients = allPatients.filter(patient => {
//        const name = patient.name.toLowerCase();
//        const diagnosis = patient.diagnosis.toLowerCase();
//         const date = patient.date.trim();

//         const formattedDate = new Date(date).toISOString().split('T')[0];

//         const matchesSearch = name.includes(searchText) || diagnosis.includes(searchText);

//         const matchesFilterValue =
//             filterValue === 'all' ||
//             (filterValue === 'today' && formattedDate === today) ||
//             (filterValue === 'week' && formattedDate >= startOfWeekStr && formattedDate <= today);

   


//         return matchesSearch && matchesFilterValue;


//     });

//     displayPatients(filterPatients);
//     setupPagination(filterPatients);
// };





function filterAndSearchPatients(allPatients) {
    const searchText = document.getElementById("search").value.toLowerCase();
    const filterValue = document.getElementById("filter").value;
    const list = document.getElementById("patient-list");
    list.innerHTML = ""; 

        const today = new Date().toISOString().split("T")[0];

        const startOfWeek = new Date(); 
        const dayOfWeek = startOfWeek.getDay(); 
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); 
        const startOfWeekStr = startOfWeek.toISOString().split("T")[0];

    const filteredPatients = allPatients.filter(patient => {
        const name = patient.name.toLowerCase();
        const diagnosis = patient.diagnosis.toLowerCase();
        const date = patient.date.trim();

      
        const formattedDate = new Date(date).toISOString().split("T")[0];

        const matchesSearch = name.includes(searchText) || diagnosis.includes(searchText);

      
        const matchesFilter =
            filterValue === "all" ||
            (filterValue === "today" && formattedDate === today) ||
            (filterValue === "week" && formattedDate >= startOfWeekStr && formattedDate <= today);

        return matchesSearch && matchesFilter;
    });

    displayPatients(filteredPatients);
    setupPagination(filteredPatients);
}


document.getElementById('search').addEventListener('change', function () {
    loadPatients();  
});

document.getElementById('filter').addEventListener('change', function () {
    loadPatients();  
});








// | #  | Full Name        | Diagnosis          |  
// |----|-----------------|--------------------|  
// | 1  | John Smith      | Hypertension       |  
// | 2  | Emily Johnson   | Diabetes Type 2   |  
// | 3  | Michael Brown   | Asthma            |  
// | 4  | Sarah Davis     | Migraine          |  
// | 5  | Robert Wilson   | Arthritis         |  
// | 6  | Jessica Moore   | Depression        |  
// | 7  | Daniel Taylor   | Pneumonia         |  
// | 8  | Laura Anderson  | Anemia            |  
// | 9  | William Thomas  | GERD              |  
// | 10 | Olivia Martinez | Hypothyroidism    |  




