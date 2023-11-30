export default function Step(props: {
  stepId: number;
  checked: boolean;
  handleToggle: () => void;
}) {
  const { stepId, checked, handleToggle } = props;
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={handleToggle} />
      <span>{stepId + 1}</span>
      <div></div>
    </label>
  );
}
