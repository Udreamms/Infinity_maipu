export function Faq() {
  return (
    <>
      <section className="blk" id="preguntas">
        <div className="in">
          <div className="head"><div><span className="eyebrow">Resolvemos tus dudas</span><h2>Preguntas frecuentes</h2></div></div>
          <div className="faq-grid">
            <div className="faq"><h3>Canchas</h3>
              <details className="panel"><summary>¿Qué pasa si alguien de mi equipo no paga?</summary><p>La cancha ya está pagada desde que reservas, así que el partido nunca se cae. Con el link ves quién te pagó y le recordamos por WhatsApp a quien le falte.</p></details>
              <details className="panel"><summary>¿Qué pasa si no conseguimos suficientes jugadores?</summary><p>Si 24 horas antes faltan jugadores, publicamos tu partido para que otros se sumen. Si no se completa, podrás reprogramar gratis para otra fecha disponible.</p></details>
              <details className="panel"><summary>¿Qué pasa si llueve?</summary><p>Si las condiciones permiten jugar, el partido sigue en pie. Si suspendemos la reserva por motivos climáticos, podrás reprogramarla sin costo, según la disponibilidad de la cancha.</p></details>
              <details className="panel"><summary>¿Cómo puedo pagar mi reserva?</summary><p>Puedes pagar con Webpay, tarjeta o transferencia bancaria, según las opciones disponibles. Recibirás tu comprobante de pago automáticamente.</p></details>
              <details className="panel"><summary>¿Puedo unirme a un partido si no tengo equipo?</summary><p>¡Sí! Explora los partidos publicados, encuentra uno que se adapte a tu horario y únete para jugar con otras personas.</p></details>
              <details className="panel"><summary>¿Arriendan para cumpleaños?</summary><p>Sí: cancha, quincho y zona de eventos en un solo pack. Mira la sección de celebraciones más arriba.</p></details>
            </div>
            <div className="faq"><h3>Celebraciones</h3>
              <details className="panel"><summary>¿Puedo poner inflables o música?</summary><p>Sí, la zona multiuso tiene electricidad.</p></details>
              <details className="panel"><summary>¿Cuántas personas caben?</summary><p>Hay mesas y sillas para 40. Para más de 60 personas, pide una cotización de evento grande.</p></details>
              <details className="panel"><summary>¿Cómo se paga?</summary><p>Reservas con el 50% de abono. La boleta llega automáticamente.</p></details>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
