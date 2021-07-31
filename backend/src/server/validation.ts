import * as Ajv from "ajv";
import { ValidationError } from "ajv";
export { ValidationError };

const schemas = [
  {
    $id: "idParam",
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
  {
    $id: "wordParam",
    type: "object",
    required: ["word"],
    properties: {
      word: { type: "string" },
    },
  },
  {
    $id: "pagination",
    type: "object",
    properties: {
      page: { type: "number", minimum: 1, default: 1 },
      perPage: { type: "number", minimum: 1, default: 25 },
    },
  },
];

const ajv = new Ajv({
  useDefaults: true,
  coerceTypes: true,
  nullable: true,
  schemas: schemas,
});

export type SchemaKey = typeof schemas[number]["$id"];

export function validate(schemaKey: SchemaKey, data: any) {
  const validator = ajv.getSchema(schemaKey)!;
  if (!validator(data)) {
    const error = new ValidationError(validator.errors!);
    error.message = ajv.errorsText(error.errors);
    throw error;
  }
  return data;
}
