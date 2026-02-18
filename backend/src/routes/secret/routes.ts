import { Router } from "express";
import { createSecretController, getSecretsController } from "../../controller/secret/controller";

const router = Router()

router.post("/create", createSecretController)
router.get("/all", getSecretsController)

export default router;