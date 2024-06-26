import { check, param } from "express-validator";

export class TemplateValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }

  create() {
    return [
      check("title", "Max: 35, Min: 3 symbols").exists().notEmpty().isLength({
        max: 20,
        min: 3,
      }),
    ];
  }

  update() {
    return [
      check("id", "Id is not valid.").exists().notEmpty().isString(),
      check("title", "Max: 35, Min: 3 symbols")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 20,
          min: 3,
        }),
    ];
  }

  delete() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }
}
