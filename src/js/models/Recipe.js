import axios from "axios";
import apiKey from "../config";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        const result = await axios(`https://www.food2fork.com/api/get?key=${apiKey}&rId=${this.id}`);
        this.title = result.data.recipe.title;
        this.author = result.data.recipe.publisher;
        this.img = result.data.recipe.image_url;
        this.url = result.data.recipe.source_url;
        this.ingredients = result.data.recipe.ingredients;
    }

    calcTime() {
        const ingredients = this.ingredients.length;
        const periods = Math.ceil(ingredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}
