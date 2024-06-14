import { check, param } from "express-validator";

export class SectionValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString().isLength({
      min: 5,
    })];
  }

  create() {
    return [
      check("title", "Max: 20, Min: 3 symbols")
        .exists()
        .notEmpty()
        .isLength({
          max: 20,
          min: 3,
        })
        .isString(),
      check("content", "Content is not valid.").exists().notEmpty().isLength({
        max: 10000,
        min: 3,
      }),
      check("templateId", "Template id is not valid.")
        .exists()
        .notEmpty()
        .isLength({
          min: 3,
        })
        .isString(),
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

  duplicate() {
    return [
      param("id", "Id is not valid.").exists().notEmpty().isString().isLength({
        min: 5,
      }),
    ];
  }

  delete() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString().isLength({
      min: 5,
    })];
  }
}
