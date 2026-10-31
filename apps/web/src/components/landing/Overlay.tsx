export function Overlay() {
  return (
    <>
      <div className="ov" id="ov" role="dialog" aria-modal="true" aria-labelledby="ovT" hidden>
      <div className="ov-bar"><a className="logo" href="#inicio" data-act="close"><img src="/media/logo-infinity.png" alt="" />INFINITY<b>MAIPÚ</b></a><div className="ov-step" id="ovStep"></div><button type="button" className="ov-x" id="ovX" aria-label="Cerrar">✕</button></div>
      <div id="ovBody"></div>
      </div>
    </>
  );
}
