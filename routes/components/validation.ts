import { check, param } from "express-validator";

export class ComponentValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }

  create() {
    return [
      check("title", "Title is not valid.").exists().notEmpty().isLength({
        max: 10,
        min: 3,
      }),
    ];
  }

  update() {
    return [
      check("id", "Id is not valid.").exists().notEmpty().isString(),
      check("title", "Title is not valid.")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 10,
          min: 3,
        }),
      check("content", "Content is not valid.")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 10000,
          min: 10,
        }),
    ];
  }

  delete() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }
}
