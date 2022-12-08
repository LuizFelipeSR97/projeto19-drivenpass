import { ApplicationError } from "@/protocols";

export function duplicatedTitleError(): ApplicationError {
  return {
    name: "DuplicatedTitleError",
    message: "This title is already in use.",
  };
}
