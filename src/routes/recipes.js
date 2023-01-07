const { Router } = require('express');
const { Recipes, Diets } = require("../db")
const router = Router();
const axios = require("axios");
const { API_KEY } = process.env;

const getApiInfo = async () => {

    const apiUrl = await axios.get("https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5/information&number=100")

    /* API_KEY = "0703c2cd0e044f7eb5fb4874824a13d1"
    7f8ccb1446874eec8efcae2c17242c17 gmail
    0703c2cd0e044f7eb5fb4874824a13d1 hotmail */

    //const apiUrl = await axios.get("https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5/information&number=100")

    // const apiUrl = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)

    const apiInfo = await apiUrl.data.results.map(e => {
        return {
            id: e.id,
            title: e.title,
            image: e.image,
            diets: e.diets.map(e => e),
            dishTypes: e.dishTypes.map(e => e),
            summary: e.summary,
            healthScore: e.healthScore,
            analyzedInstructions: e.analyzedInstructions.map(e => e.steps.map(e => e.step))
        }
    })

    return apiInfo
}

const getDbInfo = async () => {
    return await Recipes.findAll({
        include: {
            model: Diets,
            attributes: ["name"],
            through: {
                attributes: [],
            }
        }
    })
}

const getAllRecipes = async () => {
    const apiInfo = await getApiInfo()
    const dbInfo = await getDbInfo()
    const infoTotal = apiInfo.concat(dbInfo)
    return infoTotal
}

router.get("/", async (req, res) => {

    const { title } = req.query
    let allRecipes = await getAllRecipes()

    if (title) {
        let recipeTitles = await allRecipes.filter(e => e.title.toLowerCase().includes(title.toLocaleLowerCase()))

        recipeTitles.length ?
            res.status(200).send(recipeTitles)
            :
            res.status(404).send("Recipe not found")

    } else {
        res.status(200).send(allRecipes)
    }



})

router.get("/:id", async (req, res) => {

    const { id } = req.params
    const allRecipes = await getAllRecipes()

    if (id) {
        let recipeId = await allRecipes.filter(e => e.id == id)
        recipeId.length ?
            res.status(200).json(recipeId) : res.status(404).send("Recipe not found")
    }
})

router.delete("/:id", async (req, res) => {

    const { id } = req.params

    await Recipes.destroy({
        where: { id }
    })

    res.status(200).send("Recipe deleted")
})

router.post("/", async (req, res) => {
    try {
        let { title, summary, healthScore, analyzedInstructions, image, dietsCheck } = req.body

        let createdRecipe = await Recipes.create({
            title,
            summary,
            healthScore,
            analyzedInstructions,
            image,

        })

        let dietsDb = await Diets.findAll({
            where: { name: dietsCheck }
        });

        await createdRecipe.addDiets(dietsDb);

        res.send(createdRecipe)

    } catch (error) {
        res.status(400).send({ error: error.message })
    }

})









module.exports = router;

/* router.get("/", async (req, res) => {

    const apiURL = await axios.get("https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5/information&number=100");

    const recipesAPI = apiURL.data.results.map(e => e.title)

    recipesAPI.forEach(e => {
        Recipes.findOrCreate({
            where: { title: e }
        })
    })

    const allRecipes = await Recipes.findAll()

    const { title } = req.query
    if (title) {
        let exp = new RegExp(title.toLowerCase());
        const resultsQuery = await allRecipes.filter(e => exp.test(e.title.toLowerCase()));
        return res.send(resultsQuery)
    }

    res.send(allRecipes)
}) */

/* router.get("/", async (req, res) => {
    const { title } = req.query
    const allRecipes = await Recipes.findAll()
    const result = await allRecipes.filter(e => e.title === title)
    res.send(result)
}) */

/* router.post("/", async (req, res) => {//crea el juego en la db desde el formulario
    let { title } = req.body

    let createdRecipe = await Recipes.create({
        title,

    })
    res.send(createdRecipe)
}) */






