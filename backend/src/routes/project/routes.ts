import { Router } from "express";
import { createProjectController, getProjectByIdController, getProjectController } from "../../controller/project/controller";

const router = Router()

router.post("/create", createProjectController)
router.get("/", getProjectController)
router.post("/", getProjectByIdController)

export default router;