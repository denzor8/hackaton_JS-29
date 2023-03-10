let firstNameInp = document.querySelector(".student-first-name");
let lastNameInp = document.querySelector(".student-last-name");
let phoneNumberInp = document.querySelector(".phone-number");
let weeksKpiInp = document.querySelector(".weeks-kpi");
let monthKpiInp = document.querySelector(".month-kpi");
let addStudentBtn = document.querySelector(".add-student-btn");
let closeModalBtn = document.querySelector("#btn-close-modal");
let studentInpImage = document.querySelector('.student-image');
let kpiCategory = document.querySelector('.kpi-category');
// let studentCategory = document.querySelector('#student-category');

let STUDENTS_API = "http://localhost:7000/students";

//create Students
function createStudent() {
  if (
    !firstNameInp.value.trim() ||
    !lastNameInp.value.trim() ||
    !phoneNumberInp.value.trim() ||
    !weeksKpiInp.value.trim() ||
    !monthKpiInp.value.trim() ||
    !studentInpImage.value.trim() ||
    !kpiCategory.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }
  let studentObj = {
    firstName: firstNameInp.value,
    lastName: lastNameInp.value,
    number: phoneNumberInp.value,
    weeksKPI: weeksKpiInp.value,
    monthKPI: monthKpiInp.value,
    image: studentInpImage.value,
    category: kpiCategory.value,
  };
  fetch(STUDENTS_API, {
    method: "POST",
    body: JSON.stringify(studentObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  firstNameInp.value = "";
  lastNameInp.value = "";
  phoneNumberInp.value = "";
  weeksKpiInp.value = "";
  monthKpiInp.value = "";
  studentInpImage.value = '';
  kpiCategory.value = "";

  closeModalBtn.click();
}
addStudentBtn.addEventListener("click", createStudent);

//read
let currentPage = 1;
let search = "";
let category = "";

async function render() {
  let studentsList = document.querySelector(".students-list");
  // let requestAPI = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=3`;
  let requestAPI = `${STUDENTS_API}?q=${search}&category=${category}&_page=${currentPage}&_limit=2`;
  if (!category) {
    requestAPI = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=2`;
  };
  let res = await fetch(requestAPI);
  let data = await res.json();
  studentsList.innerHTML = "";
  data.forEach((item) => {
    studentsList.innerHTML += `
    <div class="card m-3" style="width: 18rem;">
    <img src="${item.image}" class="card-img-top" alt="error" heigth="200">
    <div class="card-body">
      <h5 class="card-title first-last-name-info">${item.firstName} ${item.lastName}</h5>
      <p class="card-text phone-number-info"> Phone number: ${item.number}</p>
      <p class="card-text weeks-kpi-info"> Weeks KPI: ${item.weeksKPI}</p>
      <p class="card-text month-kpi-info"> Month KPI: ${item.monthKPI}</p>
      <p class="card-text kpi-category">KPI: ${item.category}</p>
      <a href="#" class="btn btn-success btn-update" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${item.id}">Update</a>
      <a href="#" class="btn btn-danger btn-delete" id="${item.id}">Delete</a>
    </div>
  </div>
    `;
  });
  if (data.length === 0) return;
  addCategoryToDropdownMenu();
  deleteEventStudent();
  addUpdateEvent();
}
render();

// category logic 
async function addCategoryToDropdownMenu() {
  let res = await fetch(STUDENTS_API);
  let data = await res.json();
  let categories = new Set(data.map(item => item.category));
  let categoriesList = document.querySelector('.dropdown-menu');
  categoriesList.innerHTML = '<li><a class="dropdown-item" href="#">all</a></li>';
  categories.forEach(item => {
    categoriesList.innerHTML += `
        <li><a class="dropdown-item" href="#">${item}</a></li>
        `;
  });
  addClickEventOnDropdownItem();
};

// delete
async function deleteStudent(e) {
  let studentId = e.target.id;
  await fetch(`${STUDENTS_API}/${studentId}`, {
    method: "DELETE",
  });

  render();
}

function deleteEventStudent() {
  let deleteBtns = document.querySelectorAll(".btn-delete");
  deleteBtns.forEach((item) => {
    item.addEventListener("click", deleteStudent);
  });
}

// update
let saveBtn = document.querySelector(".save-changes-btn");

async function addUpdateStudentToForm(e) {
  let studentId = e.target.id;
  let res = await fetch(`${STUDENTS_API}/${studentId}`);
  let studentObj = await res.json();
  firstNameInp.value = studentObj.firstName;
  lastNameInp.value = studentObj.lastName;
  phoneNumberInp.value = studentObj.number;
  weeksKpiInp.value = studentObj.weeksKPI;
  monthKpiInp.value = studentObj.monthKPI;
  studentInpImage.value = studentObj.image;
  kpiCategory.value = studentObj.category;

  saveBtn.setAttribute("id", studentObj.id);
  checkAddAndSaveBtn();
}
// addUpdateStudentToForm();
function checkAddAndSaveBtn() {
  if (saveBtn.id) {
    addStudentBtn.setAttribute("style", "display: none;");
    saveBtn.setAttribute("style", "display: block;");
  } else {
    addStudentBtn.setAttribute("style", "display: block;");
    saveBtn.setAttribute("style", "display: none;");
  }
}
checkAddAndSaveBtn();

async function saveChangesStudent(e) {
  closeModalBtn.setAttribute("style", "display: none !important;");
  let updateStudentObj = {
    id: e.target.id,
    firstName: firstNameInp.value,
    lastName: lastNameInp.value,
    number: phoneNumberInp.value,
    weeksKPI: weeksKpiInp.value,
    monthKPI: monthKpiInp.value,
    image: studentInpImage.value,
    kpiCategory.value = studentObj.category;

  };
  await fetch(`${STUDENTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updateStudentObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  firstNameInp.value = "";
  lastNameInp.value = "";
  phoneNumberInp.value = "";
  weeksKpiInp.value = "";
  monthKpiInp.value = "";
  studentInpImage.value = "";
  kpiCategory.value = "";

  saveBtn.removeAttribute("id");
  render();
  closeModalBtn.click();
}
saveBtn.addEventListener("click", saveChangesStudent);

function addUpdateEvent() {
  let updateBtns = document.querySelectorAll(".btn-update");
  updateBtns.forEach((item) => {
    item.addEventListener("click", addUpdateStudentToForm);
  });
}

closeModalBtn.addEventListener("click", () => {
  addStudentBtn.setAttribute("style", "display: block;");
  saveBtn.setAttribute("style", "display: none;");
  firstNameInp.value = "";
  lastNameInp.value = "";
  phoneNumberInp.value = "";
  weeksKpiInp.value = "";
  monthKpiInp.value = "";
  studentInpImage.value = "";
  kpiCategory.value = "";
});

// filtering category 
function filterOnCategory(e) {
  let categoryText = e.target.innerText;
  if (categoryText === 'all') {
    category = '';
  } else {
    category = categoryText;
  };
  render();
};

function addClickEventOnDropdownItem() {
  let categoryItems = document.querySelectorAll('.dropdown-item');
  categoryItems.forEach(item => item.addEventListener('click', filterOnCategory));
};


//search
// requestAPI = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=3`;
let searchInp = document.querySelector("#search-inp");
// console.log(searchInp);
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});

//pagination
let prevPageBtn = document.querySelector("#prev-page-btn");
let nextPageBtn = document.querySelector("#next-page-btn");

async function showPaginationBtns() {
  if (currentPage == 1) {
    prevPageBtn.style.display = "none";
  } else {
    prevPageBtn.style.display = "block";
  }

  let res = await fetch(STUDENTS_API);
  let data = await res.json();
  let students = data.length;
  let pagesNumber = Math.ceil(students / 2);
  if (currentPage == pagesNumber) {
    nextPageBtn.style.display = "none";
  } else {
    nextPageBtn.style.display = "block";
  }
}
showPaginationBtns();

prevPageBtn.addEventListener("click", () => {
  currentPage--;
  showPaginationBtns();
  render();
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  showPaginationBtns();
  render();
});
