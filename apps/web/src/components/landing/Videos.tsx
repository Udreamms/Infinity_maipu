export function Videos() {
  return (
    <>
      <section className="blk" id="videos">
        <div className="in">
          <div className="head"><div><span className="eyebrow">Videos reales</span><h2>Así se vive Infinity</h2></div></div>
          <div className="vids">
            <figure><video src="/media/infinity-video2.mp4" poster="/media/infinity-poster2.jpg" controls playsInline preload="metadata"></video><figcaption>Ven a jugar con nosotros</figcaption></figure>
            <figure><video src="/media/infinity-video1.mp4" poster="/media/infinity-poster1.jpg" controls playsInline preload="metadata"></video><figcaption>Nuestras canchas al atardecer</figcaption></figure>
            <figure><video src="/media/infinity-video3.mp4" poster="/media/infinity-poster3.jpg" controls playsInline preload="metadata"></video><figcaption>Partidos todos los fines de semana</figcaption></figure>
          </div>
        </div>
      </section>
    </>
  );
}
