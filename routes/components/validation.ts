import { check, param } from "express-validator";

export class ComponentValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }

  create() {
    return [
      check("title", "Max: 20, Min: 3 symbols").exists().notEmpty().isLength({
        max: 20,
        min: 3,
      }),
    ];
  }

  update() {
    return [
      param("position", "Position is not valid.").exists().notEmpty().isString(),
      check("id", "Id is not valid.").exists().notEmpty().isString(),
      check("title", "Max: 20, Min: 3 symbols")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 20,
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
