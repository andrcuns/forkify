import axios from "axios";
import apiKey from "../config";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const result = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
        this.recipes = result.data.recipes;
    }
}
