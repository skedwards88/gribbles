export default function Score({
  foundWordCount,
  bonusWordCount,
  maxWordCount,
}: {
  foundWordCount: number;
  bonusWordCount: number | null;
  maxWordCount: number;
}): React.JSX.Element {
  return (
    <div>
      <div>Left: {maxWordCount - foundWordCount + (bonusWordCount ?? 0)}</div>
      {bonusWordCount !== null ? <div>Bonus: {bonusWordCount}</div> : <></>}
    </div>
  );
}
