import { Router } from "express";
import Home from "./controllers/home";
import Redirect from "./controllers/redirect";

const routes = Router();

routes.get("/", Home.render);
routes.get("/:id", Redirect.renderRedirectPage);

export default routes;
