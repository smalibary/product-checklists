"use client";

import { ArrowDown, DownloadSimple, X } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Button, ButtonGroup } from "../../components/kit/button";
import { Link } from "../../components/kit/link";
import { ButtonStates } from "./button-states";

const odd = (label: string, d: string) => (
  <span className="nv nv-btn" data-odd={d}>
    {label}
  </span>
);

// The kit button, one demo per checklist item. Each has a plain "broken" look for when it is unticked.
export function ButtonDemo() {
  return (
    <div className="pt">
      <div className="pt-box">
        <p className="pt-cap">Kinds</p>
        <Swap
          item={1}
          good={
            <div className="pt-row">
              <Button kind="primary">Primary</Button>
              <Button kind="secondary">Secondary</Button>
              <Button kind="quiet">Tertiary</Button>
              <Button kind="danger">Danger</Button>
            </div>
          }
          broken={
            <div className="pt-row">
              {odd("Default", "")}
              {odd("Gold", "a")}
              {odd("Blue", "b")}
              {odd("Dashed", "c")}
              {odd("Other", "a")}
              {odd("More", "b")}
            </div>
          }
        />
      </div>

      <div className="pt-grid">
        <div className="pt-card">
          <p className="pt-cap">One main button, placed last</p>
          <Swap
            item={2}
            good={
              <ButtonGroup label="Form actions" align="end">
                <Button kind="quiet">Cancel</Button>
                <Button kind="primary">Save</Button>
              </ButtonGroup>
            }
            broken={
              <ButtonGroup label="Form actions" align="end">
                <Button kind="primary">Cancel</Button>
                <Button kind="primary">Save</Button>
                <Button kind="primary">Save and close</Button>
              </ButtonGroup>
            }
          />
          <Swap
            item={15}
            good={
              <ButtonGroup label="Dialog actions" align="end">
                <Button kind="secondary">Cancel</Button>
                <Button kind="primary">Save</Button>
              </ButtonGroup>
            }
            broken={
              <ButtonGroup label="Dialog actions" align="end">
                <Button kind="primary">Save</Button>
                <Button kind="secondary">Cancel</Button>
              </ButtonGroup>
            }
          />
        </div>

        <div className="pt-card">
          <p className="pt-cap">Danger, and button or link</p>
          <Swap item={3} good={<Button kind="danger">Delete project</Button>} broken={<Button kind="primary">Delete project</Button>} />
          <Swap
            item={4}
            good={
              <div className="pt-row">
                <Button kind="secondary">Save changes</Button>
                <Link href="#guide">Read the guide</Link>
              </div>
            }
            broken={
              <div className="pt-row">
                <a className="nv nv-btn" href="#save">
                  Save changes
                </a>
                <Link href="#guide">Read the guide</Link>
              </div>
            }
          />
        </div>

        <div className="pt-card">
          <p className="pt-cap">Words and icons</p>
          <Swap item={5} good={<Button kind="secondary">Send invoice</Button>} broken={odd("OK", "")} />
          <Swap item={6} good={<Button kind="secondary">Save changes</Button>} broken={odd("click here to save your changes now", "")} />
          <Swap
            item={7}
            good={
              <div className="pt-row">
                <Button kind="secondary" icon={<DownloadSimple size={18} aria-hidden="true" />}>
                  Download
                </Button>
                <Button kind="quiet" icon={<X size={18} aria-hidden="true" />} label="Close" />
              </div>
            }
            broken={
              <span className="nv nv-btn">
                <ArrowDown size={14} aria-hidden="true" />
              </span>
            }
          />
        </div>

        <div className="pt-card">
          <p className="pt-cap">Size, contrast, looks pressable</p>
          <Swap
            item={8}
            good={
              <div className="pt-row">
                <Button kind="secondary" size="sm">Small</Button>
                <Button kind="secondary" size="md">Medium</Button>
                <Button kind="secondary" size="lg">Large</Button>
              </div>
            }
            broken={
              <div className="pt-row">
                {odd("Small", "")}
                {odd("Medium", "a")}
                {odd("Large", "b")}
              </div>
            }
          />
          <Swap
            item={9}
            good={
              <div className="pt-row">
                <Button kind="primary">Continue</Button>
                <Button kind="secondary">Back</Button>
              </div>
            }
            broken={
              <div className="pt-row">
                <span className="nv nv-btn" data-pale="">Continue</span>
                <span className="nv nv-btn" data-pale="">Back</span>
              </div>
            }
          />
          <Swap
            item={10}
            good={<Button kind="primary">Buy now</Button>}
            broken={<span className="nv nv-btn" data-plain="">Buy now</span>}
          />
        </div>
      </div>

      <ButtonStates />
    </div>
  );
}
