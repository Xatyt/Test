let users;
let sortById = true;
let sortFirst = true;
let sortSecond = true;
let sortEmail = true;
let sortPhone = true;

const img = document.querySelectorAll('img');
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const bigBtn = document.querySelector('.big-btn');
const smallBtn = document.querySelector('.small-btn');
const searchBtn = document.querySelector('.search-btn');
const div = document.querySelector('.countener__loading');
const pagination = document.querySelector('.pagination__list');

const smallData = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
const bigData = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';

const image = {
  urlUp : 'img/up.svg',
  urlDown: 'img/down.svg',
};

const getUsers = async (url) => {
  
  div.insertAdjacentHTML('beforeEnd', `
    <img src="img/loader.gif" alt="" class="loading">
  `)

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка. Статус ошибки ${response.status}`);
  }

  return await response.json();
};

const createElem = element => {

  const mainTr = document.createElement('tr');
  mainTr.classList.add('mainstring');

  mainTr.innerHTML = `
    <td>${element.id}</td>
    <td>${element.firstName}</td>
    <td>${element.lastName}</td>
    <td>${element.email}</td>
    <td>${element.phone}</td>
  `;

  tbody.appendChild(mainTr);

  mainTr.addEventListener('click', evt => {
    
    const tr = evt.target.closest('tr');
    const next = tr.nextElementSibling.classList.contains('substring');
    
    if (!tr) return;
    if (!table.contains(tr)) return;

    if(next) {
      tr.nextElementSibling.remove();
    } else {
      tr.insertAdjacentHTML("afterEnd", `
      <tr class="substring">
        <td colspan="5">
          Описание: <br>
          <textarea>${element.description}</textarea><br>
          Адрес проживания: <b>${element.adress.streetAddress}</b><br>
          Город: <b>${element.adress.city}</b><br>
          Провинция/штат: <b>${element.adress.state}</b><br>
          Индекс: <b>${element.adress.zip}</b>
        </td>
      </tr>`);
    }
  })
};

const createPagination = data => {
  
  pagination.innerHTML = ' ';
  let active;
  let notesOnPage = 50;
  let countOfItems = Math.ceil(data.length / notesOnPage);
  let items = [];

  for (let i = 1; i <= countOfItems; i++) {
    const li = document.createElement('li');
    li.innerHTML = i;
    pagination.appendChild(li);
    items.push(li);
  }

  const activePage = item => {

    tbody.innerHTML = '';

    if (active) {
      active.classList.remove('active');
    }
    
    active = item;
    item.classList.add('active');

    let pageNum = +item.innerHTML;
    let start = (pageNum - 1) * notesOnPage;
    let end = start + notesOnPage;
    let notes = data.slice(start, end);

    notes.forEach(element => createElem(element));
  };

  activePage(items[0]);

  items.forEach(item => {
    item.addEventListener('click', () => {
      activePage(item);
    })
  })
};

const createTable = url => {
  getUsers(url)
  .then(response => { 
    div.innerHTML = '';
    users = response;
    createPagination(users);
})};

const sortTable = column => {
  
  let usersSort;
  if (tbody.innerHTML === '') {
    alert('Пожалуйста. выберите базу');
    return;
  }

  switch(column) {
    case 0:
      usersSort = users.sort((a,b) => {
        if (sortById) {
          img[column].attributes.src.nodeValue = image.urlUp;
          return a.id > b.id ? 1 : -1;
        } else {
          img[column].attributes.src.nodeValue = image.urlDown;
          return a.id < b.id ? 1 : -1;
        }
      });
      sortById = !sortById;
      break;
    case 1: 
      usersSort = users.sort((a,b) => {
        if (sortFirst) {
          img[column].attributes.src.nodeValue = image.urlUp;
          return a.firstName.toUpperCase() > b.firstName.toUpperCase() ? 1 : -1;
        } else {
          img[column].attributes.src.nodeValue = image.urlDown;
          return a.firstName.toUpperCase() < b.firstName.toUpperCase() ? 1 : -1;
        }
      });
      sortFirst = !sortFirst;
      break;
    case 2:
      usersSort = users.sort((a,b) => {
        if (sortSecond) {
          img[column].attributes.src.nodeValue = image.urlUp;
          return a.lastName.toUpperCase() > b.lastName.toUpperCase() ? 1 : -1;
        } else {
          img[column].attributes.src.nodeValue = image.urlDown;
          return a.lastName.toUpperCase() < b.lastName.toUpperCase() ? 1 : -1;
        }
      });
      sortSecond = !sortSecond;
      break;
    case 3:
      usersSort = users.sort((a,b) => {
        if (sortEmail) {
          img[column].attributes.src.nodeValue = image.urlUp;
          return a.email.toUpperCase() > b.email.toUpperCase() ? 1 : -1;
        } else {
          img[column].attributes.src.nodeValue = image.urlDown;
          return a.email.toUpperCase() < b.email.toUpperCase() ? 1 : -1;
        }
      });
      sortEmail = !sortEmail;
      break;
    case 4:
      usersSort = users.sort((a,b) => {
        if (sortPhone) {
          img[column].attributes.src.nodeValue = image.urlUp;
          return a.phone > b.phone ? 1 : -1;
        } else {
          img[column].attributes.src.nodeValue = image.urlDown;
          return a.phone < b.phone ? 1 : -1;
        }
      });
      sortPhone = !sortPhone;
      break;
  }

  createPagination(usersSort);
};

smallBtn.addEventListener('click', () => {
  createTable(smallData);
  searchBtn.disabled = false;
});

bigBtn.addEventListener('click', () => {
  createTable(bigData);
  searchBtn.disabled = false;
});

searchBtn.addEventListener('click', () => {
  const searchInput = document.querySelector('.search');
  const filter = searchInput.value.toUpperCase();
  
  const usersFilter = users.filter(obj => {

    let flag = false;
    Object.values(obj).forEach(val => {
      if (val.toString().toUpperCase().indexOf(filter) > -1) {
        flag = true;
        return;
      }
    });

    if (flag) return obj;

  });

  createPagination(usersFilter);
});

table.addEventListener('click', evt => {
  const target = evt.target;
  const column = target.cellIndex;

  if (target.nodeName !== 'TH') return;

  sortTable(column);
});