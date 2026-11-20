"use client";

import { useState } from "react";
import { Button } from "../../components/kit/button";
import { FormLayout, TextField } from "../../components/kit/field";

// The kit's form: a visible label, one field, and the main button at the end.
export function SearchForm() {
  const [message, setMessage] = useState("");

  return (
    <div className="ex-search" role="search">
      <FormLayout
        label="Search this site"
        summary={false}
        actions={<Button type="submit" kind="primary">Search</Button>}
        onSent={(data) => setMessage(`On a real site this would search for: ${String(data.get("q") ?? "") || "(empty)"}`)}
      >
        <TextField label="Search this site" name="q" type="search" placeholder="Search" />
      </FormLayout>
      <output className="ex-report ex-output">{message}</output>
    </div>
  );
}
