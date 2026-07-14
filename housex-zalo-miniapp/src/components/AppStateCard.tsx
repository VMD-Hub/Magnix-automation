type Props = {
  title?: string;
  message: string;
  onRetry?: () => void;
  busy?: boolean;
};

/** Empty / network error — dạng card app, không chữ đỏ trần. */
export function AppStateCard({
  title = "Không tải được",
  message,
  onRetry,
  busy,
}: Props) {
  return (
    <div className="app-state-card" role="alert">
      <div className="app-state-icon" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8v5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
          <path
            d="M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <p className="app-state-title">{title}</p>
      <p className="app-state-message">{message}</p>
      {onRetry ? (
        <button
          type="button"
          className="btn app-state-retry"
          onClick={onRetry}
          disabled={busy}
        >
          {busy ? "Đang thử lại…" : "Thử lại"}
        </button>
      ) : null}
    </div>
  );
}
