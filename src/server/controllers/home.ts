import { ApplicationController } from "./application";
import { Service } from "../../service";

export class HomeController extends ApplicationController {
  async morphology() {
    const { word } = this.validate("wordParam", this.req.query);
    const result = await Service.morphology(word);
    this.render(result);
  }

  async fuzzySearch() {
    const { word } = this.validate("wordParam", this.req.query);
    const result = await Service.fuzzySearch(word);
    this.render(result);
  }
}
