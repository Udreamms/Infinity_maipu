// @ts-nocheck -- port directo del script original; se tipará por módulos de forma incremental.
import * as THREE from "three";

let started = false;

/** Arranca la experiencia interactiva (3D, reserva, overlays). Idempotente. */
export function initLanding(): void {
  if (started) return;
  started = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return '$' + Math.round(n).toLocaleString('es-CL'); };

  /* ---------- reserva ---------- */
  var TIPOS = { f7: { id: 'f7', nombre: 'Fútbol 7', precio: 30000, ref: 14, canchas: 1 }, f9: { id: 'f9', nombre: 'Fútbol 9', precio: 80000, ref: 18, canchas: 3 } };
  var NOM = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var hoy = new Date(); hoy.setHours(12, 0, 0, 0);
  var DIAS = [];
  for (var i = 0; i < 7; i++) { var d = new Date(hoy.getTime() + i * 86400000); DIAS.push({ i: i, wd: d.getDay(), num: d.getDate(), finde: d.getDay() === 0 || d.getDay() === 6 }); }
  var S = { tipo: 'f7', dia: 0, hora: null, jug: 14, bump: false };

  function slots(di) {
    var dd = DIAS[di], out = [], from = dd.finde ? 13 : 18, to = dd.finde ? 21 : 23, t = TIPOS[S.tipo];
    for (var h = from; h < to; h++) { var libres = 3 - (di * 5 + h * 3) % 4; out.push({ h: h, libres: libres, lleno: libres < t.canchas }); }
    return out;
  }
  function render() {
    var t = TIPOS[S.tipo];
    $('tipos').innerHTML = Object.keys(TIPOS).map(function (k) {
      var x = TIPOS[k];
      return '<button type="button" class="opt" data-tipo="' + k + '" aria-pressed="' + (S.tipo === k) + '"><span class="t">' + x.nombre + '</span><span class="pr">' + fmt(x.precio) + ' la hora</span><span class="s">Ej.: ' + fmt(x.precio / x.ref) + ' c/u si son ' + x.ref + '</span></button>';
    }).join('');
    $('dias').innerHTML = DIAS.map(function (x) {
      var n = slots(x.i).filter(function (s) { return !s.lleno; }).length;
      return '<button type="button" class="opt day" data-dia="' + x.i + '" aria-pressed="' + (S.dia === x.i) + '"><span class="d">' + (x.i === 0 ? 'Hoy' : NOM[x.wd]) + '</span><span class="num">' + x.num + '</span><span class="f">' + (n ? n + (n > 1 ? ' libres' : ' libre') : 'Lleno') + '</span></button>';
    }).join('');
    $('horas').innerHTML = slots(S.dia).map(function (s) {
      var nota = s.lleno ? 'Ocupado' : (S.hora === s.h ? 'Elegida' : (t.canchas === 1 && s.libres === 1 ? 'Última' : (t.canchas === 1 && s.libres === 2 ? 'Popular' : 'Libre')));
      return '<button type="button" class="opt hour" data-hora="' + s.h + '"' + (s.lleno ? ' disabled' : '') + ' aria-pressed="' + (S.hora === s.h) + '"><span class="h">' + s.h + ':00</span><span class="s">' + nota + '</span></button>';
    }).join('');
    var libresHoy = slots(S.dia).filter(function (s) { return !s.lleno; }).length;
    $('quedan').textContent = 'Quedan ' + libresHoy + ' horas libres este día. Toca una hora y reserva.';
    var rap = null;
    for (var di = 0; di < 7 && !rap; di++) {
      var ld = slots(di).filter(function (s) { return !s.lleno; });
      var sx = (t.canchas === 1 && ld.filter(function (s) { return s.libres < 3; })[0]) || ld[0];
      if (sx) rap = { di: di, h: sx.h, n: ld.length };
    }
    $('quick').innerHTML = rap ? '<div><span class="eyebrow">Reserva en 3 toques</span><b>Reserva el primer horario disponible</b><span class="esc">' + (rap.n > 1 ? 'Solo quedan ' + rap.n + ' horarios' : 'Queda solo 1 horario') + (rap.di === 0 ? ' hoy' : ' ese día') + '</span><span class="txt">' + t.nombre + ' · ' + (rap.di === 0 ? 'Hoy, ' : '') + LARGO[DIAS[rap.di].wd] + ' ' + DIAS[rap.di].num + ' · ' + rap.h + ':00 a ' + (rap.h + 1) + ':00 · ' + fmt(t.precio) + '</span></div><button type="button" class="btn" data-qd="' + rap.di + '" data-qh="' + rap.h + '">Reservar ahora →</button>' : '<div><b>No quedan horas libres esta semana</b></div>';
    $('njug').textContent = S.jug;
    var total = t.precio + (S.bump ? 10000 : 0);
    $('parte').innerHTML = fmt(total / S.jug) + '<small> por jugador</small>';
    var dd = DIAS[S.dia], rows = [['Cancha', t.nombre], ['Día', LARGO[dd.wd] + ' ' + dd.num + (S.dia === 0 ? ' (hoy)' : '')], ['Hora', S.hora === null ? 'Sin elegir' : S.hora + ':00 a ' + (S.hora + 1) + ':00'], ['Cancha ' + t.nombre, fmt(t.precio)]];
    if (S.bump) rows.push(['Tercer Tiempo', fmt(10000)]);
    rows.push(['Pagas hoy', fmt(total)]);
    $('lineas').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
    $('go').disabled = S.hora === null;
    $('go').textContent = S.hora === null ? 'Elige una hora' : 'Reservar · ' + fmt(total);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.qd) { S.dia = +b.dataset.qd; S.hora = +b.dataset.qh; S.jug = TIPOS[S.tipo].ref; render(); openRes(); return; }
    if (b.dataset.tipo) { S.tipo = b.dataset.tipo; S.hora = null; S.jug = TIPOS[S.tipo].ref; $('status').textContent = ''; render(); }
    else if (b.dataset.dia) { S.dia = +b.dataset.dia; S.hora = null; $('status').textContent = ''; render(); }
    else if (b.dataset.hora) { S.hora = +b.dataset.hora; $('status').textContent = ''; render(); }
  });
  $('menos').addEventListener('click', function () { S.jug = Math.max(2, S.jug - 1); render(); });
  $('mas').addEventListener('click', function () { S.jug = Math.min(60, S.jug + 1); render(); });
  $('bump').addEventListener('change', function (e) { S.bump = e.target.checked; render(); });
  $('go').addEventListener('click', function () { if (S.hora !== null) openRes(); });
  render();

  /* ---------- celebraciones y club ---------- */
  var MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MESC = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var DOWL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var mem = {};
  function sget(k, d) { try { var v = localStorage.getItem(k); if (v !== null) return JSON.parse(v); } catch (e) {} return k in mem ? mem[k] : d; }
  function sset(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fpts(n) { return Math.round(n).toLocaleString('es-CL'); }
  function mailOk(s) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((s || '').trim()); }
  function getAcct() { return sget('inf_acct', null); }
  function putAcct(a) { sset('inf_acct', a); refreshLanding(); }
  function logged() { return !!getAcct() && sget('inf_in', false) === true; }
  function setIn(v) { sset('inf_in', v); refreshLanding(); }

  function fechas() {
    var out = [], base = new Date(); base.setHours(12, 0, 0, 0);
    for (var i = 1; i < 120 && out.length < 10; i++) {
      var x = new Date(base.getTime() + i * 86400000), w = x.getDay();
      if (w !== 0 && w !== 6) continue;
      out.push({ key: x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate(), label: DOW[w] + ' ' + x.getDate() + ' ' + MESC[x.getMonth()], largo: DOWL[w] + ' ' + x.getDate() + ' de ' + MES[x.getMonth()], ocupada: (x.getDate() * 7 + x.getMonth() * 3) % 4 === 0 });
    }
    return out;
  }
  function PK() {
    var socio = !!getAcct(), ha = socio ? 18000 : 20000;
    return {
      asado: { id: 'asado', nombre: 'Asado en el quincho', para: 'Para reuniones familiares y con amigos, sin partido.', hora: ha, precioTxt: fmt(ha) + ' / hora', nota: socio ? 'Precio socio (normal $20.000 por hora)' : 'Socios del club: $18.000 por hora', items: ['Quincho con 2 parrillas', 'Mesas y sillas para 40', 'Baños', 'Mínimo 4 horas'] },
      party: { id: 'party', nombre: 'Fútbol Party', para: 'Cumpleaños con partido incluido: el favorito de los niños.', hora: 35000, precioTxt: '$35.000 / hora', nota: '', rec: true, items: ['Cancha F7', 'Zona multiuso para inflables', 'Mesas y sillas para 40', '2 parrillas', 'Parlante de cortesía', 'Baños y electricidad', 'Mínimo 4 horas'] },
      grande: { id: 'grande', nombre: 'Evento grande', para: 'Matrimonios, empresas o más de 60 personas.', hora: 0, precioTxt: 'A cotizar', nota: '', items: ['Recinto completo exclusivo', 'Coordinación del evento'] }
    };
  }
  function packCard(p, action) {
    return '<article class="pack' + (p.rec ? ' rec' : '') + '">' + (p.rec ? '<span class="tag">El más elegido</span>' : '') +
      '<h3>' + p.nombre + '</h3><p class="fine">' + p.para + '</p><div class="pp">' + p.precioTxt + (p.nota ? '<small>' + p.nota + '</small>' : '') + '</div><ul>' +
      p.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul><button type="button" class="btn' + (p.rec ? '' : ' ghost') + '" data-act="' + action + '" data-v="' + p.id + '">' + (p.hora ? 'Elegir y ver fechas' : 'Pedir cotización') + '</button></article>';
  }
  function refreshLanding() {
    var P = PK(), FE = fechas(), lp = $('landPacks'), ld = $('landDates');
    if (lp) lp.innerHTML = ['asado', 'party', 'grande'].map(function (k) { return packCard(P[k], 'open-cel'); }).join('');
    if (ld) {
      var libres = FE.filter(function (f) { return !f.ocupada; }).length;
      ld.innerHTML = '<div><span class="eyebrow blue">Próximos fines de semana</span><p class="fine" style="margin-top:8px">Quedan ' + libres + ' fechas libres. Los fines de semana se reservan con semanas de anticipación. Toca una fecha para empezar.</p></div><div class="chips2">' +
        FE.map(function (f) { return f.ocupada ? '<span class="dchip off">' + f.label + ' · ocupado</span>' : '<button type="button" class="dchip" data-act="open-cel" data-v="party" data-d="' + f.key + '">' + f.label + '</button>'; }).join('') + '</div>';
    }
    var c1 = $('clubCta'), c2 = $('clubCta2');
    if (c1) c1.textContent = logged() ? 'Entrar a mi club' : 'Hazte socio gratis';
    if (c2) c2.hidden = logged();
  }

  var ov = $('ov'), ovBody = $('ovBody'), ovStep = $('ovStep'), lastFocus = null;
  var F = { nombre: '', cel: '', correo: '', clave: '', para: '' };
  var C = { paso: 'pack', pack: 'party', fecha: null, horas: 4, inicio: 13, bump: false, done: null };
  var K = { tab: 'crear', tipo: 'jugador', sec: 'inicio', cart: {}, entrega: 'cancha', pedido: null, msg: '', err: '' };
  var mode = null;

  function showOv() { if (ov.hidden) { lastFocus = document.activeElement; ov.hidden = false; document.body.style.overflow = 'hidden'; window.__ovOpen = true; } }
  function closeOv() { ov.hidden = true; document.body.style.overflow = ''; window.__ovOpen = false; mode = null; if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} } }
  function paint(html, step, keep) {
    var y = ov.scrollTop;
    ovBody.innerHTML = html; ovStep.textContent = step || '';
    if (keep) ov.scrollTop = y; else { ov.scrollTop = 0; var t = $('ovT'); if (t) t.focus({ preventScroll: true }); }
    syncBtns();
  }
  function celOk() { return F.nombre.trim().length > 1 && F.cel.length === 8 && mailOk(F.correo); }
  function crearOk() { return F.nombre.trim().length > 1 && F.cel.length === 8 && mailOk(F.correo) && F.clave.length >= 6; }
  function syncBtns() {
    var a = $('celGo'); if (a) a.disabled = !celOk();
    var b = $('crGo'); if (b) b.disabled = !crearOk();
    var c = $('enGo'); if (c) c.disabled = !(mailOk(F.correo) && F.clave.length >= 6);
    var r = $('resGo'); if (r) r.disabled = !celOk();
  }

  /* ----- celebraciones ----- */
  function celTotals() {
    var p = PK()[C.pack], con = p.hora > 0, base = p.hora * C.horas, bump = con && C.bump ? 49990 : 0, total = base + bump;
    return { p: p, con: con, base: base, bump: bump, total: total, abono: total / 2 };
  }
  function sumRows(T, fe) {
    var rows = [['Celebración', T.p.nombre], ['Fecha', fe ? fe.largo : 'Sin elegir']];
    if (T.con) {
      rows.push(['Horario', C.inicio + ':00 a ' + (C.inicio + C.horas) + ':00 · ' + C.horas + ' horas']);
      rows.push([T.p.nombre, fmt(T.base)]);
      if (T.bump) rows.push(['Kit Cumpleañero', fmt(T.bump)]);
      rows.push(['Total', fmt(T.total)]);
    } else rows.push(['Pago hoy', 'Sin pago · te cotizamos']);
    return '<dl>' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>';
  }
  function celPaint(keep) {
    var T = celTotals(), P = PK(), FE = fechas(), fe = FE.filter(function (f) { return f.key === C.fecha; })[0] || null, html, step;
    if (C.paso === 'pack') {
      step = 'Paso 1 de 3 · Celebración';
      html = '<div class="ov-in"><div><span class="eyebrow blue">Cumpleaños · Asados · Eventos en Maipú</span><h2 id="ovT" tabindex="-1">Elige tu celebración</h2></div><p class="lead">Cancha para que jueguen, quincho con parrilla y zona libre para inflables, todo en un solo lugar.</p><div class="packs">' +
        ['asado', 'party', 'grande'].map(function (k) { return packCard(P[k], 'cel-pack'); }).join('') +
        '</div><div class="note-box"><b>Garantía Fecha Segura.</b> Si llueve fuerte o tienes un imprevisto, cambias la fecha gratis y tu abono queda guardado para el nuevo día.</div></div>';
    } else if (C.paso === 'fecha') {
      step = 'Paso 2 de 3 · Fecha y horario';
      var ult = 21 - C.horas; if (C.inicio > ult) C.inicio = ult;
      var libres = FE.filter(function (f) { return !f.ocupada; }).length;
      html = '<div class="ov-in"><button type="button" class="back" data-act="cel-back">← Cambiar celebración</button><div><span class="eyebrow blue">' + T.p.nombre + '</span><h2 id="ovT" tabindex="-1">Elige la fecha</h2></div><div class="book"><div class="panel ctrl">' +
        '<div class="g"><h3>Fines de semana libres · quedan ' + libres + '</h3><div class="g dates">' + FE.map(function (f) {
          return '<button type="button" class="opt date" data-act="cel-fecha" data-v="' + f.key + '"' + (f.ocupada ? ' disabled' : '') + ' aria-pressed="' + (C.fecha === f.key) + '">' + f.label + '<small>' + (f.ocupada ? 'Ocupado' : 'Libre') + '</small></button>'; }).join('') + '</div></div>' +
        (T.con ? '<div class="g"><h3>¿Cuántas horas?</h3><div class="g hours">' + [4, 5, 6].map(function (h) { return '<button type="button" class="opt hour" data-act="cel-horas" data-v="' + h + '" aria-pressed="' + (C.horas === h) + '"><span class="h">' + h + ' horas</span><span class="s">' + fmt(T.p.hora * h) + '</span></button>'; }).join('') + '</div></div>' +
          '<div class="g"><h3>¿A qué hora empiezan?</h3><div class="g hours">' + (function () { var s = ''; for (var h = 13; h <= ult; h++) s += '<button type="button" class="opt hour" data-act="cel-inicio" data-v="' + h + '" aria-pressed="' + (C.inicio === h) + '"><span class="h">' + h + ':00</span></button>'; return s; })() + '</div><p class="fine">Celebraciones solo sábado y domingo, de 13:00 a 21:00.</p></div>' +
          '<div class="kit" data-on="' + C.bump + '"><span class="eyebrow">Oferta solo al reservar</span><h4>Suma el Kit Cumpleañero</h4><p class="fine">Llegan y está todo listo para que los niños disfruten desde el primer minuto.</p><ul><li>Inflable instalado en la zona de eventos</li><li>20 bebidas de la cafetería</li></ul><div class="pr">$49.990</div><button type="button" class="btn sm' + (C.bump ? ' ghost' : '') + '" style="justify-self:start" data-act="cel-bump">' + (C.bump ? '✓ Kit agregado · quitar' : 'Sí, quiero el Kit Cumpleañero') + '</button></div>' : '<p class="fine">Para eventos grandes armamos la propuesta contigo. Elige una fecha de referencia y te contactamos en 24 horas.</p>') +
        '</div><aside class="panel sum" aria-live="polite"><h3>Tu celebración</h3>' + sumRows(T, fe) + (T.con ? '<div class="big">' + fmt(T.abono) + '<small> abono hoy (50%)</small></div>' : '') +
        '<button type="button" class="btn" data-act="cel-next"' + (fe ? '' : ' disabled') + '>' + (fe ? 'Continuar' : 'Elige una fecha') + '</button><p class="fine">Reservas con 50% de abono. El saldo se cobra solo 48 horas antes. Precios de ejemplo.</p></aside></div></div>';
    } else if (C.paso === 'datos') {
      step = 'Paso 3 de 3 · Tus datos';
      html = '<div class="ov-in"><button type="button" class="back" data-act="cel-back">← Cambiar fecha</button><div><span class="eyebrow blue">' + T.p.nombre + ' · ' + (fe ? fe.label : '') + '</span><h2 id="ovT" tabindex="-1">Tus datos para la reserva</h2></div><p class="lead">Ahí te llegan la confirmación, la boleta del abono y el recordatorio.</p><div class="book"><div class="panel ctrl">' +
        '<label class="fld" for="f-para">¿Para quién es la celebración?<input id="f-para" data-f="para" value="' + esc(F.para) + '" placeholder="Ej.: Sofía cumple 8 años"></label>' +
        '<label class="fld" for="f-nombre">Nombre y apellido *<input id="f-nombre" data-f="nombre" autocomplete="name" value="' + esc(F.nombre) + '"></label>' +
        '<label class="fld" for="f-cel">Celular (WhatsApp) *<div class="phone"><span>+56 9</span><input id="f-cel" data-f="cel" inputmode="numeric" autocomplete="tel-national" maxlength="8" value="' + esc(F.cel) + '"></div></label>' +
        '<label class="fld" for="f-correo">Correo electrónico *<input id="f-correo" data-f="correo" type="email" autocomplete="email" value="' + esc(F.correo) + '"></label></div>' +
        '<aside class="panel sum" aria-live="polite"><h3>Resumen</h3>' + sumRows(T, fe) + '<div class="big">' + (T.con ? fmt(T.abono) + '<small> abono hoy (50%)</small>' : '$0<small> hoy</small>') + '</div>' +
        '<button type="button" class="btn" id="celGo" data-act="cel-pay" disabled>' + (T.con ? 'Pagar abono y reservar fecha' : 'Pedir cotización') + '</button><p class="fine">Completa tu nombre, celular y correo para reservar.</p><p class="fine">Versión de ejemplo: no se cobra nada ni se envía ningún mensaje.</p></aside></div></div>';
    } else {
      var d = C.done; step = d.grande ? 'Solicitud recibida' : 'Fecha reservada';
      html = '<div class="ov-in"><div class="panel ok-card"><span class="eyebrow">' + (d.grande ? 'Solicitud recibida' : 'Fecha reservada') + '</span><h2 id="ovT" tabindex="-1">' + (d.grande ? 'Gracias, te contactamos pronto' : 'Gracias por tu reserva, nos vemos en la celebración') + '</h2><p class="lead">' +
        (d.grande ? 'En la versión real te escribimos por WhatsApp en menos de 24 horas para armar la propuesta de tu evento.' : 'En la versión real te llegan la confirmación y la boleta del abono por WhatsApp y correo. El saldo se cobra solo 48 horas antes.') + '</p><dl><div><dt>Celebración</dt><dd>' + esc(d.pack) + '</dd></div><div><dt>Fecha</dt><dd>' + esc(d.fecha) + '</dd></div>' +
        (d.horario ? '<div><dt>Horario</dt><dd>' + d.horario + '</dd></div>' : '') + (d.para ? '<div><dt>Para</dt><dd>' + esc(d.para) + '</dd></div>' : '') + (d.bump ? '<div><dt>Kit Cumpleañero</dt><dd>Inflable + 20 bebidas</dd></div>' : '') +
        (d.grande ? '' : '<div><dt>Abono pagado</dt><dd>' + fmt(d.abono) + '</dd></div>') + '</dl><div class="rowb"><button type="button" class="btn" data-act="cel-club">Ver mi reserva en Club Infinity</button><button type="button" class="btn ghost" data-act="close">Volver al inicio</button></div></div></div>';
    }
    paint(html, step, keep);
  }
  function openCel(pack, fecha) {
    var a = getAcct();
    F.nombre = a ? a.nombre : F.nombre; F.cel = a ? a.celular : F.cel; F.correo = a ? a.correo : F.correo; F.para = '';
    C.pack = pack || 'party'; C.fecha = fecha || null; C.horas = 4; C.inicio = 13; C.bump = false; C.done = null; C.paso = pack ? 'fecha' : 'pack';
    mode = 'cel'; showOv(); celPaint();
  }
  function celPay() {
    var T = celTotals(), fe = fechas().filter(function (f) { return f.key === C.fecha; })[0] || { largo: '' };
    var rec = { id: 'CEL-' + Math.random().toString(36).slice(2, 6).toUpperCase(), pack: T.p.nombre, fecha: fe.largo, horario: T.con ? C.inicio + ':00 a ' + (C.inicio + C.horas) + ':00' : '', para: F.para.trim(), bump: T.con && C.bump, total: T.total, abono: T.abono, grande: !T.con };
    var res = sget('inf_res', []); res.unshift(rec); sset('inf_res', res.slice(0, 10));
    C.done = rec; C.paso = 'ok'; celPaint();
  }


  /* ----- reserva de cancha: pago, cobro al equipo y Hora Fija ----- */
  var R = { paso: 'pago', bumpNo: false, compartido: false, copiado: false, upsell: 'pendiente' };
  function resSel() {
    var t = TIPOS[S.tipo], dd = DIAS[S.dia], h = S.hora;
    var dia = LARGO[dd.wd].charAt(0).toUpperCase() + LARGO[dd.wd].slice(1) + ' ' + dd.num;
    return { t: t, hora: h + ':00', dia: dia, diaSemana: LARGO[dd.wd], diasPl: /s$/.test(LARGO[dd.wd]) ? LARGO[dd.wd] : LARGO[dd.wd] + 's', cancha: t.canchas === 3 ? 'Cancha Fútbol 9' : 'Cancha ' + ((S.dia * 5 + h * 3) % 4 + 1), precio: t.precio };
  }
  function resTot() {
    var x = resSel(), bv = S.bump ? 10000 : 0, total = x.precio + bv, parte = total / S.jug;
    var pag = Math.min(3, S.jug - 1);
    return { x: x, total: total, parte: parte, cobro: { pagaron: pag + 1, falta: parte * (S.jug - 1 - pag), pct: Math.round((pag + 1) / S.jug * 100) }, hfNormal: x.precio * 4, hfPrecio: x.precio * 4 * 0.8 };
  }
  function dlRows(rows) { return '<dl>' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>'; }
  function resPaint(keep) {
    var T = resTot(), x = T.x, html, step;
    var canchaTxt = x.t.id === 'f9' ? x.cancha : x.t.nombre + ' · ' + x.cancha;
    if (R.paso === 'pago') {
      step = 'Paso 2 de 3 · Pago';
      var lin = [[canchaTxt, fmt(x.precio)]].concat(S.bump ? [['Tercer Tiempo (quincho + bebidas)', fmt(10000)]] : []).concat([['Monto por jugador (' + S.jug + ')', fmt(T.parte) + ' c/u']]);
      html = '<div class="ov-in"><button type="button" class="back" data-act="close">← Cambiar hora</button><div><span class="eyebrow">' + x.hora + ' · ' + x.cancha + '</span><h2 id="ovT" tabindex="-1">Tus datos para la reserva</h2></div><p class="lead">' + x.dia + ' · 1 hora · ' + x.t.nombre + '. Ahí te llegan la confirmación, la boleta y el recordatorio del partido.</p><div class="book"><div class="panel ctrl">' +
        '<div class="g"><h3>¿Cuántos juegan?</h3><div class="stepper"><button type="button" data-act="res-menos" aria-label="Un jugador menos">−</button><output aria-live="polite">' + S.jug + '</output><button type="button" data-act="res-mas" aria-label="Un jugador más">+</button></div><p class="fine">Sin límite: pueden ser los que quieran. Sale ' + fmt(T.parte) + ' por jugador.</p></div>' +
        '<div class="offer" data-on="' + S.bump + '"><span class="save">Oferta solo al reservar · ahorras $10.000</span><h4>Quédate a compartir con tu equipo</h4><p class="fine">Suma el <b>Tercer Tiempo</b>: nosotros ponemos el quincho, la parrilla y las bebidas.</p><ul><li>Quincho con parrilla para ustedes</li><li>14 bebidas heladas de nuestra cafetería</li><li>10% de descuento en tu siguiente arriendo de cancha</li><li>Mínimo 2 horas</li></ul><div class="pr"><s>$20.000</s>$10.000</div><p class="fine">= solo ' + fmt(10000 / S.jug) + ' más por jugador</p>' +
        '<div class="rowb"><button type="button" class="btn sm' + (S.bump ? ' ghost' : '') + '" data-act="res-bump">' + (S.bump ? '✓ Tercer Tiempo agregado' : 'Sí, quiero el Tercer Tiempo') + '</button><button type="button" class="btn sm ghost" data-act="res-nobump"' + (R.bumpNo && !S.bump ? ' style="border-color:var(--ink)"' : '') + '>No, solo la cancha</button></div></div>' +
        '<label class="fld" for="f-nombre">Nombre y apellido *<input id="f-nombre" data-f="nombre" autocomplete="name" value="' + esc(F.nombre) + '"></label>' +
        '<label class="fld" for="f-cel">Celular (WhatsApp) *<div class="phone"><span>+56 9</span><input id="f-cel" data-f="cel" inputmode="numeric" autocomplete="tel-national" maxlength="8" value="' + esc(F.cel) + '"></div></label>' +
        '<label class="fld" for="f-correo">Correo electrónico *<input id="f-correo" data-f="correo" type="email" autocomplete="email" value="' + esc(F.correo) + '"></label></div>' +
        '<aside class="panel sum" aria-live="polite"><h3>Resumen</h3>' + dlRows(lin) + '<div class="big">' + fmt(T.total) + '<small> pagas hoy</small></div><p class="fine">Pagas la cancha completa y queda asegurada. Luego cada jugador te devuelve ' + fmt(T.parte) + '.</p><p class="fine">Completa tu nombre, celular y correo para reservar.</p>' +
        '<button type="button" class="btn" id="resGo" data-act="res-pay" disabled>Pagar y reservar</button><p class="fine">Webpay, tarjeta o transferencia. Versión de ejemplo: no se cobra nada.</p></aside></div></div>';
    } else {
      step = 'Paso 3 de 3 · Confirmación';
      var msg = 'Partido ' + x.dia + ' a las ' + x.hora + ' en Infinity. La cancha ya está pagada ⚽ Tu parte es de ' + fmt(T.parte) + '; puedes transferir aquí cuando puedas: infinity.cl/p/8F3K. ¡Nos vemos en la cancha!';
      html = '<div class="ov-in"><div class="panel ok-card"><span class="eyebrow">✓ ¡Listo!</span><h2 id="ovT" tabindex="-1">Tu cancha está reservada: ' + x.dia + ', ' + x.hora + '</h2><p class="lead">Boleta electrónica Bsale Nº 48233 enviada a tu WhatsApp.</p></div>' +
        '<div class="panel ok-card"><span class="eyebrow">Paso siguiente</span><h3 style="font-size:40px">Ahora cóbrale a tu equipo</h3><p class="lead">Comparte este link en el grupo. Cada uno ve que debe ' + fmt(T.parte) + ' y tus datos para transferirte. Tú vas marcando quién ya pagó.</p>' +
        '<div class="linkbox"><code>infinity.cl/p/8F3K</code><span class="fine">' + (R.copiado ? '✓ Copiado' : '') + '</span></div><div class="rowb"><button type="button" class="btn sm" data-act="res-share">Enviar por WhatsApp</button><button type="button" class="btn sm ghost" data-act="res-copy">Copiar link</button></div>' +
        '<p class="quote">Mensaje listo: “' + esc(msg) + '”.</p>' +
        (R.compartido ? '<div style="width:100%;display:grid;gap:8px"><b>' + T.cobro.pagaron + ' de ' + S.jug + ' ya te pagaron · te faltan ' + fmt(T.cobro.falta) + '</b><div class="bar"><i style="width:' + T.cobro.pct + '%"></i></div></div>' : '') + '</div>';
      if (R.upsell === 'pendiente') {
        html += '<div class="big-card blue hf"><span class="eyebrow blue">Espera · oferta solo para esta reserva</span><h3>¿Juegan todas las semanas? Quédate con esta hora fija</h3><p>Tu equipo tiene el ' + x.diaSemana + ' a las ' + x.hora + ' asegurado todas las semanas, con 20% de descuento y el pago dividido automático cada mes.</p><ul><li>4 partidos al mes por ' + fmt(T.hfPrecio) + ' / mes (en vez de ' + fmt(T.hfNormal) + ')</li><li>Nadie les quita la hora, ni en temporada alta</li><li>Cada jugador paga su parte solo, todos los meses</li><li>Bono: el primer Tercer Tiempo del mes va gratis</li><li>Sin permanencia: cancelas con 15 días de aviso</li></ul><p class="fine">Quedan 3 horas fijas disponibles en este horario.</p><div class="rowb"><button type="button" class="btn" data-act="hf-si">Sí, quiero mi Hora Fija</button><button type="button" class="btn ghost" data-act="hf-no">No, solo esta vez</button></div></div>';
      } else if (R.upsell === 'pagando') {
        html += '<div class="panel ok-card"><span class="eyebrow">Paso final · activa tu Hora Fija</span><h3 style="font-size:40px">Todos los ' + x.diasPl + ' a las ' + x.hora + ', asegurado</h3>' + dlRows([['Horario', 'Todos los ' + x.diasPl + ' · ' + x.hora], ['Modalidad', x.t.nombre], ['Partidos al mes', '4'], ['Precio mensual', fmt(T.hfPrecio) + ' (antes ' + fmt(T.hfNormal) + ')'], ['Pagas hoy', fmt(T.hfPrecio) + ' / mes']]) + '<p class="fine">Los meses siguientes se cobran solos con la misma tarjeta, el mismo día. Sin permanencia: cancelas con 15 días de aviso.</p><div class="rowb"><button type="button" class="btn" data-act="hf-pagar">Pagar y activar Hora Fija</button><button type="button" class="btn ghost" data-act="hf-volver">Volver</button></div></div>';
      } else {
        var si = R.upsell === 'si';
        var datos = [['Día y hora', x.dia + ' · ' + x.hora], ['Cancha', canchaTxt]].concat(S.bump ? [['Tercer Tiempo', 'Quincho + 14 bebidas']] : []).concat(si ? [['Hora Fija', 'Todos los ' + x.diasPl + ' · ' + fmt(T.hfPrecio) + '/mes']] : []).concat([['Total pagado hoy', fmt(T.total + (si ? T.hfPrecio : 0))]]);
        html += '<div class="panel ok-card"><span class="eyebrow">Reserva confirmada</span><h2>Gracias por tu reserva, nos vemos en la cancha</h2><p class="lead">' + (si ? '¡Bienvenidos a la Hora Fija! Su ' + x.diaSemana + ' ' + x.hora + ' es de ustedes' : 'Te enviamos la confirmación y la boleta por WhatsApp y a tu correo.') + '</p>' + dlRows(datos) +
          '<div class="nexts"><div><b>1 · Cobra a tu equipo</b><span>Comparte el link en el grupo.</span></div><div><b>2 · Te recordamos</b><span>Te escribimos por WhatsApp 2 horas antes.</span></div><div><b>3 · A jugar</b><span>Lleguen 10 minutos antes y disfruten.</span></div></div>' +
          '<div class="rowb"><button type="button" class="btn" data-act="cel-club">Ver mi partido en Club Infinity</button><button type="button" class="btn ghost" data-act="close">Volver al inicio</button></div>' +
          '<p class="fine">¿Cumpleaños pronto? Celebra en Infinity con cancha, quincho y zona de juegos. <button type="button" class="back" style="display:inline;color:var(--blue-soft)" data-act="open-cel">Ver celebraciones →</button></p></div>';
      }
      html += '</div>';
    }
    paint(html, step, keep);
  }
  function openRes() {
    var a = getAcct();
    if (a) { F.nombre = F.nombre || a.nombre; F.cel = F.cel || a.celular; F.correo = F.correo || a.correo; }
    R.paso = 'pago'; R.bumpNo = false; R.compartido = false; R.copiado = false; R.upsell = 'pendiente';
    mode = 'res'; showOv(); resPaint();
  }

  /* ----- club ----- */
  var PROD = [
    { id: 'lata', nombre: 'Bebida', precio: 1300, desc: 'Cola, lima-limón o naranja' }, { id: 'agua', nombre: 'Agua mineral', precio: 1200, desc: '500 ml, helada' },
    { id: 'iso', nombre: 'Isotónico 1 litro', precio: 2300, desc: 'Para después del partido' }, { id: 'energ', nombre: 'Bebida energética', precio: 2500, desc: 'Lata, helada' },
    { id: 'cerveza', nombre: 'Cerveza sin alcohol', precio: 2300, desc: 'Lata, helada' }, { id: 'jugo', nombre: 'Jugo natural', precio: 2000, desc: 'Naranja o frutilla' },
    { id: 'pack', nombre: 'Pack 10 bebidas heladas', precio: 12000, desc: 'Para todo el equipo, listo para retirar' }
  ];
  var ABIERTOS = [
    { id: 'a1', titulo: 'Mixto amistoso', cuando: 'Hoy 17:00', nivel: 'Intermedio', cupos: 'faltan 3', precio: '$1.750' },
    { id: 'a2', titulo: 'Fútbol 7 después del trabajo', cuando: 'Mañana 20:00', nivel: 'Recreativo', cupos: 'faltan 2', precio: '$3.200' },
    { id: 'a3', titulo: 'Liga femenina · práctica', cuando: 'Sáb 11:00', nivel: 'Todos los niveles', cupos: 'faltan 4', precio: '$2.500' },
    { id: 'a4', titulo: 'Papás del barrio', cuando: 'Sáb 10:00', nivel: 'Recreativo', cupos: 'falta 1', precio: '$2.500' }
  ];
  var CANJES = [['Bebida en lata', 150], ['Jugo natural', 200], ['Pack 10 bebidas para el equipo', 1200], ['Hora de cancha de la tarde (antes de 18:00)', 1500]];
  function cartTotal() { return PROD.reduce(function (s, p) { return s + p.precio * (K.cart[p.id] || 0); }, 0); }

  function authView() {
    var crear = K.tab === 'crear', ex = !!getAcct();
    return '<div class="ov-in"><div><span class="eyebrow">Club Infinity · Maipú</span><h2 id="ovT" tabindex="-1">' + (crear ? 'Hazte socio gratis' : 'Qué bueno verte de nuevo') + '</h2></div>' +
      '<p class="lead">Descuentos de socio, puntos que canjeas por cancha, cafetería y cumpleaños, y tu equipo siempre conectado. Tus beneficios parten desde el primer partido.</p>' +
      '<div class="tabs2" role="group" aria-label="Acceso"><button type="button" data-act="club-tab" data-v="crear" aria-pressed="' + crear + '">Crear cuenta</button><button type="button" data-act="club-tab" data-v="entrar" aria-pressed="' + !crear + '">Ya soy socio</button></div>' +
      '<div class="auth">' + (crear ?
        '<div class="g who"><h3 style="font-family:var(--f-brand);font-style:normal;font-weight:400;font-size:11px;letter-spacing:.24em;color:var(--muted);text-transform:uppercase">¿Cómo vas a usar el club?</h3>' +
        [['jugador', 'Jugador', 'Juego con amigos y me sumo a partidos'], ['capitan', 'Capitán', 'Organizo a mi equipo y reservo la cancha']].map(function (c) { return '<button type="button" class="opt" data-act="club-tipo" data-v="' + c[0] + '" aria-pressed="' + (K.tipo === c[0]) + '"><span class="t">' + c[1] + '</span><span class="s">' + c[2] + '</span></button>'; }).join('') + '</div>' +
        '<form class="panel" novalidate onsubmit="return false"><label class="fld" for="f-nombre">Nombre y apellido *<input id="f-nombre" data-f="nombre" autocomplete="name" value="' + esc(F.nombre) + '"></label>' +
        '<label class="fld" for="f-cel">Celular (WhatsApp) *<div class="phone"><span>+56 9</span><input id="f-cel" data-f="cel" inputmode="numeric" maxlength="8" value="' + esc(F.cel) + '"></div></label>' +
        '<label class="fld" for="f-correo">Correo electrónico *<input id="f-correo" data-f="correo" type="email" autocomplete="email" value="' + esc(F.correo) + '"></label>' +
        '<label class="fld" for="f-clave">Crea una contraseña * (mínimo 6)<input id="f-clave" data-f="clave" type="password" autocomplete="new-password" value="' + esc(F.clave) + '"></label>' +
        '<p class="err" role="alert">' + esc(K.err) + '</p><button type="button" class="btn" id="crGo" data-act="club-crear" disabled>' + (K.tipo === 'capitan' ? 'Crear mi cuenta de capitán' : 'Crear mi cuenta gratis') + '</button><p class="fine">Sin costo y sin tarjeta. En la versión real te enviamos un código por WhatsApp para confirmar tu número.</p></form>'
        : '<form class="panel" novalidate onsubmit="return false"><label class="fld" for="f-correo">Correo electrónico<input id="f-correo" data-f="correo" type="email" autocomplete="email" value="' + esc(F.correo) + '"></label>' +
        '<label class="fld" for="f-clave">Contraseña<input id="f-clave" data-f="clave" type="password" autocomplete="current-password" value="' + esc(F.clave) + '"></label>' +
        '<p class="err" role="alert">' + esc(K.err) + '</p><button type="button" class="btn" id="enGo" data-act="club-entrar" disabled>Entrar al club</button>' +
        (ex ? '' : '<p class="fine">Aún no hay una cuenta en este navegador. Crea una en la otra pestaña.</p>') + '</form><div></div>') + '</div>' +
      '<p class="proto">Versión de ejemplo: tu cuenta queda guardada solo en este navegador. No se envían mensajes ni se cobra nada.</p></div>';
  }
  function dashView(a) {
    var cap = a.tipo === 'capitan', first = a.nombre.trim().split(/\s+/)[0], ini = a.nombre.trim().split(/\s+/).slice(0, 2).map(function (x) { return x[0].toUpperCase(); }).join('');
    var nav = [['inicio', 'Inicio']].concat(cap ? [['equipo', 'Mi equipo']] : []).concat([['cafe', 'Cafetería'], ['abiertos', 'Partidos abiertos'], ['ranking', 'Ranking y puntos'], ['celebra', 'Celebraciones']]);
    var body = '';
    var mes = MES[new Date().getMonth()], sig = MES[(new Date().getMonth() + 1) % 12];
    if (K.sec === 'inicio') {
      var jug = a.jugados || 0, res = sget('inf_res', []);
      body = '<h2 id="ovT" tabindex="-1">Hola, ' + esc(first) + '</h2><div class="g3">' +
        '<div class="cs"><span class="eyebrow">Tus puntos</span><div class="big">' + fpts(a.puntos) + '<small> pts</small></div><p class="fine">' + (a.demo ? 'Nivel Oro · ' : 'Socio nuevo · ') + 'Canjea según los puntos y productos habilitados.</p></div>' +
        '<div class="cs"><span class="eyebrow">Reto de ' + mes + '</span><h3>Juega 4 partidos, gana 1 hora de la tarde gratis</h3><div class="bar"><i style="width:' + Math.min(100, jug / 4 * 100) + '%"></i></div><p class="fine">' + jug + ' de 4 partidos</p></div>' +
        '<div class="cs"><span class="eyebrow">Reservar cancha</span><h3>' + (cap ? 'Tu equipo, tu hora' : 'Tu próximo partido') + '</h3><p class="fine">Elige la hora, paga y cobra a tu equipo con un link.</p><button type="button" class="mini" data-act="goto-reservar" style="justify-self:start">Reservar cancha</button></div></div>' +
        '<div class="g3"><div class="cs"><span class="eyebrow">Cafetería · antes de tu partido</span><h3>¿Bebidas heladas para tu partido?</h3><p class="fine">Pídelas aquí y retíralas en la cafetería sin hacer fila. Pack de 10 bebidas: $12.000.</p><button type="button" class="mini" data-act="sec" data-v="cafe" style="justify-self:start">Pedir a la cafetería</button></div>' +
        '<div class="cs blue"><span class="eyebrow blue">Celebraciones</span><h3>¿Cumpleaños pronto?</h3><p class="fine">Cancha, quincho y zona de eventos. Los socios tienen precio especial en el asado: $18.000 por hora.</p><button type="button" class="mini" data-act="cel-from-club" style="justify-self:start">Ver celebraciones</button></div></div>' +
        '<div class="cs"><h3>Tus celebraciones</h3>' + (res.length ? '<div class="list">' + res.map(function (r) { return '<div><span><b>' + esc(r.pack) + '</b><small>' + esc(r.fecha) + (r.horario ? ' · ' + r.horario : '') + (r.para ? ' · ' + esc(r.para) : '') + '</small></span><span class="pill2 on">' + (r.grande ? 'Cotización' : 'Abono ' + fmt(r.abono)) + '</span></div>'; }).join('') + '</div>' : '<p class="fine">Aún no tienes celebraciones reservadas.</p>') + '</div>' +
        (a.demo ? '' : '<p class="proto">Prototipo: <button type="button" class="back" style="display:inline;color:var(--green)" data-act="demo">cargar datos de ejemplo</button> (1.240 puntos, 3 partidos jugados y un equipo con Hora Fija).</p>');
    } else if (K.sec === 'equipo') {
      var nombres = [first + ' (tú)', 'Benja', 'Pancho', 'Seba', 'Rodrigo', 'Joaco', 'Matías', 'Felipe', 'Cristóbal', 'Diego'], pag = a.recordado ? 9 : 7;
      body = '<h2 id="ovT" tabindex="-1">Mi equipo</h2>' + (a.demo ? '<div class="cs"><span class="eyebrow">Tu Hora Fija</span><h3>Jueves 20:00 · Cancha 2</h3><p>$96.000 al mes (20% menos) · $9.600 por jugador</p><p class="fine">Próximo cobro: 1 de ' + sig + ' · sin permanencia · Bono: un Tercer Tiempo de regalo cada mes.</p></div>' +
        '<div class="cs"><h3>Pagos de ' + sig + ' · ' + pag + ' de 10</h3><div class="list">' + nombres.map(function (n, i) { return '<div><b>' + esc(n) + '</b><span class="pill2' + (i < pag ? ' on' : '') + '">' + (i < pag ? 'Pagó $9.600' : 'Pendiente') + '</span></div>'; }).join('') + '</div>' +
        '<div class="rowb">' + (pag < 10 ? '<button type="button" class="mini" data-act="recordar">Recordar a los pendientes por WhatsApp</button>' : '<span class="pill2 on">Recordatorio enviado (simulado)</span>') + '</div></div>'
        : '<div class="cs"><h3>Aún no tienes Hora Fija</h3><p class="fine">La misma cancha y hora cada semana, con 20% menos: 4 partidos al mes por $96.000 en vez de $120.000. Cada jugador paga su parte solo y cancelas con 15 días de aviso.</p><div class="rowb"><button type="button" class="mini" data-act="goto-reservar">Reservar cancha</button><button type="button" class="mini ghost" data-act="demo">Ver ejemplo con datos</button></div></div>');
    } else if (K.sec === 'cafe') {
      var tot = cartTotal(), lines = PROD.filter(function (p) { return K.cart[p.id]; });
      if (K.pedido) body = '<h2 id="ovT" tabindex="-1">Pedido listo</h2><div class="cs"><span class="eyebrow">Código de retiro</span><span class="code">' + K.pedido.code + '</span><p>' + (K.pedido.entrega === 'qr' ? 'Retira en la cafetería mostrando este código.' : 'Te lo llevamos a tu cancha.') + ' Total ' + fmt(K.pedido.total) + ' · +' + K.pedido.pts + ' puntos.</p><button type="button" class="mini ghost" data-act="cafe-new" style="justify-self:start">Hacer otro pedido</button></div>';
      else body = '<h2 id="ovT" tabindex="-1">Cafetería</h2><p class="lead">Bebidas heladas para antes y después del partido. Paga aquí y retira tu pedido sin hacer fila.</p><div class="book"><div class="cs"><div class="list">' + PROD.map(function (p) { var n = K.cart[p.id] || 0; return '<div><span><b>' + p.nombre + '</b><small>' + p.desc + '</small></span><span class="qty"><b>' + fmt(p.precio) + '</b>' + (n ? '<button type="button" data-act="cart-minus" data-v="' + p.id + '" aria-label="Quitar uno">−</button><b>' + n + '</b>' : '') + '<button type="button" data-act="cart-add" data-v="' + p.id + '" aria-label="Agregar ' + p.nombre + '">+</button></span></div>'; }).join('') + '</div></div>' +
        '<div class="cs"><h3>Tu pedido</h3>' + (lines.length ? '<div class="list">' + lines.map(function (p) { return '<div><span>' + K.cart[p.id] + ' × ' + p.nombre + '</span><b>' + fmt(p.precio * K.cart[p.id]) + '</b></div>'; }).join('') + '</div>' : '<p class="fine">Todavía no agregas nada.</p>') +
        '<div class="rowb">' + [['cancha', 'Llevar a mi cancha'], ['qr', 'Retiro con QR']].map(function (e) { return '<button type="button" class="mini' + (K.entrega === e[0] ? '' : ' ghost') + '" data-act="entrega" data-v="' + e[0] + '">' + e[1] + '</button>'; }).join('') + '</div>' +
        '<div class="list"><div><b>Total</b><b>' + fmt(tot) + '</b></div></div><button type="button" class="btn" data-act="cafe-pay"' + (tot ? '' : ' disabled') + '>Pagar pedido</button><p class="fine">Precios de ejemplo · +1 punto por cada $1.000.</p></div></div>';
    } else if (K.sec === 'abiertos') {
      body = '<h2 id="ovT" tabindex="-1">Partidos abiertos</h2><p class="lead">¿No tienes equipo? Súmate a un partido y paga solo tu parte.</p><div class="cs"><div class="list">' + ABIERTOS.map(function (x) { var on = !!(a.unidos || {})[x.id]; return '<div><span><b>' + x.titulo + '</b><small>' + x.cuando + ' · ' + x.nivel + ' · ' + x.cupos + ' · ' + x.precio + ' c/u</small></span><button type="button" class="mini' + (on ? ' ghost' : '') + '" data-act="join" data-v="' + x.id + '">' + (on ? '✓ Estás dentro · parte pagada' : 'Unirme y pagar mi parte') + '</button></div>'; }).join('') + '</div></div>';
    } else if (K.sec === 'ranking') {
      var rk = [[first + ' (tú)', a.puntos, true], ['Nico', 1610], ['Pancho', 1480], ['Benja', 1150], ['Cami', 1090]].sort(function (x, y) { return y[1] - x[1]; });
      body = '<h2 id="ovT" tabindex="-1">Ranking y puntos</h2><div class="book"><div class="cs"><h3>Ranking del mes</h3><div class="list">' + rk.map(function (r, i) { return '<div><span><b>' + (i + 1) + '.</b> ' + esc(r[0]) + '</span><b' + (r[2] ? ' style="color:var(--green)"' : '') + '>' + fpts(r[1]) + ' pts</b></div>'; }).join('') + '</div><p class="fine">El 1.º del mes gana un Tercer Tiempo para su equipo. Ranking de ejemplo.</p></div>' +
        '<div class="cs"><h3>Canjea tus puntos</h3><div class="big" style="font-size:44px">' + fpts(a.puntos) + '<small> pts</small></div><div class="list">' + CANJES.map(function (c, i) { return '<div><span>' + c[0] + '<small>' + fpts(c[1]) + ' pts</small></span><button type="button" class="mini" data-act="canjear" data-v="' + i + '"' + (a.puntos < c[1] ? ' disabled' : '') + '>Canjear</button></div>'; }).join('') + '</div><p class="fine">Canjea según los puntos y productos habilitados. Verifica en la cafetería.</p></div></div>';
    } else {
      body = '<h2 id="ovT" tabindex="-1">Celebra en Infinity</h2><p class="lead">Cancha, quincho y zona de eventos para celebrar con todo listo.</p><div class="packs">' + (function () { var P = PK(); return ['asado', 'party', 'grande'].map(function (k) { return packCard(P[k], 'cel-from-club'); }).join(''); })() + '</div>';
    }
    return '<div class="ov-in"><div class="club"><nav class="side" aria-label="Club Infinity"><div class="me"><span class="av">' + esc(ini) + '</span><span><b>' + esc(first) + '</b><small>' + (cap ? 'Capitán' : 'Jugador') + (a.demo ? ' · Nivel Oro' : ' · Socio nuevo') + '</small></span></div>' +
      nav.map(function (n) { return '<button type="button" data-act="sec" data-v="' + n[0] + '"' + (K.sec === n[0] ? ' aria-current="page"' : '') + '>' + n[1] + '</button>'; }).join('') +
      '<button type="button" data-act="goto-reservar">Reservar cancha</button><button type="button" data-act="club-salir" style="color:var(--muted)">Salir</button></nav><div class="main2">' + (K.msg ? '<p class="msg" role="status">' + esc(K.msg) + '</p>' : '') + body + '<p class="proto">Versión de ejemplo: nada de lo que hagas aquí se cobra ni se envía. Tus datos quedan solo en este navegador.</p></div></div></div>';
  }
  function clubPaint(keep) {
    var a = getAcct();
    if (logged() && a) paint(dashView(a), 'Club Infinity · ' + (a.tipo === 'capitan' ? 'Capitán' : 'Jugador'), keep);
    else paint(authView(), K.tab === 'crear' ? 'Club Infinity · Crear cuenta' : 'Club Infinity · Entrar', keep);
  }
  function openClub(tab) {
    K.err = ''; K.msg = ''; K.sec = 'inicio'; K.pedido = null; F.clave = '';
    var a = getAcct(); if (a) { F.correo = a.correo; if (!F.nombre) F.nombre = a.nombre; }
    K.tab = tab || (a ? 'entrar' : 'crear'); mode = 'club'; showOv(); clubPaint();
  }
  function award(a, n, msg) { a.puntos += n; putAcct(a); K.msg = msg; }

  function act(k, v, el) {
    var a = getAcct();
    switch (k) {
      case 'close': closeOv(); return;
      case 'res-menos': S.jug = Math.max(2, S.jug - 1); render(); resPaint(true); return;
      case 'res-mas': S.jug = Math.min(60, S.jug + 1); render(); resPaint(true); return;
      case 'res-bump': S.bump = true; R.bumpNo = false; $('bump').checked = true; render(); resPaint(true); return;
      case 'res-nobump': S.bump = false; R.bumpNo = true; $('bump').checked = false; render(); resPaint(true); return;
      case 'res-pay': if (celOk()) { R.paso = 'listo'; resPaint(); } return;
      case 'res-share': R.compartido = true; resPaint(true); return;
      case 'res-copy': R.copiado = true; R.compartido = true; try { navigator.clipboard.writeText('infinity.cl/p/8F3K').catch(function () {}); } catch (e) {} resPaint(true); return;
      case 'hf-si': R.upsell = 'pagando'; resPaint(true); return;
      case 'hf-no': R.upsell = 'no'; resPaint(true); return;
      case 'hf-pagar': R.upsell = 'si'; resPaint(true); return;
      case 'hf-volver': R.upsell = 'pendiente'; resPaint(true); return;
      case 'open-cel': openCel(v, el && el.dataset.d); return;
      case 'open-club': openClub(v); return;
      case 'cel-pack': C.pack = v; C.paso = 'fecha'; celPaint(); return;
      case 'cel-back': C.paso = C.paso === 'datos' ? 'fecha' : 'pack'; celPaint(); return;
      case 'cel-fecha': C.fecha = v; celPaint(true); return;
      case 'cel-horas': C.horas = +v; celPaint(true); return;
      case 'cel-inicio': C.inicio = +v; celPaint(true); return;
      case 'cel-bump': C.bump = !C.bump; celPaint(true); return;
      case 'cel-next': C.paso = 'datos'; celPaint(); return;
      case 'cel-pay': if (celOk()) celPay(); return;
      case 'cel-club': openClub(getAcct() ? 'entrar' : 'crear'); return;
      case 'cel-from-club': if (v) { openCel(v); } else { openCel(); } return;
      case 'club-tab': K.tab = v; K.err = ''; clubPaint(); return;
      case 'club-tipo': K.tipo = v; clubPaint(true); return;
      case 'club-crear':
        if (!crearOk()) return;
        putAcct({ nombre: F.nombre.trim(), celular: F.cel, correo: F.correo.trim(), tipo: K.tipo, puntos: 0, jugados: 0, demo: false, unidos: {}, recordado: false });
        setIn(true); K.sec = 'inicio'; K.msg = '¡Bienvenido al Club Infinity! Ya eres socio y tus puntos parten hoy.'; F.clave = ''; clubPaint(); return;
      case 'club-entrar':
        if (a && a.correo.toLowerCase() === F.correo.trim().toLowerCase()) { setIn(true); K.sec = 'inicio'; K.msg = 'Qué bueno verte de nuevo, ' + a.nombre.split(/\s+/)[0] + '.'; K.err = ''; F.clave = ''; clubPaint(); }
        else { K.err = 'No encontramos esa cuenta en este navegador. Revisa el correo o crea una cuenta.'; clubPaint(true); }
        return;
      case 'club-salir': setIn(false); K.tab = 'entrar'; K.msg = ''; clubPaint(); return;
      case 'sec': K.sec = v; K.msg = ''; clubPaint(); return;
      case 'goto-reservar': closeOv(); var r = $('reservar'); if (r) r.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return;
      case 'demo': if (a) { a.puntos = 1240; a.jugados = 3; a.demo = true; putAcct(a); K.msg = 'Cargamos datos de ejemplo: 1.240 puntos, 3 partidos jugados y un equipo con Hora Fija.'; clubPaint(); } return;
      case 'cart-add': K.cart[v] = (K.cart[v] || 0) + 1; clubPaint(true); return;
      case 'cart-minus': K.cart[v] = Math.max(0, (K.cart[v] || 0) - 1); clubPaint(true); return;
      case 'entrega': K.entrega = v; clubPaint(true); return;
      case 'cafe-pay': var t = cartTotal(); if (!t || !a) return; var p = Math.floor(t / 1000), code = 'INF-'; for (var i = 0; i < 4; i++) code += 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]; K.pedido = { code: code, total: t, pts: p, entrega: K.entrega }; K.cart = {}; award(a, p, ''); clubPaint(); return;
      case 'cafe-new': K.pedido = null; clubPaint(); return;
      case 'join': if (!a) return; a.unidos = a.unidos || {}; if (!a.unidos[v]) { a.unidos[v] = true; award(a, 10, 'Te uniste al partido · +10 puntos (simulado).'); } clubPaint(true); return;
      case 'canjear': if (!a) return; var c = CANJES[+v]; if (a.puntos >= c[1]) { a.puntos -= c[1]; putAcct(a); K.msg = 'Canjeaste: ' + c[0] + '. En la versión real te llega el código por WhatsApp.'; } clubPaint(true); return;
      case 'recordar': if (!a) return; a.recordado = true; putAcct(a); K.msg = 'Recordatorio enviado a los pendientes (simulado).'; clubPaint(true); return;
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    act(b.dataset.act, b.dataset.v, b);
  });
  ov.addEventListener('input', function (e) {
    var f = e.target.dataset && e.target.dataset.f; if (!f) return;
    var v = e.target.value; if (f === 'cel') { v = v.replace(/\D/g, '').slice(0, 8); e.target.value = v; }
    F[f] = v; syncBtns();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) closeOv(); });
  ov.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var els = ov.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'); if (!els.length) return;
    var f = els[0], l = els[els.length - 1];
    if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); } else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
  });
  $('ovX').addEventListener('click', closeOv);
  refreshLanding();

  /* ---------- escena 3D ---------- */
  var root = document.documentElement, scrollY = 0, prog = $('prog');
  function onScroll() {
    scrollY = window.scrollY;
    var m = Math.max(1, root.scrollHeight - window.innerHeight);
    prog.style.setProperty('--p', Math.min(1, scrollY / m).toFixed(4));
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var canvas = $('gl'), renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); } catch (e) { canvas.style.display = 'none'; return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x0a0a0a, 1);
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.014);
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);

  scene.add(new THREE.HemisphereLight(0x5a7a5a, 0x0a0a0a, 0.35));

  // césped con líneas
  var PW = 40, PH = 26, cv = document.createElement('canvas'); cv.width = 2048; cv.height = 1331;
  var cx = cv.getContext('2d'), cw = cv.width, ch = cv.height, k;
  for (k = 0; k < 12; k++) { cx.fillStyle = k % 2 ? '#124a1d' : '#0f3f18'; cx.fillRect(k * cw / 12, 0, cw / 12 + 1, ch); }
  cx.strokeStyle = 'rgba(255,255,255,0.88)'; cx.lineWidth = 7;
  cx.strokeRect(36, 36, cw - 72, ch - 72);
  cx.beginPath(); cx.moveTo(cw / 2, 36); cx.lineTo(cw / 2, ch - 36); cx.stroke();
  cx.beginPath(); cx.arc(cw / 2, ch / 2, 135, 0, 7); cx.stroke();
  cx.fillStyle = 'rgba(255,255,255,0.9)'; cx.beginPath(); cx.arc(cw / 2, ch / 2, 9, 0, 7); cx.fill();
  cx.strokeRect(36, ch / 2 - 290, 310, 580); cx.strokeRect(cw - 346, ch / 2 - 290, 310, 580);
  cx.strokeRect(36, ch / 2 - 140, 120, 280); cx.strokeRect(cw - 156, ch / 2 - 140, 120, 280);
  var tex = new THREE.CanvasTexture(cv); tex.anisotropy = 8;
  var pitch = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 }));
  pitch.rotation.x = -Math.PI / 2; scene.add(pitch);
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x070707, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.03; scene.add(ground);

  // arcos
  var postMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.4 });
  [-1, 1].forEach(function (sx) {
    var g = new THREE.Group(), gw = 6, gh = 2.2;
    [-gw / 2, gw / 2].forEach(function (z) { var p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, gh, 10), postMat); p.position.set(0, gh / 2, z); g.add(p); });
    var bar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, gw, 10), postMat); bar.rotation.x = Math.PI / 2; bar.position.y = gh; g.add(bar);
    var net = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, side: THREE.DoubleSide }));
    net.rotation.y = Math.PI / 2; net.position.set(sx * -1.2, gh / 2, 0); g.add(net);
    g.position.x = sx * (PW / 2 - 0.2); scene.add(g);
  });

  // torres de luz
  var spots = [], cones = [];
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) {
    var px = c[0] * 23, pz = c[1] * 15.5, hy = 13;
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, hy, 10), new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.7 }));
    pole.position.set(px, hy / 2, pz); scene.add(pole);
    var head = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 0.35), new THREE.MeshBasicMaterial({ color: 0xeaffd8 }));
    head.position.set(px, hy + 0.4, pz); head.lookAt(0, 0, 0); scene.add(head);
    var sp = new THREE.SpotLight(0xf1ffe6, 0, 120, 0.62, 0.85, 1);
    sp.position.set(px, hy, pz); sp.target.position.set(0, 0, 0); scene.add(sp); scene.add(sp.target); spots.push(sp);
    var cg = new THREE.ConeGeometry(9, 30, 40, 1, true); cg.translate(0, -15, 0); cg.rotateX(-Math.PI / 2);
    var cm = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ color: 0xc8ffa8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cm.position.set(px, hy, pz); cm.lookAt(0, 0, 0); scene.add(cm); cones.push(cm);
  });

  // balón
  var bg = new THREE.IcosahedronGeometry(0.72, 1).toNonIndexed(), cols = [], f, nf = bg.attributes.position.count / 3;
  for (f = 0; f < nf; f++) { var dark = (f * 7) % 5 === 0 ? 0.06 : 0.96; for (var v = 0; v < 3; v++) cols.push(dark, dark, dark); }
  bg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  var ball = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.45, metalness: 0.05 }));
  ball.position.set(-4, 0.72, 0); scene.add(ball);
  var halo = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.3, 48), new THREE.MeshBasicMaterial({ color: 0x7cff3a, transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
  halo.rotation.x = -Math.PI / 2; halo.position.y = 0.03; scene.add(halo);

  // partículas
  var pn = 520, pp = new Float32Array(pn * 3);
  for (k = 0; k < pn; k++) { pp[k * 3] = (Math.random() - 0.5) * 90; pp[k * 3 + 1] = Math.random() * 28; pp[k * 3 + 2] = (Math.random() - 0.5) * 70; }
  var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  var pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xd8ffc0, size: 0.09, transparent: true, opacity: 0.55, depthWrite: false })); scene.add(pts);

  // trayectoria de cámara
  var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };
  var camPath = new THREE.CatmullRomCurve3([V(0, 30, 40), V(-20, 11, 19), V(-5, 2.4, 7.5), V(13, 4.5, 11), V(22, 5, -6), V(8, 3, -11), V(0, 46, 3)], false, 'centripetal');
  var tgtPath = new THREE.CatmullRomCurve3([V(0, 0, 0), V(-4, 0.5, 0), V(-1, 0.8, 0), V(5, 1, -1), V(-8, 1.5, 0), V(0, 0.8, 0), V(0, 0, 0)], false, 'centripetal');

  var W = 1, H = 1, mobile = false;
  function resize() { W = window.innerWidth; H = window.innerHeight; mobile = W < 820; renderer.setSize(W, H, false); camera.aspect = W / H; camera.fov = mobile ? 62 : 42; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', resize); resize();
  var mx = 0, my = 0;
  if (!reduce) window.addEventListener('pointermove', function (e) { mx = e.clientX / W - 0.5; my = e.clientY / H - 0.5; }, { passive: true });

  var sp = 0, last = 0, t0 = performance.now(), pos = new THREE.Vector3(), tg = new THREE.Vector3(), prevBx = -4, prevBz = 0;
  function frame(now) {
    if (window.__ovOpen) { last = now; requestAnimationFrame(frame); return; }
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    var m = Math.max(1, root.scrollHeight - H), p = Math.min(1, scrollY / m);
    sp += (p - sp) * (reduce ? 1 : 0.06);

    // encendido de las luces
    var on = reduce ? 1 : Math.min(1, (now - t0) / 2200), fl = on < 1 ? (0.7 + 0.3 * Math.sin(now * 0.05)) : 1, lv = on * on * fl;
    for (var i = 0; i < 4; i++) { spots[i].intensity = lv * 1.9; cones[i].material.opacity = lv * 0.05; }

    camPath.getPoint(sp, pos); tgtPath.getPoint(sp, tg);
    if (mobile) { pos.z += 2; pos.y += 1.2; }
    camera.position.set(pos.x + mx * 2.2, pos.y - my * 1.2, pos.z);
    camera.lookAt(tg);

    // balón rueda con el scroll
    var bx = -4 + sp * 22, bz = Math.sin(sp * 9) * 3.2;
    ball.position.x = bx; ball.position.z = bz; ball.position.y = 0.72 + Math.abs(Math.sin(sp * 40)) * 0.15 * (sp > 0.02 ? 1 : 0);
    var ddx = bx - prevBx, ddz = bz - prevBz; prevBx = bx; prevBz = bz;
    ball.rotation.z -= ddx / 0.72; ball.rotation.x += ddz / 0.72;
    if (!reduce) ball.rotation.y += dt * 0.4;
    halo.position.x = bx; halo.position.z = bz; var hs = 1 + 0.12 * Math.sin(now * 0.004); halo.scale.set(hs, hs, 1);
    if (!reduce) pts.rotation.y += dt * 0.012;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
