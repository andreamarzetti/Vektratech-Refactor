import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import productsRouter from "./products";
import ordersRouter from "./orders";
import customersRouter from "./customers";
import dashboardRouter from "./dashboard";
import chatRouter from "./chat";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(customersRouter);
router.use(dashboardRouter);
router.use(chatRouter);
router.use(adminRouter);

export default router;
