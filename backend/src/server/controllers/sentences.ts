import { ApplicationController } from "./application";
import { Sentence } from "../../entity";

export class SentencesController extends ApplicationController {
  async show() {
    const { id } = this.validate("idParam", this.req.params);
    const entity = await Sentence.xfindqb(
      { id },
      { relations: ["forms", "forms.lemma"] }
    )
      .orderBy("Sentence__forms.index")
      .getOne();
    this.assertFound(entity);
    this.render(entity);
  }
}
