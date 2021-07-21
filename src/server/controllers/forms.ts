import { ApplicationController } from "./application";
import { Form } from "../../entity";

export class FormsController extends ApplicationController {
  async show() {
    const { id } = this.validate("idParam", this.req.params);
    const entity = await Form.findOne(
      { id },
      { relations: ["lemma", "sentence"] }
    );
    this.assertDefined(entity);
    this.render(entity);
  }

  async search() {
    const { word } = this.validate("wordParam", this.req.query);
    const entities = await Form.find({ word });
    this.render(entities);
  }
}
