const book = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK-APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const titleBook = document.getElementById("title").value;
  const authorBook = document.getElementById("name").value;
  const yearRelease = document.getElementById("inputBookYear").value;
  const readedBook = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generatedId();
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    authorBook,
    yearRelease,
    readedBook,
    false
  );
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generatedId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(book);
});

function makeList(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerHTML = "Judul Buku : " + bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerHTML = "Penulis : " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerHTML = "Tahun Rilis : " + bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book-data");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    const readAgainButton = document.createElement("button");
    readAgainButton.classList.add("readagain-button");

    readAgainButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    container.append(deleteButton, readAgainButton);
  } else {
    const doneButton = document.createElement("button");
    doneButton.classList.add("done-button");

    doneButton.addEventListener("click", function () {
      addReadToCompleted(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    container.append(doneButton, deleteButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedReadList = document.getElementById("book");
  uncompletedReadList.innerHTML = "";

  const completedReadList = document.getElementById("completed-book");
  completedReadList.innerHTML = "";

  for (const readItem of book) {
    const bookElement = makeList(readItem);
    if (!readItem.isCompleted) uncompletedReadList.append(bookElement);
    else completedReadList.append(bookElement);
  }
});

function addReadToCompleted(bookId) {
  const readTarget = findRead(bookId);

  if (readTarget == null) return;

  readTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findRead(bookId) {
  for (const readItem of book) {
    if (readItem.id === bookId) {
      return readItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const readTarget = findReadIndex(bookId);

  if (readTarget === -1) return;

  book.splice(readTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const readTarget = findRead(bookId);

  if (readTarget == null) return;

  readTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findReadIndex(bookId) {
  for (const index in book) {
    if (book[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Maaf Browser Kamu Tidak Mendukung Locak Storage");
    return false;
  }
  return true;
}

function myFunction() {
  let toast = document.getElementById("notif");

  document.addEventListener(SAVED_EVENT, function () {
    toast.className = "show";

    setTimeout(function () {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  });
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const books of data) {
      book.push(books);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
