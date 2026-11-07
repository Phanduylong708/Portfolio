import { useEffect, useRef, useState } from "react";

export const CONTACT_FIELDS = ["name", "email", "subject", "message"];
export const MESSAGE_MIN_LENGTH = 20;
const SUBMIT_DELAY_MS = 1500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = { name: "", email: "", subject: "", message: "" };

// Returns an error descriptor per field ({ key, vars }) so the page can translate it.
export function validateContact(values) {
  const errors = {};
  for (const field of CONTACT_FIELDS) {
    if (!values[field].trim()) errors[field] = { key: "required" };
  }
  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = { key: "email" };
  }
  const length = values.message.trim().length;
  if (!errors.message && length < MESSAGE_MIN_LENGTH) {
    errors.message = { key: "messageMin", vars: { min: MESSAGE_MIN_LENGTH, count: length } };
  }
  return errors;
}

// status: "idle" | "submitting" | "success". Errors appear after a field is left or on submit,
// then update live while the user corrects them.
export function useContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");
  const [submittedName, setSubmittedName] = useState("");
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const errors = validateContact(values);
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field]),
  );

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const onBlur = (e) => setTouched((tch) => ({ ...tch, [e.target.name]: true }));

  // Returns the first invalid field name (for focus), or null once submission starts.
  const submit = () => {
    if (status === "submitting") return null;
    setTouched(Object.fromEntries(CONTACT_FIELDS.map((f) => [f, true])));
    const firstInvalid = CONTACT_FIELDS.find((f) => errors[f]);
    if (firstInvalid) return firstInvalid;
    setStatus("submitting");
    // Mock network request.
    timer.current = setTimeout(() => {
      setSubmittedName(values.name.trim());
      setStatus("success");
      setValues(EMPTY);
      setTouched({});
    }, SUBMIT_DELAY_MS);
    return null;
  };

  const startOver = () => setStatus("idle");

  return { values, errors: visibleErrors, status, submittedName, onChange, onBlur, submit, startOver };
}
