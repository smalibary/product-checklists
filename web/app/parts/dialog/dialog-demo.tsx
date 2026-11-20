"use client";

import { useState } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { Button, ButtonGroup } from "../../components/kit/button";
import { Modal, ModalCard, ModalClose, ModalStage } from "../../components/kit/dialog";

const TEXT = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
];

const behind = (open: () => void) => (
  <div className="pt-behind">
    <h3>Projects</h3>
    <Button kind="secondary" size="sm" data-opener onClick={open}>
      Show terms
    </Button>
  </div>
);

// The kit dialog: one window drawn on the page for the layer, and the real one behind a button.
export function DialogDemo() {
  const { isMet } = useMet();
  const [open, setOpen] = useState(true);
  const done = () => setOpen(false);
  const actions = (
    <ButtonGroup label="Window buttons" align="end">
      <Button kind="secondary" onClick={done}>
        Decline
      </Button>
      <Button kind="primary" onClick={done}>
        Accept terms
      </Button>
    </ButtonGroup>
  );
  return (
    <div className="pt">
      <div className="pt-box">
        <p className="pt-cap">Drawn on the page, with the page behind dimmed</p>
        <div className="pt-frame">
          <ModalStage
            open={open}
            page={behind(() => setOpen(true))}
            place={isMet(5) ? "center" : "wide"}
            dim={isMet(3)}
            unbounded={!isMet(4)}
            tall
            dimSpot={3}
            cardSpot={5}
            onEscape={done}
            onBackdrop={done}
          >
            <ModalCard
              title="Updated terms of use"
              onClose={done}
              actions={actions}
              scroll={isMet(4)}
              bodySpot={4}
              spots={{ title: 1, close: 2 }}
              brokens={{ title: <h2 className="kit-mtitle">Are you sure?</h2> }}
            >
              {TEXT.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </ModalCard>
          </ModalStage>
        </div>
      </div>
      <div className="pt-box">
        <p className="pt-cap">The real dialog</p>
        <p className="pt-note">
          Built on the browser&apos;s own dialog: focus moves in and stays inside, Escape and a press on
          the backdrop close it, the page behind is inert, and focus returns to this button.
        </p>
        <div className="pt-row">
          <Modal
            opener="Open the real dialog"
            title="Delete project “Lorem ipsum”?"
            actions={
              <ButtonGroup label="Window buttons" align="end">
                <ModalClose>Keep project</ModalClose>
                <ModalClose kind="danger">Delete project</ModalClose>
              </ButtonGroup>
            }
          >
            <p>This removes the project and its 12 files. You can restore it from the bin for 30 days.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}
