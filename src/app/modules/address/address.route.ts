import { Router } from "express";
import auth from "../../middleware/auth";
import zodValidateHandler from "../../middleware/zodValidateHandler";
import { addressController } from "./address.controller";
import { createAddressZodSchema, updateAddressZodSchema } from "./address.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.admin, Role.moderator, Role.customer), zodValidateHandler(createAddressZodSchema), addressController.createAddress);

router.get("/me", auth(Role.admin, Role.moderator, Role.customer), addressController.getMyAddresses);

router.get("/", auth(Role.admin, Role.moderator), addressController.getAllAddresses);

router.get("/:id", auth(Role.admin, Role.moderator, Role.customer), addressController.getAddressById);

router.patch("/:id", auth(Role.admin, Role.moderator, Role.customer), zodValidateHandler(updateAddressZodSchema), addressController.updateAddress);

router.delete("/:id", auth(Role.admin, Role.moderator, Role.customer), addressController.deleteAddress);

export { router as addressRouter };
