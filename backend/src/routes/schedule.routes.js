"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedule_controller_1 = require("../controllers/schedule.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Public routes
router.get("/", schedule_controller_1.getAllSchedules);
router.get("/:id", schedule_controller_1.getScheduleById);
// Protected routes
router.post("/", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), // roles allowed to create schedules
schedule_controller_1.createSchedule);
router.put("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), // roles allowed to update schedules
schedule_controller_1.updateSchedule);
router.delete("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), // only admin can delete schedules
schedule_controller_1.deleteSchedule);
exports.default = router;
