export function Club() {
  return (
    <>
      <section className="blk" id="club">
        <div className="in">
          <div className="head"><div><span className="eyebrow">Club Infinity</span><h2>Tu club de fútbol en Maipú</h2></div><p>Descuentos de socio, puntos que canjeas por cancha, cafetería y cumpleaños, y tu equipo siempre conectado.</p></div>
          <div className="club-land">
            <article className="big-card"><span className="eyebrow">Hazte socio gratis</span><h3>Tus beneficios parten desde el primer partido</h3><p>Entra con tu celular: ve tus partidos, quién te pagó, tu Hora Fija y pide a la cafetería. Sin costo y sin tarjeta.</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}><button type="button" className="btn" id="clubCta" data-act="open-club">Hazte socio gratis</button><button type="button" className="btn ghost" id="clubCta2" data-act="open-club" data-v="entrar">Ya soy socio</button></div></article>
            <div className="panel perks">
              <div><b>Pago dividido</b><span>Cada jugador paga su parte con un link.</span></div>
              <div><b>Partidos abiertos</b><span>Si no tienes equipo, súmate a un partido y paga solo tu parte.</span></div>
              <div><b>Puntos y ranking</b><span>Suma puntos por jugar y canjéalos por cancha, bebidas y cumpleaños.</span></div>
              <div><b>Cafetería sin fila</b><span>Pide antes del partido y retira con tu código.</span></div>
              <div><b>Hora Fija para capitanes</b><span>Tu hora asegurada cada semana con 20% menos.</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
