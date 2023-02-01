//read
let currentPage = 1;
let search = "";
let category = "";

async function render() {
  let studentsList = document.querySelector(".students-list");
  let requestAPI = `${STUDENTS_API}?q=${search}&monthKPI=${category}&_page=${currentPage}&_limit=2`;
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


// filtering category 
function filterOnCategory(e) {
  let categoryText = e.target.innerHTML;
  if (categoryText === 'all') {
    category = '';
	} else if(){

	}else {
    category = categoryText;
  };
  render();
};

function addClickEventOnDropdownItem() {
  let categoryItems = document.querySelectorAll('.dropdown-item');
  categoryItems.forEach(item => item.addEventListener('click', filterOnCategory));
};
