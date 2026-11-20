"use client";

import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Variants } from "../../components/checklist-layer/swap";
import { Button, ButtonGroup, type ButtonKind } from "../../components/kit/button";
import { FormMessage, TextField } from "../../components/kit/field";
import { ModalCard } from "../../components/kit/dialog";
import type { Spots } from "../../components/kit/part";

export type Kind = "delete" | "edit" | "terms";

// [safe button, other button] for each case: first the names that say the action, then OK and Cancel.
const LABELS: Record<Kind, [[string, string], [string, string]]> = {
  delete: [["Keep project", "Delete project"], ["Cancel", "OK"]],
  edit: [["Keep editing", "Discard changes"], ["Cancel", "OK"]],
  terms: [["Decline", "Accept terms"], ["Cancel", "OK"]],
};

// Items 7 (named buttons) and 8 (safe choice clear, dangerous one styled) share one spot, so all
// four combinations are drawn in the same place and the row never moves.
function Actions({ kind, onDone }: { kind: Kind; onDone: () => void }) {
  const { isMet } = useMet();
  const row = (named: boolean, styled: boolean) => {
    const [safe, other] = LABELS[kind][named ? 0 : 1];
    const second: ButtonKind = styled ? (kind === "terms" ? "primary" : "danger") : "secondary";
    return (
      <ButtonGroup label="Window buttons" align="end">
        <Button kind="secondary" onClick={onDone}>
          {safe}
        </Button>
        <Button kind={second} onClick={onDone}>
          {other}
        </Button>
      </ButtonGroup>
    );
  };
  const key = `${isMet(7) ? 1 : 0}${isMet(8) ? 1 : 0}`;
  return (
    <Variants
      item="7 8"
      active={key}
      parts={{ "11": row(true, true), "10": row(true, false), "01": row(false, true), "00": row(false, false) }}
    />
  );
}

const TITLE_BAD = { title: <h2 className="kit-mtitle">Are you sure?</h2> };
const SPOTS: Spots = { title: 5, close: 11 };

export function DeleteCard({ onDone }: { onDone: () => void }) {
  const { isMet } = useMet();
  return (
    <ModalCard
      title="Delete project “Lorem ipsum”?"
      onClose={onDone}
      named={isMet(21)}
      spots={SPOTS}
      brokens={TITLE_BAD}
      actions={<Actions kind="delete" onDone={onDone} />}
      scroll={isMet(6)}
    >
      <p>
        This removes the project and its 12 files for everyone on it. You can restore it from the
        bin for 30 days.
      </p>
    </ModalCard>
  );
}

export function EditCard({ onDone }: { onDone: () => void }) {
  const { isMet } = useMet();
  return (
    <ModalCard
      title="Rename project"
      onClose={onDone}
      named={isMet(21)}
      spots={SPOTS}
      brokens={TITLE_BAD}
      actions={<Actions kind="edit" onDone={onDone} />}
    >
      <TextField name="project-name" label="Project name" defaultValue="Lorem ipsum, new name" />
      <Collapse n={15} open={isMet(15)}>
        <FormMessage>You have unsaved changes. If you close now, your new name will be lost.</FormMessage>
      </Collapse>
    </ModalCard>
  );
}

const PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
];

export function TermsCard({ onDone }: { onDone: () => void }) {
  const { isMet } = useMet();
  return (
    <ModalCard
      title="Updated terms of use"
      onClose={onDone}
      named={isMet(21)}
      spots={SPOTS}
      brokens={TITLE_BAD}
      actions={<Actions kind="terms" onDone={onDone} />}
      scroll={isMet(6)}
      bodySpot={6}
    >
      {PARAGRAPHS.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </ModalCard>
  );
}
