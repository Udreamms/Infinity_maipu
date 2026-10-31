export function Hero() {
  return (
    <>
      <section className="hero" id="inicio">
        <div className="in">
          <span className="eyebrow">Fútbol 7 y Fútbol 9 · Maipú</span>
          <h1>Reserva tu cancha en <span>30 segundos</span></h1>
          <p className="sub">Elige la hora, paga y la cancha es tuya. Después compartes un link y cada jugador ve cuánto le toca y te paga su parte.</p>
          <div className="row"><a className="btn" href="#reservar">Reservar cancha</a><a className="btn ghost" href="#celebra">Celebraciones</a></div>
          <div className="chips"><span>Garantía Equipo Completo</span><span>Boleta automática</span></div>
          <span className="hint">Desliza · vuela la cámara</span>
        </div>
      </section>
    </>
  );
}
