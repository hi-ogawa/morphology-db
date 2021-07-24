import { ApplicationController } from "./application";
import { Form } from "../../entity";

export class FormsController extends ApplicationController {
  async show() {
    const { id } = this.validate("idParam", this.req.params);
    const entity = await Form.findOne(
      { id },
      { relations: ["lemma", "sentence"] }
    );
    this.assertFound(entity);
    this.render(entity);
  }

  // TODO: Use pagination since it can be over 10000 entries (e.g. "что")
  async search() {
    const { word } = this.validate("wordParam", this.req.query);
    const entities = await Form.xfind({ word }, { relations: ["sentence"] });
    this.render(entities);
  }
}
