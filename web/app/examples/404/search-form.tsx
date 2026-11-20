"use client";

import { useState } from "react";
import { Button } from "@ui-sdk/react/button";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";

export function SearchForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      className="ex-search"
      role="search"
      data-item="5"
      onSubmit={(event) => {
        event.preventDefault();
        const q = String(new FormData(event.currentTarget).get("q") ?? "");
        setMessage(`On a real site this would search for: ${q || "(empty)"}`);
      }}
    >
      <Field>
        <FieldLabel className="sr">Search this site</FieldLabel>
        <Input type="search" name="q" placeholder="Search" />
      </Field>
      <Button type="submit" data-variant="solid">
        Search
      </Button>
      <output className="ex-report ex-output">{message}</output>
    </form>
  );
}
