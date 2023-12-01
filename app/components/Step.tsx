export default function Step(props: {
  stepId: number;
  checked: boolean;
  handleToggle: () => void;
  active: boolean;
}) {
  const { stepId, checked, handleToggle, active } = props;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleToggle();
  };

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e)} />
      <span>{stepId + 1}</span>
      <div
        className={active ? "active" : ""}
        style={{ backgroundColor: active ? "red" : "gray" }}
      ></div>
    </label>
  );
}
