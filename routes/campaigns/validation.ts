import { check, param } from "express-validator";
import {
  campaign_validation_keys,
  campaign_validation_messages,
} from "./messages";

export class CampaignValidation {
  get() {
    return [param("id", "Id is not valid.").exists().notEmpty().isString()];
  }

  create() {
    return [
      check(
        campaign_validation_keys.title,
        campaign_validation_messages[campaign_validation_keys.title]
      )
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          max: 20,
          min: 3,
        }),
      check(
        campaign_validation_keys.templateId,
        campaign_validation_messages[campaign_validation_keys.templateId]
      )
        .exists()
        .notEmpty()
        .isString()
        .isLength({
          min: 3,
        }),
    ];
  }

  createData() {
    return [];
  }

  update() {
    return [
      check(
        campaign_validation_keys.id,
        campaign_validation_messages[campaign_validation_keys.id]
      )
        .exists()
        .notEmpty()
        .isString(),
      check(
        campaign_validation_keys.title,
        campaign_validation_messages[campaign_validation_keys.title]
      )
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
    return [
      param("id", campaign_validation_messages[campaign_validation_keys.id])
        .exists()
        .notEmpty()
        .isString(),
    ];
  }
}
