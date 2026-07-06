import { enrichExercises } from "./enrich";
import { TS_PRIMITIVOS_EVERYDAY } from "./ts-primitivos";
import { TS_INTERFACES_EVERYDAY } from "./ts-interfaces";
import { TS_TYPES_EVERYDAY } from "./ts-types";
import { TS_FUNCIONES_EVERYDAY } from "./ts-funciones";
import { TS_GENERICS_EVERYDAY } from "./ts-generics";
import { TS_ENUMS_EVERYDAY } from "./ts-enums";
import { TS_DISCRIMINATED_EVERYDAY } from "./ts-discriminated";
import { TS_UTILITY_TYPES_EVERYDAY } from "./ts-utility-types";
import { TS_ARRAYS_MAP_EVERYDAY } from "./ts-arrays-map";
import { TS_ARRAYS_FILTER_EVERYDAY } from "./ts-arrays-filter";
import { TS_ARRAYS_REDUCE_EVERYDAY } from "./ts-arrays-reduce";
import { TS_ARRAYS_FIND_EVERYDAY } from "./ts-arrays-find";
import { TS_ARRAYS_SOME_EVERY_EVERYDAY } from "./ts-arrays-some-every";
import { TS_ARRAYS_SORT_EVERYDAY } from "./ts-arrays-sort";
import { TS_ARRAYS_EXTRAS_EVERYDAY } from "./ts-arrays-extras";

import type { Exercise } from "@/lib/types";
import { TS_PRIMITIVOS } from "../modules/ts-primitivos";
import { TS_INTERFACES } from "../modules/ts-interfaces";
import { TS_TYPES } from "../modules/ts-types";
import { TS_FUNCIONES } from "../modules/ts-funciones";
import { TS_GENERICS } from "../modules/ts-generics";
import { TS_ENUMS } from "../modules/ts-enums";
import { TS_DISCRIMINATED } from "../modules/ts-discriminated";
import { TS_UTILITY_TYPES } from "../modules/ts-utility-types";
import { TS_ARRAYS_MAP } from "../modules/ts-arrays-map";
import { TS_ARRAYS_FILTER } from "../modules/ts-arrays-filter";
import { TS_ARRAYS_REDUCE } from "../modules/ts-arrays-reduce";
import { TS_ARRAYS_FIND } from "../modules/ts-arrays-find";
import { TS_ARRAYS_SOME_EVERY } from "../modules/ts-arrays-some-every";
import { TS_ARRAYS_SORT } from "../modules/ts-arrays-sort";
import { TS_ARRAYS_EXTRAS } from "../modules/ts-arrays-extras";

export const TS_PRIMITIVOS_ENRICHED = enrichExercises(
  TS_PRIMITIVOS,
  TS_PRIMITIVOS_EVERYDAY,
);
export const TS_INTERFACES_ENRICHED = enrichExercises(
  TS_INTERFACES,
  TS_INTERFACES_EVERYDAY,
);
export const TS_TYPES_ENRICHED = enrichExercises(TS_TYPES, TS_TYPES_EVERYDAY);
export const TS_FUNCIONES_ENRICHED = enrichExercises(
  TS_FUNCIONES,
  TS_FUNCIONES_EVERYDAY,
);
export const TS_GENERICS_ENRICHED = enrichExercises(
  TS_GENERICS,
  TS_GENERICS_EVERYDAY,
);
export const TS_ENUMS_ENRICHED = enrichExercises(TS_ENUMS, TS_ENUMS_EVERYDAY);
export const TS_DISCRIMINATED_ENRICHED = enrichExercises(
  TS_DISCRIMINATED,
  TS_DISCRIMINATED_EVERYDAY,
);
export const TS_UTILITY_TYPES_ENRICHED = enrichExercises(
  TS_UTILITY_TYPES,
  TS_UTILITY_TYPES_EVERYDAY,
);
export const TS_ARRAYS_MAP_ENRICHED = enrichExercises(
  TS_ARRAYS_MAP,
  TS_ARRAYS_MAP_EVERYDAY,
);
export const TS_ARRAYS_FILTER_ENRICHED = enrichExercises(
  TS_ARRAYS_FILTER,
  TS_ARRAYS_FILTER_EVERYDAY,
);
export const TS_ARRAYS_REDUCE_ENRICHED = enrichExercises(
  TS_ARRAYS_REDUCE,
  TS_ARRAYS_REDUCE_EVERYDAY,
);
export const TS_ARRAYS_FIND_ENRICHED = enrichExercises(
  TS_ARRAYS_FIND,
  TS_ARRAYS_FIND_EVERYDAY,
);
export const TS_ARRAYS_SOME_EVERY_ENRICHED = enrichExercises(
  TS_ARRAYS_SOME_EVERY,
  TS_ARRAYS_SOME_EVERY_EVERYDAY,
);
export const TS_ARRAYS_SORT_ENRICHED = enrichExercises(
  TS_ARRAYS_SORT,
  TS_ARRAYS_SORT_EVERYDAY,
);
export const TS_ARRAYS_EXTRAS_ENRICHED = enrichExercises(
  TS_ARRAYS_EXTRAS,
  TS_ARRAYS_EXTRAS_EVERYDAY,
);

/** Aplica enriquecimiento cotidiano a cualquier lista de ejercicios TS. */
export function enrichTsModule(
  exercises: Exercise[],
  enrichments: import("./enrich").EnrichmentMap,
): Exercise[] {
  return enrichExercises(exercises, enrichments);
}
