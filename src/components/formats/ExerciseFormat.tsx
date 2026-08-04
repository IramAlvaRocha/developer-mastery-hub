import type { FormatBaseProps } from "./FormatTypes";
import PredictionFormat from "./PredictionFormat";
import OrderingFormat from "./OrderingFormat";
import SnippetPickFormat from "./SnippetPickFormat";
import BugHuntFormat from "./BugHuntFormat";
import MatchingFormat from "./MatchingFormat";
import ContextDropdownFormat from "./ContextDropdownFormat";
import TrueFalseFormat from "./TrueFalseFormat";

/** Despacha el render según el formato interactivo del ejercicio. */
export default function ExerciseFormat(props: FormatBaseProps) {
  switch (props.exercise.format) {
    case "prediction":
      return <PredictionFormat {...props} />;
    case "ordering":
      return <OrderingFormat {...props} />;
    case "snippet-pick":
      return <SnippetPickFormat {...props} />;
    case "bug-hunt":
      return <BugHuntFormat {...props} />;
    case "matching":
      return <MatchingFormat {...props} />;
    case "context-dropdown":
      return <ContextDropdownFormat {...props} />;
    case "true-false":
      return <TrueFalseFormat {...props} />;
    default:
      return null;
  }
}
