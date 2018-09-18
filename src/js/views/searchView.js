import { elements } from "./base";

const createButton = (page, direction) => `
    <button class="btn-inline results__btn--${direction}" data-goto=${direction === "prev" ? page - 1 : page + 1}>
        <span>Page ${direction === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${direction === "prev" ? "left" : "right"}"></use>
        </svg>
    </button>
`;

const limitRecipeTitle = (title, limit = 17) => {
    const reducedTitle = [];
    if (title.length > limit) {
        title.split(" ").reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                reducedTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${reducedTitle.join(" ")} ...`;
    }
    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
                  <li>
                      <a class="results__link" href="#${recipe.recipe_id}">
                          <figure class="results__fig">
                              <img src="${recipe.image_url}" alt="${recipe.title}">
                          </figure>
                          <div class="results__data">
                              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                              <p class="results__author">${recipe.publisher}</p>
                          </div>
                      </a>
                  </li>
                  `;
    elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

const renderButtons = (page, numRecipes, recipesPerPage) => {
    const pages = Math.ceil(numRecipes / recipesPerPage);
    let button;

    if (page === 1 && pages > 1) {
        button = createButton(page, "next");
    } else if (page === pages) {
        button = createButton(page, "prev");
    } else {
        button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `;
    }

    elements.searchResultsPages.insertAdjacentHTML("afterbegin", button);
};

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = "";
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = "";
    elements.searchResultsPages.innerHTML = "";
};

export const highlightSelected = id => {
    const activeLink = "results__link--active";
    Array.from(document.querySelectorAll(".results__link")).forEach(el => {
        el.classList.remove(activeLink);
    });
    document.querySelector(`a[href='#${id}']`).classList.add(activeLink);
};

export const renderResults = (recipes, page = 1, recipesPerPage = 10) => {
    const start = (page - 1) * recipesPerPage;
    const end = page * recipesPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, recipesPerPage);
};
