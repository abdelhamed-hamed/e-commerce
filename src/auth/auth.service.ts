import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/api-errors";
import tokens from "../utils/creatToken";

class AuthService {
  login = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const findEmailOrUserName = {
        $or: [{ username: req.body.username }, { email: req.body.email }],
      };

      //Check If User OR Email Founded Or No
      const user = await usersSchema.findOne(findEmailOrUserName);

      // بشوف هل اليوزر مش مموجود
      // هنا بشوف هل الباسوورد ال مدخله بيساوي نفس قيمة الباسوورد ال معمول ليها هاش ولا لا
      // لو مفيش يوزر او الباسووردين مش موجودين مش هيطلعلي توكين وهيدخل علي ال بعده
      if (!user || !(await bcrypt.compare(req.body.password, user.password)))
        return next(new ApiErrors(req.__("invalid-email-password"), 400));

      // لو نجح ف الاختبار اعمل لليوزر ده توكن
      const token = tokens.creatToken(user._id, user.role);

      res.status(200).json({ token, data: user });
    }
  );

  signup = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const newUser = await usersSchema.create({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        image: req.body.image,
        role: req.body.role,
      });

      const token = tokens.creatToken(newUser._id, newUser.role);

      res.status(201).json({ token, data: newUser });
      next();
    }
  );

  protectedRoute = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // [1] - get token
      let token = "";

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        return next(new ApiErrors(req.__("please-login"), 401));
      }

      // [2] - decoded token
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

      // [3] - check token still connected in DB or expired
      const user = await usersSchema.findById(decodedToken._id);

      if (!user) {
        return next(new ApiErrors(req.__("invalid-user"), 404));
      }

      // [3] - check change password

      // Check If changed password or no
      if (user.passwordChangedAt instanceof Date) {
        // transfer passwordchangedat
        const chagedPasswordSeconed: number = parseInt(
          (user.passwordChangedAt.getTime() / 1000).toString()
        );

        // if password changedat after transfer larger than token creat
        if (chagedPasswordSeconed > decodedToken.iat) {
          return next(new ApiErrors(req.__("please-login"), 401));
        }
      }

      // [4] storage user in request
      req.user = user;
      next();
    }
  );

  checkActive = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.active) {
        return next(new ApiErrors(req.__("account-activate"), 403));
      }
      next();
    }
  );

  allowedTo = (...roles: string[]) =>
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role!)) {
          return next(new ApiErrors(req.__("account-permission"), 403));
        }
        next();
      }
    );
}
const authService = new AuthService();
export default authService;
