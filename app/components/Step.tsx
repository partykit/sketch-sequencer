export default function Step(props: {
  stepId: number;
  checked: boolean;
  handleToggle: () => void;
}) {
  const { stepId, checked, handleToggle } = props;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleToggle();
  };

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e)} />
      <span>{stepId + 1}</span>
      <div></div>
    </label>
  );
}
