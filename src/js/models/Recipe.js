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

    parseIngredients() {
        const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"];
        const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"];
        const units = [...unitsShort, "kg", "g"];

        this.ingredients = this.ingredients.map(element => {
            let ingredient = element.toLowerCase();

            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index]);
            });
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            const ingredientArr = ingredient.split(" ");
            const unitIndex = ingredientArr.findIndex(el => units.includes(el));

            let objIngredient;
            if (unitIndex > -1) {
                const arrCount = ingredientArr.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace("-", "+"));
                } else {
                    count = eval(ingredient.slice(0, unitIndex).joing("+"));
                }

                objIngredient = {
                    count,
                    unit: ingredientArr[unitIndex],
                    ingredient: ingredientArr.slice(unitIndex + 1).join(" "),
                };
            } else if (parseInt(ingredientArr[0], 10)) {
                objIngredient = {
                    count: 1,
                    unit: "",
                    ingredient: ingredientArr.slice(1).join(" "),
                };
            } else if (unitIndex === -1) {
                objIngredient = {
                    count: 1,
                    unit: "",
                    ingredient,
                };
            }

            return objIngredient;
        });
    }
}
