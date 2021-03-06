import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();

            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();

            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id),
            );
        } catch (error) {
            alert("Error processing recipe");
        }
    }
};

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    if (!state.list) state.list = new List();
    state.recipe.ingredients.forEach(element => {
        state.list.addItem(element.count, element.unit, element.ingredient);
    });
    state.list.items.forEach(item => listView.renderItem(item));
};

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)) {
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );
        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentId);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikesMenu(state.likes.getLikesNumber());
};

window.addEventListener("load", () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikesMenu(state.likes.getLikesNumber());
    likesView.renderLikes(state.likes.likes);
});

elements.shopping.addEventListener("click", e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;
    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches(".shopping__count-value")) {
        const { value } = e.target;
        state.list.updateCount(id, value);
    }
});

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

elements.recipe.addEventListener("click", event => {
    if (event.target.matches(".btn-decrease, .btn-decrease *")) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches(".btn-increase, .btn-increase *")) {
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches(".recipe__btn-add, .recipe__btn-add *")) {
        controlList();
    } else if (event.target.matches(".recipe__love, .recipe__love *")) {
        controlLike();
    }
});
