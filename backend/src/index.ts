import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import { z } from "zod";

const server = express();
server.use(cors());
server.use(express.json());

const ResponseSchema = z.object({
  results: z
    .object({
      id: z.number(),
      name: z.string(),
      status: z.string(),
      species: z.string(),
      gender: z.string(),
      image: z.string(),
    })
    .array(),
});

server.get("/api/character", async (req: Request, res: Response) => {
  const bakeryData = await JSON.parse(
    fs.readFileSync("database/character.json", "utf-8")
  );
  return res.json(bakeryData);
});

//////////////////////////////////////////// bakery
server.get("/api/bakery", async (req: Request, res: Response) => {
  const characterData = await JSON.parse(
    fs.readFileSync("database/bakery.json", "utf-8")
  );
  return res.json(characterData);
});

const cookieSchema = z.object({
  cookieId: z.number(),
  name: z.string(),
});



server.post("/api/favorite", (req: Request, res: Response) => {
  const result = cookieSchema.safeParse(req.body);

  if (!result.success) return res.status(400).json(result.error.issues);
  const fileData = JSON.parse(fs.readFileSync("database/favoriteCookie.json", "utf-8"));


  fileData.push({id: new Date().toISOString(), cookieId: result.data.cookieId});

  fs.writeFileSync("database/favoriteCookie.json",JSON.stringify(fileData, null, 2),"utf-8");
});

//////////////////////////////////////////// bakery
server.get("/api/refresh", async (req: Request, res: Response) => {
  const characterData = await JSON.parse(
    fs.readFileSync("database/liked.json", "utf-8")
  );
  return res.json(characterData);
});


const characterSchema = z.object({
  userName: z.string().optional(),
  characterName: z.string(),
});

let id = 1
server.post("/api/liked", (req: Request, res: Response) => {
  const result = characterSchema.safeParse(req.body);

  if (!result.success) return res.status(400).json(result.error.issues);
  const fileData = JSON.parse(fs.readFileSync("database/liked.json", "utf-8"));


  fileData.push({id: id++, characterName: result.data.characterName, userName: result.data.userName});

  fs.writeFileSync("database/liked.json",JSON.stringify(fileData, null, 2),"utf-8");
});


const deletecharacterSchema = z.object({
  id: z.number(),
  userName: z.string(),
  characterName: z.string(),
}).array();

server.delete("/api/del/:id", async (req: Request, res: Response) => {

  const id = +req.params.id
  const fileData = JSON.parse(fs.readFileSync("database/liked.json", "utf-8"))
  const result = deletecharacterSchema.safeParse(fileData)

  if (!result.success) return res.status(400).json(result.error.issues);

  const likedChar = result.data
  let filteredLiked = likedChar.filter(charId => charId.id !== id)

  fs.writeFileSync("database/liked.json",JSON.stringify(filteredLiked, null, 2),"utf-8");

  res.sendStatus(200)
})


server.listen(3333);
