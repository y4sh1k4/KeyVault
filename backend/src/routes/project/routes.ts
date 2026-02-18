import { Router } from "express";
import { createProjectController, getProjectController } from "../../controller/project/controller";

const router = Router()

router.post("/create", createProjectController)
router.get("/", getProjectController)

export default router;