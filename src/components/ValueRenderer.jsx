import { getValueType, getTypeColorClass } from "../utils/typeUtils";
import HighlightText from "./HighlightText";

export default function ValueRenderer({ value, searchQuery = "" }) {
  const type = getValueType(value);
  const colorClass = getTypeColorClass(type);

  switch (type) {
    case "string":
      return (
        <span className={colorClass}>
          "<HighlightText text={value} query={searchQuery} />"
        </span>
      );
    case "number":
      return (
        <span className={colorClass}>
          <HighlightText text={String(value)} query={searchQuery} />
        </span>
      );
    case "boolean":
      return (
        <span className={colorClass}>
          <HighlightText text={value ? "true" : "false"} query={searchQuery} />
        </span>
      );
    case "null":
      return <span className={`${colorClass} italic`}>null</span>;
    default:
      return null;
  }
}
