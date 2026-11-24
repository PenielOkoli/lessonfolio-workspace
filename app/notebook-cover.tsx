export function NotebookCover() {
  return (
    <div aria-hidden="true" className="coverArt">
      <div className="ruler" />
      <div className="folioBook">
        <div className="bookSpine" />
        <div className="bookPlate">
          <i className="quarter" /><i className="lines" />
          <i className="circle" /><i className="quarter reverse" />
        </div>
        <div className="bookElastic" />
        <div className="ribbon" />
      </div>
      <div className="pencil" />
    </div>
  );
}
