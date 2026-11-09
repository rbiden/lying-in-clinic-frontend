# Zod helpers

Import helpers and their configuration types from `#/helpers/zod` (or the existing `@/helpers/zod` alias). Each helper takes one options object and returns a Zod 3 schema; native `.refine()` and `.superRefine()` remain available.

```ts
import { zodEmail, zodInt, zodObject, zodString } from '#/helpers/zod'

const account = zodObject({
  shape: {
    email: zodEmail({ label: 'Email' }),
    password: zodString({ trim: false, min: 8, label: 'Password' }),
    confirmPassword: zodString({ trim: false }),
    description: zodString({ required: false, nullable: true, max: 500 }),
    page: zodInt({ coerce: true, min: 1, default: 1 }),
  },
  refine: [
    {
      check: (value) => value.password === value.confirmPassword,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  ],
})
```

| Helper        | Additional options / behavior                                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zodString`   | `trim`, `min`, `max`, `length`, `regex`, `case`; required strings default to minimum length 1, optional strings to 0. Exact length replaces the implicit minimum.                                                                   |
| `zodEmail`    | `trim`, `min`, `max`, `regex`, `case`; email format is always checked. Case is preserved by default.                                                                                                                                |
| `zodUrl`      | `trim`, `min`, `max`, `protocols`, `hostnameRegex`; allows HTTP/HTTPS by default, returns the supplied URL text after configured trimming.                                                                                          |
| `zodInt`      | `coerce`, `min`, `max`, `multipleOf`; accepts safe integers.                                                                                                                                                                        |
| `zodNumber`   | `coerce`, `min`, `max`, `multipleOf`; accepts finite numbers; does not provide exact-decimal money arithmetic.                                                                                                                      |
| `zodBoolean`  | `coerce`, `trim`, `caseInsensitive`; coercion adds only the strings `true`/`false`, with trimming and case-insensitive matching enabled by default.                                                                                 |
| `zodDate`     | `trim`, `min`, `max`; real calendar dates and bounds in `YYYY-MM-DD`, returned as text.                                                                                                                                             |
| `zodDateTime` | `trim`, `offset`, `local`, `precision`; UTC with seconds and optional fractional seconds by default. Precision -1 requires minutes only, 0 requires seconds without fractions, positive values require that many fractional digits. |
| `zodEnum`     | `values`: nonempty readonly tuple of strings; exact matching and literal union inference.                                                                                                                                           |
| `zodArray`    | `item`, `min`, `max`, `length`; minimum defaults to 0, including required arrays.                                                                                                                                                   |
| `zodObject`   | `shape`, `unknownKeys`, `minProperties`; rejects unknown keys by default; `strip` discards them, `allow` retains them. Counts keys on the parsed object.                                                                            |

All helpers default to `required: true`, `nullable: false`, and `label: 'This field'`. Optional values permit omission without accepting null or converting blank strings to undefined. Text trimming defaults to true. Explicit `min: 0` or `length: 0` permits an empty generic string. Supplied optional emails, URLs, dates and datetimes still require valid formats.

Numeric coercion follows Zod's `Number()` conversion (so empty text and booleans can become numbers), then checks finiteness and constraints. Presence is checked first: null requires `nullable: true` and undefined requires optionality or a default.

`default` accepts an output value and is used only for undefined input. Defaults are validated at helper construction and normalized through the schema on every parse, including refinements. Invalid defaults or configuration throw `TypeError` with an `Invalid Zod helper configuration` prefix. Do not configure `default: undefined`. Numeric and boolean defaults must already have their output type, even with coercion enabled.

Bounds are inclusive. Length/count options require nonnegative safe integers. Regex strings contain a pattern without slash delimiters; regexes are compiled once. Global/sticky flags are removed from a cloned RegExp so repeated parsing is deterministic and the caller's regex is not mutated. Unsupported options/message categories and contradictory bounds throw configuration errors.

`message` can be one string for every helper-generated issue, or a partial map of the helper's relevant categories. Missing categories use the label and constraint bound. Container overrides do not replace child field/item messages. Configured synchronous refinements run on normalized, present, non-null values under normal Zod execution rules. A rule takes `check`, optional `message` and optional `path`; `superRefine(value, ctx)` can add multiple issues. Promise-returning callbacks are rejected, including during async parsing. Async business validation belongs outside these helpers.

Configured refinement message priority: helper string, explicit rule/issue message, `message.refine`, `message.invalid`, then the generated condition message. Issue codes, paths and other metadata are retained. Native checks added after helper creation keep their own messages.

`LoginSchema` retains its export and `LoginDto`, strips unknown keys, trims email without lowercasing, preserves password whitespace, and retains its missing/empty/email business messages. Only generic errors for incorrectly typed values intentionally change to the helpers' text/email messages. Form rendering, field names, resolver and submission remain unchanged.

Run the single consolidated suite with `npm test`; `npm run typecheck` also checks its inference assertions and compile-time rejection examples. The suite includes the existing Zod form resolver and comparison with the previous login schema. Vitest uses a separate Node configuration so frontend plugins do not affect helper tests.
