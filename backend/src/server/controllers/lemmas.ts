import { ApplicationController } from "./application";
import { Lemma } from "../../entity";

export class LemmasController extends ApplicationController {
  async show() {
    const { id } = this.validate("idParam", this.req.params);
    const entity = await Lemma.findOne({ id }, { relations: ["forms"] });
    this.assertFound(entity);
    this.render(entity);
  }

  async search() {
    const { word } = this.validate("wordParam", this.req.query);
    const entities = await Lemma.find({ word });
    this.render(entities);
  }
}
