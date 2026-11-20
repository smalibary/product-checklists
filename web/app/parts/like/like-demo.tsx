"use client";

import { Swap } from "../../components/checklist-layer/swap";
import { LikeButton } from "../../components/kit/like";

// The kit like button, one demo per checklist item.
export function LikeDemo() {
  return (
    <div className="pt">
      <div className="pt-grid">
        <div className="pt-card">
          <p className="pt-cap">Reaction</p>
          <Swap item={1} good={<LikeButton />} broken={<LikeButton pop={false} />} />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Count</p>
          <Swap item={2} good={<LikeButton count={24} />} broken={<LikeButton />} />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Keyboard ring</p>
          <Swap
            item={3}
            good={<LikeButton force="focus" defaultOn />}
            broken={
              <span className="pl-nofocus">
                <LikeButton defaultOn />
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
