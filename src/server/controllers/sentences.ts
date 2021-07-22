import { ApplicationController } from "./application";
import { Sentence } from "../../entity";

export class SentencesController extends ApplicationController {
  async show() {
    const { id } = this.validate("idParam", this.req.params);
    // TODO: order forms by index?
    const entity = await Sentence.findOne({ id }, { relations: ["forms"] });
    this.assertFound(entity);
    this.render(entity);
  }
}
