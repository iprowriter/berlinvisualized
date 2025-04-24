import { Router, Request, Response } from "express";

const nominatimRouter = Router();

nominatimRouter.get("/", async (req: any, res: any) => {
  try {
    const dbResult = { nominatim: "test" };
    if (!dbResult) return res.status(500).send("Internal Server Error");

    res.json(dbResult); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default nominatimRouter;
