export function WordResult({result}: {result: string}): React.JSX.Element {
  return result == "" ? (
    <></>
  ) : (
    <div id="wordResult" className="fadeOut">
      {result}
    </div>
  );
}
