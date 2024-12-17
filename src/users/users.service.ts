import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcrypt";
import { Users } from "./users.interface";
import crudService from "../shared/crud.service";
import usersSchema from "./users.schema";
import ApiErrors from "../utils/api-errors";

class UsersService {
  getAll = crudService.getAll<Users>(usersSchema);

  getOne = crudService.getOne<Users>(usersSchema);

  create = crudService.create<Users>(usersSchema);

  update = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const updatedNameAndImage: string | null =
        await usersSchema.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.name,
            image: req.body.image,
            active: req.body.active,
          },
          {
            new: true,
          }
        );
      if (!updatedNameAndImage)
        return next(new ApiErrors(req.__("not-found"), 404));
      res.status(200).json({ data: updatedNameAndImage });
    }
  );

  delete = crudService.delete<Users>(usersSchema);

  changePassword = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const updatePassword: string | null = await usersSchema.findByIdAndUpdate(
        req.params.id,
        {
          password: await bcrypt.hash(req.body.password, 13),
          passwordChangedAt: Date.now(),
        },
        {
          new: true,
        }
      );
      if (!updatePassword) return next(new ApiErrors(req.__("not-found"), 404));
      res.status(200).json({ data: updatePassword });
    }
  );

  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const file = req.file;
      const fileName = `user-${Date.now()}-${
        file.originalname.split(".")[0]
      }.webp`;

      await sharp(file.buffer)
        .webp({ quality: 90 })
        .resize({ width: 500, height: 500 })
        .toFile(`src/uploads/images/users/${fileName}`);
      req.body.image = fileName;
    }

    next();
  };
}

// Hash paswword If Click Save

const usersService = new UsersService();

export default usersService;
