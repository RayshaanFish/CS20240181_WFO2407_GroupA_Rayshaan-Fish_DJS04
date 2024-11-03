import { authors } from "./data.js";

// Function to create a book preview element
export function createBookPreview(book) {
  const { id, image, title, author } = book;

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

  return element;
}

// Function to open a book preview modal with book details
export function showBookPreviewModal(book) {
  const { image, title, author, published, description } = book;

  document.querySelector("[data-list-active]").open = true;
  document.querySelector("[data-list-blur]").src = image;
  document.querySelector("[data-list-image]").src = image;
  document.querySelector("[data-list-title]").innerText = title;
  document.querySelector("[data-list-subtitle]").innerText =
    `${authors[author]} (${new Date(published).getFullYear()})`;
  document.querySelector("[data-list-description]").innerText = description;
}
