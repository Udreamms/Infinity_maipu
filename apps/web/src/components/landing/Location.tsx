export function Location() {
  return (
    <>
      <section className="blk">
        <div className="in">
          <div className="where">
            <div className="panel"><span className="eyebrow">Cómo llegar</span><p style={{ fontFamily: "var(--f-brand)", fontSize: "13px", letterSpacing: ".2em" }}>INFINITY MAIPÚ · CANCHAS - QUINCHO - CAFETERÍA</p><address>4 Poniente 200, Maipú<br />Región Metropolitana, Chile</address>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a className="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=4+Poniente+200+Maip%C3%BA+Chile">Abrir en Google Maps</a>
                <a className="btn sm" target="_blank" rel="noopener" href="https://waze.com/ul?q=4%20Poniente%20200%20Maip%C3%BA">Ir con Waze</a>
              </div>
            </div>
            <div className="panel" style={{ padding: "36px", display: "grid", gap: "10px", alignContent: "center" }}><span className="eyebrow">Horarios</span><p style={{ fontSize: "20px" }}>Lunes a viernes<br /><b>18:00 a 23:00</b></p><p style={{ fontSize: "20px" }}>Sábado y domingo<br /><b>13:00 a 21:00</b></p></div>
          </div>
        </div>
      </section>
    </>
  );
}
