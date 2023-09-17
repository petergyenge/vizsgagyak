import "./style.css";
import axios /* ,{AxiosError, AxiosResponse} */ from "axios";
import { z } from "zod";


 const apiURLCharacter = "http://localhost:3333/api/bakery"


const recepiesResponScheam = z.object({
  recipes: z.object({
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

getRecepies(apiURLCharacter)

const renderRecepies = (recipesArray: ResponseRecepies) =>{
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
        <input type="checkbox" checked="${recipe.lactoseFree}" />
        </div>
      </div>
      <select class="select select-ghost w-full max-w-xs">
        <option disabled selected>Ingredients</option>
        ${recipe.ingredients.map(ingredient =>
          `<option>${ingredient.name}</option>`
          ).join("")}

      </select>
    </div>
    </div>
`
    ).join("")}
`
}

const tureFalseValidator = (value : boolean) => {
  if(value == true){
    `<div class="badge badge-success gap-2">
    <p>Yes</p>
  </div>
  <div class="badge badge-error gap-2">`
  }else{
    `<div class="badge badge-error gap-2">
        <p>No</p>
        </div>`
  }
}