import axios from "axios"

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const apiKey = "93f773b56abbe6b79b26af81edc7818e"
        try {
            const result = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`)
            this.recipes = result.data.recipes
        } catch (error) {
            alert(error)
        }
    }
}