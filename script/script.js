let users = [];

const table = document.querySelector("table");
const tbody = document.querySelector("tbody");
const bigBtn = document.querySelector(".big-btn");
const smallBtn = document.querySelector(".small-btn");
const searchBtn = document.querySelector(".search-btn");
const pagination = document.querySelector(".pagination__list");

const smallData =
  "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}";
const bigData =
  "http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}";

const CONFIG = {
  rowsCount: 50,
  activePage: 1,
};

const sortTypes = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
};

const imageUrl = {
  Up: "img/up.svg",
  Down: "img/down.svg",
};

const toggleLoading = () =>
  document.querySelector(".loading").classList.toggle("hidden");

const getUsers = async (url) => {
  const response = await fetch(url);

  return await response.json();
};

const createSubRow = (row, item) => {
  row.insertAdjacentHTML(
    "afterEnd",
    `
    <tr class="subrow">
      <td colspan="5">
        Описание: <br>
        <textarea>${item.description}</textarea><br>
        Адрес проживания: <b>${item.adress.streetAddress}</b><br>
        Город: <b>${item.adress.city}</b><br>
        Провинция/штат: <b>${item.adress.state}</b><br>
        Индекс: <b>${item.adress.zip}</b>
      </td>
    </tr>`
  );
};

const createRow = (item) => {
  const row = document.createElement("tr");
  row.classList.add("mainrow");

  row.innerHTML = `
    <td>${item.id}</td>
    <td>${item.firstName}</td>
    <td>${item.lastName}</td>
    <td>${item.email}</td>
    <td>${item.phone}</td>
  `;

  row.onclick = () => {
    const nextRow = row.nextElementSibling;

    if (nextRow && nextRow.classList.contains("subrow")) {
      row.nextElementSibling.remove();
    } else {
      createSubRow(row, item);
    }
  };

  tbody.appendChild(row);
};

const renderSelectedPage = (pageNumber, data = users) => {
  tbody.innerHTML = "";

  if (document.querySelector(".active")) {
    document.querySelector(".active").classList.remove("active");
  }

  if (data.length) {
    pageNumber.classList.add("active");
    let currentPage = pageNumber.innerHTML;
    let start = (currentPage - 1) * CONFIG.rowsCount;
    let end = start + CONFIG.rowsCount;
    let rows = data.slice(start, end);
    rows.forEach((row) => createRow(row));
  }
};

const createTableContent = (data = users) => {
  pagination.innerHTML = " ";
  let countOfPages = Math.ceil(data.length / CONFIG.rowsCount);
  let pageNumbers = [];
  let activeItem = null;

  for (let i = 1; i <= countOfPages; i++) {
    const pageNumber = document.createElement("li");
    pageNumber.innerHTML = i;
    pageNumber.onclick = () => renderSelectedPage(pageNumber, data);

    pagination.appendChild(pageNumber);
    pageNumbers.push(pageNumber);

    if (i === CONFIG.activePage) {
      activeItem = pageNumber;
    }
  }
  renderSelectedPage(activeItem || pageNumbers[0], data);
};

const createTable = (url) => {
  toggleLoading();
  getUsers(url)
    .then((response) => {
      users = response;
      createTableContent();
    })
    .finally(toggleLoading);
};

const sortBy = (type, name) => {
  let sort = null;

  if (type === "string") {
    sort = users.sort((a, b) => {
      if (sortTypes[name]) {
        return a[name].toUpperCase() > b[name].toUpperCase() ? 1 : -1;
      } else {
        return a[name].toUpperCase() < b[name].toUpperCase() ? 1 : -1;
      }
    });
  }

  sort = users.sort((a, b) => {
    if (sortTypes[name]) {
      return a[name] > b[name] ? 1 : -1;
    } else {
      return a[name] < b[name] ? 1 : -1;
    }
  });

  const arrows = [...document.querySelectorAll("img")];
  const imageArrow = arrows.find((item) => item.dataset.name === name);
  imageArrow.attributes.src.nodeValue = sortTypes[name]
    ? imageUrl.Up
    : imageUrl.Down;

  sortTypes[name] = !sortTypes[name];

  return sort;
};

const sortTable = (type, name) => {
  let usersSort;
  if (tbody.innerHTML === "") {
    alert("Пожалуйста. выберите базу");
  } else {
    usersSort = sortBy(type, name);
  }
  createTableContent(usersSort);
};

const filterTable = () => {
  const searchInput = document.querySelector(".search");
  const inputValue = searchInput.value.toUpperCase();

  const usersFilter = users.filter((obj) => {
    let flag = false;
    Object.values(obj).forEach((value) => {
      if (value.toString().toUpperCase().indexOf(inputValue) > -1) {
        flag = true;
        return;
      }
    });
    if (flag) return obj;
  });

  if (usersFilter.length === 0) {
    alert("Совпадений не найдено");
  }

  createTableContent(usersFilter);
};

smallBtn.addEventListener("click", () => {
  try {
    createTable(smallData);
  } catch (error) {
    alert("фыоафоыофпо");
  }

  searchBtn.disabled = false;
});

bigBtn.addEventListener("click", () => {
  createTable(bigData);
  searchBtn.disabled = false;
});

searchBtn.addEventListener("click", () => {
  filterTable();
});

table.addEventListener("click", (evt) => {
  const target = evt.target;
  const { type, name } = target.dataset;
  if (target.nodeName === "TH") {
    sortTable(type, name);
  }
});
