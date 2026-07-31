import { useState } from "react";
import { IconHeadset } from "@/components/AppIcons";
import { AGENT_SUPPORT } from "@/config/agent-support";

/** Help FAB P0 — modal kênh người (AI sau). */
export function AgentHelpFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="agent-help-fab"
        aria-label="Cần trợ giúp"
        onClick={() => setOpen(true)}
      >
        <IconHeadset size={26} />
      </button>
      {open ? (
        <div
          className="agent-help-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="agent-help-modal"
            role="dialog"
            aria-labelledby="agent-help-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="agent-help-modal-ico" aria-hidden>
              <IconHeadset size={28} />
            </div>
            <h2 id="agent-help-title">Cần trợ giúp?</h2>
            <p>Chọn kênh hỗ trợ đối tác (P0 — AI bổ sung sau)</p>
            <div className="agent-help-rows">
              <a href={`tel:${AGENT_SUPPORT.phoneTel}`}>
                Số điện thoại · {AGENT_SUPPORT.phoneDisplay}
              </a>
              <a href={`mailto:${AGENT_SUPPORT.email}`}>Email hỗ trợ</a>
              <a href={AGENT_SUPPORT.zaloUrl} target="_blank" rel="noreferrer">
                Zalo OA
              </a>
            </div>
            <button
              type="button"
              className="btn agent-help-close"
              onClick={() => setOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
