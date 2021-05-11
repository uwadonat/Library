const addForm = document.querySelector('.add');
const list = document.querySelector('.books');
const search = document.querySelector('.search input');
const newBook = document.querySelector('.newbook');
const hideForm = document.querySelector('.hideform');

class Book {
  constructor(book) {
    this.title = book.title;
    this.author = book.author;
    this.pages = book.pages;
    this.read = book.read;
  }

  toggleRead() {
    this.read = !this.read;
  }
}

let books = [];
const storedBooks = localStorage.getItem('books');

if (storedBooks) {
  books = JSON.parse(storedBooks).map((book) => new Book(book));
}

function addBookToLibrary(book) {
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
}

function displayBooks() {
  list.innerHTML = books.map(
    (book, i) => `
    <div class="list-group-item">
      <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1 title"><small>Title: </small><br>${book.title}</h5>
      <small class="pages">#pages: (${book.pages})</small>
      </div>
      <p class="mb-1 author"><small>Author: </small><br>${book.author}</p>
      <small class="status" data-index="${i}">${book.read ? 'Read' : 'To Read'}</small>
      <small class="float-end remove" data-index="${i}">Remove</small>
    </div>
    `,
  );
}

function addBook(e) {
  e.preventDefault();
  const book = new Book({
    title: addForm.title.value.trim(),
    author: addForm.author.value.trim(),
    pages: addForm.pages.value.trim(),
    read: addForm.read.checked,
  });

  addBookToLibrary(book);
  addForm.reset();
  displayBooks();
}

function removeBook(e) {
  if (!e.target.matches('.remove')) return;
  books.splice(e.target.dataset.index, 1);
  localStorage.setItem('books', JSON.stringify(books));
  displayBooks();
}
function toggleRead(e) {
  if (!e.target.matches('.status')) return;
  const idx = e.target.dataset.index;
  books[idx].toggleRead();
  localStorage.setItem('books', JSON.stringify(books));
  displayBooks();
}
const filterBooks = (term) => {
  Array.from(list.children)
    .filter((book) => !book.textContent.includes(term))
    .forEach((book) => book.classList.add('d-none'));

  Array.from(list.children)
    .filter((book) => book.textContent.includes(term))
    .forEach((book) => book.classList.remove('d-none'));
};

search.addEventListener('keyup', () => {
  const term = search.value.trim();
  filterBooks(term);
});

newBook.addEventListener('click', () => {
  addForm.classList.remove('d-none');
});

hideForm.addEventListener('click', () => {
  addForm.classList.add('d-none');
});

list.addEventListener('click', removeBook);

list.addEventListener('click', toggleRead);

addForm.addEventListener('submit', addBook);

displayBooks();
