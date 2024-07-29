import { check, param } from "express-validator";

export class SectionValidation {
  get() {
    return [
      param("id", "Id is not valid.").exists().notEmpty().isString().isLength({
        min: 5,
      }),
    ];
  }

  create() {
    return [
      check("section.title", "Max: 35, Min: 3 symbols")
        .exists()
        .notEmpty()
        .isLength({
          max: 35,
          min: 3,
        })
        .isString(),
      check("section.content", "Content is not valid.")
        .exists()
        .notEmpty()
        .isLength({
          max: 1000000,
          min: 3,
        }),
      check("section.templateId", "Template id is not valid.")
        .exists()
        .notEmpty()
        .isLength({
          min: 3,
        })
        .isString(),
    ];
  }

  createFromComponent() {
    return [
      check("section.templateId", "Template id is not valid.")
        .exists()
        .notEmpty()
        .isLength({
          min: 3,
        })
        .isString(),
      check("section.componentId", "Content id is not valid.")
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
      check("section.id", "Id is not valid.").exists().notEmpty().isString(),
      check("section.title", "Max: 35, Min: 3 symbols")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 35,
          min: 3,
        }),
      check("section.content", "Content is not valid.")
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 1000000,
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
    return [
      param("id", "Id is not valid.").exists().notEmpty().isString().isLength({
        min: 5,
      }),
    ];
  }
}
