import { Fragment } from "react";

// Renders "\n" in dictionary strings as line breaks.
export default function Lines({ text }) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}
