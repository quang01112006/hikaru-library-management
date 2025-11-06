import "./Button.css";
export default function Button({
  onClick,
  className,
  btnName,
  type = "button",
}) {
  return (
    <>
      <button onClick={onClick} className={className} type={type}>
        {btnName}
      </button>
    </>
  );
}
