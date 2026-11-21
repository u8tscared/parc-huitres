/* Le Parc à Huîtres × Growth Gusto. Le site garde son design ; tout ce qui change vient de l'app (app.growthgusto.fr) :
   horaires et fermetures, annonce du moment, la carte (plats, prix, descriptions, photos, allergènes, en français, espagnol, anglais),
   la vente à emporter (prix à emporter, huîtres ouvertes, consignes, créneaux de retrait, commande reçue dans l'app) et la réservation
   (le module de réservation Growth Gusto, posé dans la page). Identifiant : <meta name="gg-r"> (ou ?gg= pour essayer).
   Sans identifiant, ou si Growth Gusto ne répond pas, la page garde ses données d'exemple. Lit w/gg-site.js (window.GGSite). */
(function () {
  "use strict";
  var meta = document.querySelector('meta[name="gg-r"]'), qs = new URLSearchParams(location.search);
  var RID = String(qs.get("gg") || (meta && meta.content) || "").trim();
  if (!RID || !window.GGSite || typeof MENU === "undefined") return;
  var D = null, ON = false, TAKE = false, KEYS = {}, SPEC = {}, ORIG = {};
  var AL = { lait: "2", oeufs: "3", gluten: "4", poissons: "5", mollusques: "6", sulfites: "7", arachides: "8", moutarde: "9", crustaces: "0" };
  var norm = function (s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); };
  var base = function (s) { return String(s || "").replace(/\s*·\s*(verre|bouteille|à emporter|copa|botella|para llevar|glass|bottle|takeaway)$/i, ""); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); };
  /* the page's own drawings stay, found by the dish's French name */
  MENU.forEach(function (c) { var n = {}; c.items.forEach(function (it, i) { String(it[0]).split(" / ").forEach(function (x) { ORIG[norm(c.id + "|" + x)] = c.id + ":" + i; }); }); });
  var ICON = {}, SUB = {}; MENU.forEach(function (c) { ICON[c.id] = c.icon; SUB[c.id] = c.n; });
  function origOf(cat, t) { return ORIG[norm(cat + "|" + base(t))] || ORIG[norm(cat + "|" + t)] || ""; }
  var fmt = function (v) { return (+v).toFixed(2).replace(".", ","); };

  function build(L) {
    var fr = L.fr, byId = { es: {}, en: {} }, catT = { es: {}, en: {} };
    ["es", "en"].forEach(function (g) { (L[g] ? L[g].carte.items : []).forEach(function (i) { byId[g][i.id] = i; }); (L[g] ? L[g].carte.cats : []).forEach(function (c) { catT[g][c.id] = c.t; }); });
    var tri = function (i, k) { return [i[k], (byId.es[i.id] || i)[k], (byId.en[i.id] || i)[k]]; };
    KEYS = {};
    /* 1 · the menu (dishes served on site), wines « · verre » + « · bouteille » back on one line */
    var M = [];
    fr.carte.cats.forEach(function (c) {
      var its = fr.carte.items.filter(function (i) { return i.c === c.id && !i.ot && !i.out; }), rows = [], seen = {};
      its.forEach(function (i) {
        if (seen[i.id]) return; var t = tri(i, "t"), d = tri(i, "d"), p = i.p, m = /\s*·\s*verre$/i.exec(i.t);
        if (m) { var b = its.find(function (x) { return !seen[x.id] && norm(x.t) === norm(base(i.t) + " · bouteille"); }); if (b) { seen[b.id] = 1; p = fmt(i.p) + " / " + fmt(b.p); t = t.map(base); d = d.map(function (x) { return String(x || "").replace(/\s*·\s*[\d,.]+\s*cl$/i, ""); }); } }
        seen[i.id] = 1;
        var k = c.id + ":" + rows.length; KEYS[k] = { o: origOf(c.id, i.t), ph: i.ph };
        rows.push([t[0], t[1], t[2], d[0], d[1], d[2], p, (i.al || []).map(function (a) { return AL[a] || ""; }).join(""), i.nt ? 0 : 1]);
      });
      if (rows.length) M.push({ id: c.id, t: [c.t, catT.es[c.id] || c.t, catT.en[c.id] || c.t], n: SUB[c.id] || ["", "", ""], icon: ICON[c.id] || "", items: rows });
    });
    if (M.length) { MENU.length = 0; M.forEach(function (c) { MENU.push(c); }); }
    /* the oysters of the home page: their prices */
    try { OYS.forEach(function (o) { var n = norm(Array.isArray(o.n) ? o.n[0] : o.n); var i = fr.carte.items.find(function (x) { return x.c === "huitres" && !x.ot && norm(x.t).indexOf(n) === 0; }); if (i) o.p = i.p; }); } catch (e) {}
    /* 2 · takeaway: dozens closed or opened (+ the « Ouverture » line), the takeaway platter, deposits for opened oysters */
    TAKE = !!(fr.take && fr.take.open);
    if (TAKE) {
      var T = GGSite.takeItems(fr); SPEC = {};
      T.forEach(function (i) { var n = norm(i.t); if (/^ouverture/.test(n)) SPEC.open = i; else if (i.c === "consignes" && /petit/.test(n)) SPEC.small = i; else if (i.c === "consignes" && /grand/.test(n)) SPEC.large = i; });
      if (SPEC.open) OPEN_FEE = SPEC.open.p; if (SPEC.small) CONSIGNE.small = SPEC.small.p; if (SPEC.large) CONSIGNE.large = SPEC.large.p;
      PRODS.length = 0; Object.keys(CART).forEach(function (k) { delete CART[k]; }); TCAT = "all";
      fr.carte.cats.forEach(function (c) {
        var cat = MENU.find(function (x) { return x.id === c.id; }) || { id: c.id, t: [c.t, catT.es[c.id] || c.t, catT.en[c.id] || c.t] };
        T.filter(function (i) { return i.c === c.id && i !== SPEC.open && i !== SPEC.small && i !== SPEC.large; }).forEach(function (i) {
          var k = "t:" + i.id, t = tri(i, "t").map(function (x, j) { return j === 0 ? x : x; }), d = tri(i, "d");
          var o = origOf(c.id, i.t) || (c.id === "plateaux" && i.ot ? "plateaux:0" : ""); KEYS[k] = { o: o, ph: i.ph };
          PRODS.push({ k: k, gid: i.id, cat: cat, it: [base(t[0]), base(t[1]), base(t[2]), d[0], d[1], d[2], i.p, "", 1], price: i.p,
            mode: c.id === "huitres" && SPEC.open ? "choice" : c.id === "plateaux" && i.ot ? "always" : null });
        });
      });
    }
    ON = true;
  }
  function notice(n) {
    var el = document.getElementById("ggpNote"); if (!n || !n.t) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement("div"); el.id = "ggpNote"; el.setAttribute("role", "status");
      el.style.cssText = "position:relative;z-index:60;background:var(--lemon,#F2D27A);color:var(--navy,#1B2A4A);text-align:center;font-weight:600;padding:10px 48px 10px 16px;font-size:.95rem;line-height:1.35";
      var x = document.createElement("button"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.textContent = "×"; x.style.cssText = "position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:none;font-size:1.4rem;cursor:pointer;color:inherit";
      x.onclick = function () { el.remove(); }; el.appendChild(document.createElement("span")); el.appendChild(x); document.body.insertBefore(el, document.body.firstChild); }
    el.firstChild.textContent = n.t;
  }
  function hours(fr) {
    if (!fr.linked) return; var any = false; for (var g = 0; g < 7; g++) if ((fr.hours[g] || []).length) any = true; if (!any) return;
    for (var i = 0; i < 7; i++) { var h = fr.hours[(i + 1) % 7] || []; HOURS[i] = h.length ? h : null; }
  }
  function resa(fr) {
    if (!fr.resa || !fr.resa.on || document.querySelector("[data-gg=resa]")) return;
    var f = document.getElementById("bookform"); if (!f) return;
    var box = document.createElement("div"); box.className = "card"; box.setAttribute("data-gg", "resa"); box.style.minHeight = "420px";
    f.parentNode.insertBefore(box, f); f.hidden = true; f.style.display = "none";
    try { var rc = document.getElementById("brecap"); if (rc && rc.closest(".card")) rc.closest(".card").style.display = "none"; } catch (e) {}
    var s = document.createElement("script"); s.src = "https://app.growthgusto.fr/w/gg.js"; s.async = true; s.setAttribute("data-r", RID); document.body.appendChild(s);
  }
  function contact(fr) {
    var f = document.getElementById("cform"); if (!f || !fr.email || f.dataset.gg) return; f.dataset.gg = "1";
    f.addEventListener("submit", function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      var g = function (id) { var x = document.getElementById(id); return x ? x.value.trim() : ""; };
      var body = g("cmsg") + "\n\n" + g("cname") + (g("cemail") ? " · " + g("cemail") : "");
      location.href = "mailto:" + fr.email + "?subject=" + encodeURIComponent(g("csub") || "Contact") + "&body=" + encodeURIComponent(body);
    }, true);
  }
  function demoOff() { var st = document.createElement("style"); st.textContent = '.demo[data-i="demo_gg"],.demo[data-i="demo"]{display:none!important}'; document.head.appendChild(st); }

  window.GGP = {
    rid: RID,
    on: function () { return ON && TAKE; },
    ill: function (k) { var x = KEYS[k]; if (!ON || !x) return null; if (x.ph) return '<img src="' + esc(x.ph) + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block">'; return x.o && ILL[x.o] ? ILL[x.o]() : ""; },
    shut: function (k) { return !!(D && (D.closures || []).some(function (c) { return c.from <= k && k <= (c.to || c.from); })); },
    days: function () { return D ? GGSite.days(D).map(function (k) { return new Date(k + "T12:00:00"); }) : []; },
    slots: function (dt) { return D && dt ? GGSite.slots(D, ymd(dt)) : []; },
    say: function (e) { return GGSite.say(e, LANG); },
    send: function () {
      var items = [];
      cartLines().forEach(function (c) {
        items.push({ id: c.p.gid, q: c.q, note: c.v === "o" ? "Ouvertes" : c.v === "c" ? "Fermées, en bourriche" : "" });
        if (c.v === "o" && SPEC.open) items.push({ id: SPEC.open.id, q: c.q });
      });
      trays().forEach(function (t) { var s = t.u === CONSIGNE.large && SPEC.large ? SPEC.large : SPEC.small; if (s) items.push({ id: s.id, q: t.q }); });
      var dt = tDays()[T.day];
      return GGSite.order(RID, { items: items, name: $("#tname").value, phone: $("#tphone").value, slot: T.slot, day: dt ? ymd(dt) : "" })
        .then(function (r) { var o = r.order || {}; return { no: o.n ? "N° " + o.n : "PAH", track: r.track, pending: o.status === "demande" || !!(D.take && D.take.confirm) }; });
    },
  };

  Promise.all(["fr", "es", "en"].map(function (g) { return GGSite.load(RID, { lang: g }).catch(function () { return null; }); })).then(function (r) {
    if (!r[0]) return; D = r[0];
    try { build({ fr: r[0], es: r[1], en: r[2] }); } catch (e) { console.warn("gg-parc carte", e); }
    try { hours(D); } catch (e) {}
    notice(D.notice); resa(D); contact(D); demoOff();
    applyLang(LANG, AUTO);
  });
})();
