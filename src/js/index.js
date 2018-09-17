import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

/**
 * Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);

        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            await state.search.getResults();

            clearLoader();
            searchView.renderResults(state.search.recipes);
        } catch (error) {
            alert("Error getting recipes");
            clearLoader();
        }
    }
};

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace("#", "");

    if (id) {
        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();

            state.recipe.calcTime();
            state.recipe.calcServings();
        } catch (error) {
            alert("Error processing recipe");
        }
    }
};

elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);

        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
});

["hashchange", "load"].forEach((event) => {
    window.addEventListener(event, controlRecipe);
});
