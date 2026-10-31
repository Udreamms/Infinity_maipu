export function Booking() {
  return (
    <>
      <section className="blk" id="reservar">
        <div className="in">
          <div className="head"><div><span className="eyebrow">Horarios en vivo</span><h2>Arma tu partido</h2></div><p>Lunes a viernes de 18:00 a 23:00. Sábado y domingo de 13:00 a 21:00. Disponibilidad de ejemplo.</p></div>
          <div className="panel quick" id="quick"></div>
          <p className="quick-or">O elige tú:</p>
          <div className="book">
            <div className="panel ctrl">
              <div className="g"><h3>1 · Tipo de cancha</h3><div className="g two" id="tipos"></div></div>
              <div className="g"><h3>2 · Día</h3><div className="g days" id="dias"></div></div>
              <div className="g"><h3>3 · Hora</h3><div className="g hours" id="horas"></div><p className="quedan" id="quedan"></p></div>
              <div className="g"><h3>4 · ¿Cuántos juegan?</h3>
                <div className="stepper"><button type="button" id="menos" aria-label="Un jugador menos">−</button><output id="njug" aria-live="polite">14</output><button type="button" id="mas" aria-label="Un jugador más">+</button></div>
                <p className="fine">Sin límite: pueden ser los que quieran.</p>
              </div>
              <label className="bump" htmlFor="bump"><input type="checkbox" id="bump" /><span><b>Suma el Tercer Tiempo por $10.000</b> (antes $20.000)<small>Quincho con parrilla para ustedes, 14 bebidas heladas de la cafetería y 10% de descuento en tu siguiente arriendo. Mínimo 2 horas.</small></span></label>
            </div>
            <aside className="panel sum" aria-live="polite">
              <h3>Tu reserva</h3>
              <div className="big" id="parte">$0<small> por jugador</small></div>
              <dl id="lineas"></dl>
              <button className="btn" id="go" type="button" disabled>Elige una hora</button>
              <p className="status" id="status" role="status"></p>
              <p className="fine">Tú pagas la cancha completa y cobras a tu equipo con un link. Cada jugador ve cuánto le toca.</p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
