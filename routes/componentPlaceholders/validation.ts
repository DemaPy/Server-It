import { check, param } from "express-validator";

export class ComponentPlaceholderValidation {
  create() {
    return [
      check("placeholder.id", "Min: 3 symbols")
        .exists()
        .notEmpty()
        .isLength({
          min: 3,
        })
        .isString(),
      check("placeholder.content", "Content is not valid.")
        .exists()
        .notEmpty()
        .isLength({
          max: 1000000,
          min: 3,
        }),
      check("placeholder.placeholders", "Placehoders is not valid.")
        .exists()
        .notEmpty()
        .isArray({
          min: 1,
        }),
    ];
  }
}
