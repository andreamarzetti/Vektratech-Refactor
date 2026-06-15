import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import productsRouter from "./products";
import ordersRouter from "./orders";
import customersRouter from "./customers";
import dashboardRouter from "./dashboard";
import chatRouter from "./chat";
import adminRouter from "./admin";
import storeRouter from "./store";
import businessRouter from "./business";
import couponsRouter from "./couponsRoute";

const router: IRouter = Router();

router.use(storeRouter);
router.use(healthRouter);
router.use(usersRouter);
router.use(businessRouter);
router.use(couponsRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(customersRouter);
router.use(dashboardRouter);
router.use(chatRouter);
router.use(adminRouter);

export default router;
