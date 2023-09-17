import "./style.css";
import axios /* ,{AxiosError, AxiosResponse} */ from "axios";
import { z } from "zod";


 const apiURLBakery = "http://localhost:3333/api/bakery"
 const apiURLliked = "http://localhost:3333/api/favorite"


const recepiesResponScheam = z.object({
  recipes: z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    lactoseFree: z.boolean(),
    glutenFree: z.boolean(),
    ingredients: z.object({
      name: z.string(),
      amount: z.string()
    }).array()
  }).array()
})

type ResponseRecepies = z.infer<typeof recepiesResponScheam>;

const getRecepies = async (apiURLResfresh: string) => {
  const response = await axios.get(apiURLResfresh);
  const data = response.data;
  const result = recepiesResponScheam.safeParse(data);
  if (!result.success) {
    return null;
  }
  renderRecepies(result.data)
  return data;
}

getRecepies(apiURLBakery)

const renderRecepies = (recipesArray: ResponseRecepies) =>{

  const tureFalseValidator = (value : boolean) => {
    if(value == true){
     return `<div class="badge badge-success gap-2">
      <p>Yes</p>
    </div>`
    }else{
      return `<div class="badge badge-error gap-2">
          <p>No</p>
          </div>`
    }
  }

  document.getElementById("app")!.innerHTML = 
`
  ${recipesArray.recipes.map(recipe =>

    `
    <div class="card w-96 bg-base-100 shadow-xl m-3">
    <div class="card-body items-center text-center">
      <h2 class="card-title">${recipe.name}</h2>
      <p>${recipe.price}</p>
      <div class="flex">
      <div class="m-3">
        <p>Gluten Free?</p>
        <p>${tureFalseValidator(recipe.glutenFree)}</p>
      </div>
      <div class="m-3">
        <p>Lactose Free?</p>
        <p>${tureFalseValidator(recipe.lactoseFree)}</p>
        </div>
      </div>
      <select class="select select-ghost w-full max-w-xs">
        <option disabled selected>Ingredients</option>
        ${recipe.ingredients.map(ingredient =>
          `<option>${ingredient.name}</option>`
          ).join("")}
      </select>
    </div>
    <button class="btn btn-info" id="${recipe.id}">Like</button>
    </div>
`
    ).join("")}
`
    for(const recipe of recipesArray.recipes){
        document.getElementById("" +recipe.id)!.addEventListener("click", postLiked)

    }
}

const postLiked = async (event: MouseEvent) => {
  const response = await  axios.post( apiURLliked, {cookieId: + (event.target as HTMLButtonElement).id});
  response
};

