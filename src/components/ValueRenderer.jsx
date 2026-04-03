import { getValueType, getTypeColorClass } from "../utils/typeUtils";

export default function ValueRenderer({ value }) {
  const type = getValueType(value);
  const colorClass = getTypeColorClass(type);

  switch (type) {
    case "string":
      return (
        <span className={colorClass}>
          "<span className="select-all">{value}</span>"
        </span>
      );
    case "number":
      return <span className={colorClass}>{value}</span>;
    case "boolean":
      return <span className={colorClass}>{value ? "true" : "false"}</span>;
    case "null":
      return <span className={`${colorClass} italic`}>null</span>;
    default:
      return null;
  }
}
