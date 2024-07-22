import { check, param } from "express-validator";

export class TemplateValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }

  create() {
    return [
      check("template.title", "Max: 35, Min: 3 symbols").exists().notEmpty().isLength({
        max: 35,
        min: 3,
      }),
    ];
  }

  update() {
    return [
      check("template.id", "Id is not valid.").exists().notEmpty().isString(),
      check("template.title", "Max: 35, Min: 3 symbols")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 35,
          min: 3,
        }),
    ];
  }

  delete() {
    return [param("template.id", "Id is not valid.").exists().notEmpty().isString()];
  }
}
