import { Router } from "express";
import { logInController, logOutController, refreshTokenController, signUpController } from "../../controller/auth/controller";

const router = Router();

router.post("/signup", signUpController)
router.post("/login", logInController)
router.post("/refresh", refreshTokenController)
router.post("/logout", logOutController)

export default router;