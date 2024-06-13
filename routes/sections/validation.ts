import { check, param } from "express-validator";

export class SectionValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString().isLength({
      min: 5,
    })];
  }

  create() {
    return [
      check("title", "Title is not valid.")
        .exists()
        .notEmpty()
        .isLength({
          max: 10,
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
