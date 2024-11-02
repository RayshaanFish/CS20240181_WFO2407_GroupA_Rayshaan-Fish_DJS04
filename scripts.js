import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Objects as data elements
class Book {
  constructor(id, title, author, image, genres, published, description) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.image = image;
    this.genres = genres;
    this.published = published;
    this.description = description;
  }
}

class Author {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class Genre {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

// Create book, author, and genre instances
const booksData = books.map(
  (book) =>
    new Book(
      book.id,
      book.title,
      book.author,
      book.image,
      book.genres,
      book.published,
      book.description
    )
);
const authorsData = Object.entries(authors).map(
  ([id, name]) => new Author(id, name)
);
const genresData = Object.entries(genres).map(
  ([id, name]) => new Genre(id, name)
);

// State Variables
let page = 1;
let matches = booksData;

// *** Functions for Repetitive Tasks ***

// Display the initial book list
function displayBooksList(bookList) {
  const fragment = document.createDocumentFragment();
  for (const { author, id, image, title } of bookList.slice(
    0,
    BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);
    element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
    fragment.appendChild(element);
  }
  document.querySelector("[data-list-items]").appendChild(fragment);
}

// Display dropdown options for genres and authors
function displayDropdownOptions(element, options, defaultText) {
  const fragment = document.createDocumentFragment();
  const defaultOption = document.createElement("option");
  defaultOption.value = "any";
  defaultOption.innerText = defaultText;
  fragment.appendChild(defaultOption);
  options.forEach((option) => {
    const el = document.createElement("option");
    el.value = option.id;
    el.innerText = option.name;
    fragment.appendChild(el);
  });
  element.appendChild(fragment);
}

// Initialize filters for genre and author
displayDropdownOptions(
  document.querySelector("[data-search-genres]"),
  genresData,
  "All Genres"
);
displayDropdownOptions(
  document.querySelector("[data-search-authors]"),
  authorsData,
  "All Authors"
);

// Theme settings
function applyTheme(theme) {
  const colorScheme =
    theme === "night"
      ? { dark: "255, 255, 255", light: "10, 10, 20" }
      : { dark: "10, 10, 20", light: "255, 255, 255" };
  document.documentElement.style.setProperty("--color-dark", colorScheme.dark);
  document.documentElement.style.setProperty(
    "--color-light",
    colorScheme.light
  );
}

// Check theme state
applyTheme(
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day"
);

// Add event listeners
function setupEventListeners() {
  document
    .querySelector("[data-search-cancel]")
    .addEventListener("click", () => {
      document.querySelector("[data-search-overlay]").open = false;
    });

  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = false;
    });

  document
    .querySelector("[data-header-search]")
    .addEventListener("click", () => {
      document.querySelector("[data-search-overlay]").open = true;
      document.querySelector("[data-search-title]").focus();
    });

  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = true;
    });

  document.querySelector("[data-list-close]").addEventListener("click", () => {
    document.querySelector("[data-list-active]").open = false;
  });

  document
    .querySelector("[data-settings-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      applyTheme(formData.get("theme"));
      document.querySelector("[data-settings-overlay]").open = false;
    });
}

document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        let result = null;

        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }

        active = result;
      }
    }

    if (active) {
      document.querySelector("[data-list-active]").open = true; // Ensure the modal is opened
      document.querySelector("[data-list-blur]").src = active.image;
      document.querySelector("[data-list-image]").src = active.image;
      document.querySelector("[data-list-title]").innerText = active.title;
      document.querySelector("[data-list-subtitle]").innerText =
        `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText =
        active.description;
    }
  });

// Apply filters
function filterBooks(filters) {
  return booksData.filter((book) => {
    const titleMatch =
      !filters.title ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    return titleMatch && authorMatch && genreMatch;
  });
}

// Update book list
function updateBookList(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  matches = filterBooks(filters);
  document.querySelector("[data-list-items]").innerHTML = "";

  if (matches.length > 0) {
    displayBooksList(matches);
    document
      .querySelector("[data-list-message]")
      .classList.remove("list__message_show");
  } else {
    document
      .querySelector("[data-list-message]")
      .classList.add("list__message_show");
  }
  document.querySelector("[data-list-button]").disabled =
    matches.length - page * BOOKS_PER_PAGE <= 0;
  document.querySelector("[data-search-overlay]").open = false;
}

// Initialize
displayBooksList(matches);
setupEventListeners();

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", updateBookList);
