import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
    document.querySelector(".recipe__love use").setAttribute("href", `img/icons.svg#${iconString}`);
};

export const toggleLikesMenu = likesNum => {
    elements.likesMenu.style.visibility = likesNum > 0 ? "visible" : "hidden";
};

export const renderLike = like => {
    const title = limitRecipeTitle(like.title);
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${title}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>`;
    elements.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = id => {
    const like = document.querySelector(`.likes__link[href*='${id}']`).parentElement;
    if (like) like.parentElement.removeChild(like);
};
