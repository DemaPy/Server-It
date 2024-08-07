import { check, param } from "express-validator";

export class ComponentValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }

  create() {
    return [
      check("component.title", "Max: 30, Min: 3 symbols").exists().notEmpty().isLength({
        max: 30,
        min: 3,
      }),
      check("component.content", "Content is not valid.")
      .exists()
      .notEmpty()
      .isString()
      .isLength({
        max: 1000000,
        min: 10,
      }),
    ];
  }

  update() {
    return [
      check("component.id", "Id is not valid.").exists().notEmpty().isString(),
      check("component.title", "Max: 30, Min: 3 symbols")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 30,
          min: 3,
        }),
      check("component.content", "Content is not valid.")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 1000000,
          min: 10,
        }),
    ];
  }

  delete() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }
}
