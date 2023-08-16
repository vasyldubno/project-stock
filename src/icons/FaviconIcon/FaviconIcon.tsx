import s from "./styles.module.scss";

export const FaviconIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      id="Layer_1"
      data-name="Layer 1"
    >
      <polyline className={s.cls__1} points="20 8.5 20 22.5 4 22.5 4 8.5" />
      <polyline className={s.cls__1} points="23 10.5 12 1.5 1 10.5" />
      <path
        className={s.cls__1}
        d="M8,17.5h5a2,2,0,0,0,2-2h0a2,2,0,0,0-2-2H11a2,2,0,0,1-2-2H9a2,2,0,0,1,2-2h5"
      />
      <line className={s.cls__1} x1="12" y1="6.5" x2="12" y2="9.5" />
      <line className={s.cls__1} x1="12" y1="20.5" x2="12" y2="17.5" />
    </svg>
  );
};
