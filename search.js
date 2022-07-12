const filter = document.querySelector("#filter input");

filter.addEventListener("input", (e) => {
  const filterBar = e.target.value.toLowerCase();

  const book = document.querySelectorAll(".book-data");
  const dataBook = Array.from(book);

  dataBook.forEach((book) => {
    const eachTitle = book.innerText;
    const hide = book.parentElement;
    if (eachTitle.toLowerCase().indexOf(filterBar) != -1) {
      book.style.display = "block";
      hide.style.display = "block";
    } else {
      book.style.display = "none";
      hide.style.display = "none";
    }
  });
});
