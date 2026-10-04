/* Lucio De Curtis — Sports Photography
   Scroll mechanics modelled on the split-screen / clip-path loop of glitchandgrit.com */
gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip);

const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
};
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mm = gsap.matchMedia();
let lenis = null;

/* ---------- smooth scroll ---------- */
function initLenis() {
  // touch devices keep native scrolling (smoother on iOS, no stuck positions near the top)
  if (typeof Lenis === "undefined" || reduced || window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- current links / year ---------- */
function initCurrent() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((a) => {
    const h = a.getAttribute("href");
    if (h === path || (path.startsWith("project-") && h === "work.html")) a.classList.add("is-current");
  });
  document.querySelectorAll(".current-year").forEach((e) => (e.textContent = new Date().getFullYear()));
}

/* ---------- page transition (split panels) ---------- */
function initTransitions() {
  const L = document.querySelector(".pt-bk.is-left");
  const R = document.querySelector(".pt-bk.is-right");
  if (!L || !R) return;
  if (document.documentElement.classList.contains("pt-in")) {
    document.documentElement.classList.remove("pt-in");
    gsap.set([L, R], { yPercent: 0 });
    gsap.timeline({ delay: 0.1 })
      .to(L, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 0)
      .to(R, { yPercent: 100, duration: 1, ease: "expo.inOut" }, 0);
  }
  // arriving from a project card: the page comes into focus from a soft blur
  const D = document.documentElement;
  const PAGE = ".page_main, .page_scroll";
  if (D.classList.contains("pb-in")) {
    // the fixed footer sits behind the page: keep it hidden until the page is opaque again
    gsap.set(".footer", { autoAlpha: 0 });
    gsap.delayedCall(1, () => gsap.set(".footer", { clearProps: "opacity,visibility" }));
    gsap.fromTo(PAGE, { opacity: 0, filter: "blur(18px)", scale: 1.015 },
      { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.9, ease: "power2.out", delay: 0.05,
        onStart: () => D.classList.remove("pb-in"), clearProps: "opacity,filter,transform" });
  }
  // leaving through a project card: the page melts into a blur (no full-screen photo)
  const cardBlur = (href) => {
    store.set("pb", "1");
    lenis && lenis.stop();
    gsap.timeline({ onComplete: () => (location.href = href) })
      .to(PAGE, { opacity: 0, filter: "blur(18px)", scale: 0.985, duration: 0.55, ease: "power2.in" }, 0)
      .to(".nav", { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.1)
      .to("body:not(.is-home) .footer", { autoAlpha: 0, duration: 0.15 }, 0);
  };
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") ||
        a.target === "_blank" || /^https?:/.test(href)) return;
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      if (!reduced && href.startsWith("project-") && (a.matches(".wc") || a.matches(".home-link") || a.closest(".next-project, .mk-next"))) return cardBlur(href);
      store.set("pt", "1");
      lenis && lenis.stop();
      gsap.timeline({ onComplete: () => (location.href = href) })
        .fromTo(L, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0)
        .fromTo(R, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0);
    });
  });
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    // back/forward cache: the page comes back exactly as we left it (mid-transition) — reset it
    gsap.globalTimeline.getChildren(true, true, false).forEach((t) => { if (t.vars && t.vars.onComplete && !t.scrollTrigger) t.kill(); });
    gsap.set([L, R], { yPercent: (i) => (i ? 100 : -100) });
    gsap.set([".page_main, .page_scroll", ".nav", ".footer"], { clearProps: "opacity,filter,transform,visibility" });
    document.body.style.overflow = "";
    lenis && lenis.start();
    ScrollTrigger.refresh();
  });
}

/* ---------- loader: name types in, then flies to the bottom corners ---------- */
function initLoader(done) {
  const loader = document.querySelector(".loader");
  if (!loader || document.documentElement.classList.contains("no-loader") || reduced) {
    loader && (loader.style.display = "none");
    return done();
  }
  store.set("seen", "1");
  const nav = document.querySelector(".nav");
  const row = loader.querySelector(".loader-row");
  const a = row.querySelector(".is-a"), m = row.querySelector(".is-m"), b = row.querySelector(".is-b");
  const bkL = loader.querySelector(".loader-bk.is-left"), bkR = loader.querySelector(".loader-bk.is-right");
  const count = loader.querySelector(".loader-count");
  lenis && lenis.stop();
  document.body.style.overflow = "hidden";
  gsap.set(nav, { opacity: 0 });
  a.textContent = ""; b.textContent = ""; gsap.set(m, { opacity: 0 });

  const n = { v: 0 };
  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(n, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => (count.textContent = String(Math.round(n.v)).padStart(3, "0")) }, 0)
    .to(a, { duration: 0.8, text: { value: "LUCIO", delimiter: "" }, ease: "none" }, 0)
    .to(b, { duration: 0.8, text: { value: "DE CURTIS", delimiter: "" }, ease: "none" }, 0)
    .to(m, { opacity: 1, duration: 0.3 }, 0.6)
    // iOS-style: the name softens into a blur, swaps font while it can't be read, then sharpens on its way down
    .to(row, { filter: "blur(14px)", opacity: 0.25, duration: 0.32, ease: "power2.in" }, "+=0.35")
    .to(count, { opacity: 0, duration: 0.3 }, "<")
    .add(() => {
      const state = Flip.getState([a, m, b], { props: "fontSize,letterSpacing" });
      row.classList.add("is-done");
      Flip.from(state, { duration: 1.2, ease: "expo.inOut", absolute: false });
    })
    .to(row, { filter: "blur(0px)", opacity: 1, duration: 0.75, ease: "power2.out" }, ">0.12")
    .to(bkL, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "+=0.3")
    .to(bkR, { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
    .to(nav, { opacity: 1, duration: 0.4, ease: "power2.inOut" }, "+=0.2")
    .to(row, { opacity: 0, duration: 0.4, ease: "power2.inOut", onComplete: () => {
      loader.style.display = "none";
      document.body.style.overflow = "";
      lenis && lenis.start();
      done();
    } }, "<");
}

/* ---------- HOME: split visuals + sheared title, infinite loop ---------- */
function initHomeScroll() {
  const page = document.querySelector(".page_scroll");
  if (!page) return;
  const list = page.querySelector(".home-projects-list");
  const trigWrap = page.querySelector(".home-triggers-wrap");
  let items = [...list.querySelectorAll(".home-projects-item")];
  if (!items.length) return;

  // two intro slides, then a short dwell before the "scegli il percorso" section arrives
  const total = items.length;
  const nTrig = total + 1;
  trigWrap.innerHTML = "";
  for (let i = 0; i < nTrig; i++) trigWrap.insertAdjacentHTML("beforeend", '<div class="home-trigger"></div>');
  const trigs = [...trigWrap.querySelectorAll(".home-trigger")];
  trigWrap.style.height = 100 * total + 70 + "vh";
  trigs[trigs.length - 1].style.height = "70vh";

  const S = items.map((el, i) => {
    const v = el.querySelectorAll(".home-project-visual-wrap");
    gsap.set(el, { zIndex: i, pointerEvents: "none" });
    return {
      el, first: v[0], second: v[1],
      firstInner: v[0].querySelector(".g_visual_wrap"), secondInner: v[1].querySelector(".g_visual_wrap"),
      cL: el.querySelector(".home-project-item-content.is-left"),
      cR: el.querySelector(".home-project-item-content.is-right"),
      bL: el.querySelectorAll(".home-project-item-content.is-left .home-content-block, .home-project-item-content.is-left .home-index"),
      bR: el.querySelectorAll(".home-project-item-content.is-right .home-content-block, .home-project-item-content.is-right .home-index")
    };
  });

  S.forEach((s, i) => {
    if (i === 0) {
      gsap.set([s.first, s.second], { clipPath: "inset(0% 0% 0% 0%)" });
    } else {
      gsap.set(s.first, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(s.second, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(s.cL, { clipPath: "inset(100% 50% 0% 0%)" });
      gsap.set(s.cR, { clipPath: "inset(0% 0% 100% 50%)" });
    }
    gsap.set([s.bL, s.bR], { y: 0 });
  });

  let active = -1;
  function setActive(e) {
    if (e === active) return;
    active = e;
    S.forEach((s, t) => {
      s.el.style.pointerEvents = t === e ? "auto" : "none";
      s.el.style.visibility = Math.abs(t - e) <= 1 ? "visible" : "hidden";
    });
    document.querySelectorAll("[data-home-counter]").forEach((c) => {
      c.textContent = String(e + 1).padStart(2, "0") + " / " + String(S.length).padStart(2, "0");
    });
    document.dispatchEvent(new CustomEvent("home:active", { detail: e }));
  }
  setActive(0);

  const sts = [];
  trigs.forEach((trig, e) => {
    const t = S[e], o = S[e - 1];
    if (!t || !o || e === 0) return;
    const st = () => ({ trigger: trig, start: "top center", end: "bottom center", scrub: true });
    const tl = gsap.timeline({ scrollTrigger: st() })
      .fromTo(o.firstInner, { yPercent: 0 }, { yPercent: -20, ease: "none", immediateRender: false }, 0)
      .fromTo(o.secondInner, { yPercent: 0 }, { yPercent: 20, ease: "none", immediateRender: false }, 0)
      .fromTo(t.firstInner, { yPercent: 20 }, { yPercent: 0, ease: "none" }, 0)
      .fromTo(t.secondInner, { yPercent: -20 }, { yPercent: 0, ease: "none" }, 0)
      .fromTo(t.first, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
      .fromTo(t.second, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
      .fromTo(o.cL, { clipPath: "inset(0% 50% 0% 0%)" }, { clipPath: "inset(0% 50% 100% 0%)", ease: "none", immediateRender: false }, 0)
      .fromTo(o.cR, { clipPath: "inset(0% 0% 0% 50%)" }, { clipPath: "inset(100% 0% 0% 50%)", ease: "none", immediateRender: false }, 0)
      .fromTo(t.cL, { clipPath: "inset(100% 50% 0% 0%)" }, { clipPath: "inset(0% 50% 0% 0%)", ease: "none" }, 0)
      .fromTo(t.cR, { clipPath: "inset(0% 0% 100% 50%)" }, { clipPath: "inset(0% 0% 0% 50%)", ease: "none" }, 0);
    sts[e] = tl.scrollTrigger;
    gsap.timeline({ scrollTrigger: st() })
      .fromTo(t.bL, { y: "30vh" }, { y: "0vh", ease: "power2.out" }, 0)
      .fromTo(t.bR, { y: "-30vh" }, { y: "0vh", ease: "power2.out" }, 0)
      .fromTo(o.bL, { y: "0vh" }, { y: "-30vh", ease: "power2.in", immediateRender: false }, 0)
      .fromTo(o.bR, { y: "0vh" }, { y: "30vh", ease: "power2.in", immediateRender: false }, 0);
  });

  trigs.forEach((trig, e) => {
    if (!S[e]) return;
    ScrollTrigger.create({
      trigger: trig, start: "top top", end: "bottom top",
      onEnter: () => setActive(e), onEnterBack: () => setActive(e),
      onLeave: (self) => { if (self.direction === 1 && S[e + 1]) setActive(e + 1); },
      onLeaveBack: (self) => { if (self.direction === -1 && S[e - 1]) setActive(e - 1); }
    });
  });

  const hint = document.querySelector(".scroll-hint");
  if (hint) {
    // centre the arrow between the first slide's link and the bottom name bar
    const place = () => {
      const link = items[0].querySelector(".home-link"), bar = document.querySelector(".nav-row.is-bottom");
      if (!link || !bar) return;
      const a = link.getBoundingClientRect().bottom, b = bar.getBoundingClientRect().top;
      hint.style.top = ((a + b) / 2 - hint.offsetHeight / 2) + "px";
    };
    place(); window.addEventListener("resize", place);
    if (document.fonts) document.fonts.ready.then(place);
    setTimeout(() => hint.classList.add("is-in"), document.documentElement.classList.contains("no-loader") ? 1200 : 3200);
    ScrollTrigger.create({ start: 40, onEnter: () => hint.classList.add("is-gone"), onLeaveBack: () => hint.classList.remove("is-gone") });
  }

  // the link of the slide in view glows as soon as the slide arrives (after the first scroll)
  let idleT;
  const idleOff = () => document.querySelectorAll(".home-link.is-idle").forEach((l) => l.classList.remove("is-idle"));
  document.addEventListener("home:active", (ev) => {
    clearTimeout(idleT); idleOff();
    if (window.scrollY <= 40) return;
    idleT = setTimeout(() => items[ev.detail] && items[ev.detail].querySelectorAll(".home-link").forEach((l) => l.classList.add("is-idle")), 250);
  });
}


/* ---------- HOME: "scegli il percorso" — the slides fall back into depth, the choices fly in in 3D ---------- */
function initHomePick() {
  const sec = document.querySelector("[data-hpick]");
  const list = document.querySelector(".home-projects-list");
  if (!sec || !list) return;
  const q = (s) => sec.querySelectorAll(s);
  const band = sec.querySelector(".hp-band"), works = [...q(".hp-work")];
  if (reduced) { gsap.set(list, { autoAlpha: 0 }); return; }

  // 1) while the section rises: the slides recede (tilt + scale + fade), the grid glow fades in
  gsap.timeline({ scrollTrigger: { trigger: sec, start: "top bottom", end: "top top", scrub: true } })
    .fromTo(list, { scale: 1, rotationX: 0, yPercent: 0, autoAlpha: 1, transformPerspective: 1400, transformOrigin: "50% 100%" },
      { scale: .78, rotationX: 14, yPercent: -10, autoAlpha: 0, ease: "power1.in" }, 0)
    .fromTo(sec.querySelector(".hpick-bg"), { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
    .fromTo(q(".hpick-kick"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: "power2.out", duration: .4 }, .55)
    .fromTo(q(".hpick-title .hl > *"), { yPercent: 110, rotationX: -70 }, { yPercent: 0, rotationX: 0, stagger: .12, ease: "power3.out", duration: .45 }, .5);

  // 2) pinned: Career band drops in from above, the two work cards swing open like doors
  const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top top", end: "+=" + Math.round(window.innerHeight * 1.1), pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true } });
  tl.fromTo(band, { z: -500, rotationX: 70, yPercent: -60, opacity: 0, transformOrigin: "50% 0%" }, { z: 0, rotationX: 0, yPercent: 0, opacity: 1, ease: "power3.out", duration: .55 }, 0)
    .fromTo(band.querySelector(".hp-line"), { scaleX: 0 }, { scaleX: 1, ease: "power2.inOut", duration: .5 }, .25)
    .fromTo(band.querySelectorAll(".hp-rail span"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: .06, duration: .2 }, .3)
    .fromTo(band.querySelectorAll(".hp-av, .hp-bt, .hp-cta"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: .07, duration: .3 }, .2);
  works.forEach((c, i) => {
    const s = i ? -1 : 1;
    tl.fromTo(c, { z: -900, xPercent: -40 * s, rotationY: 42 * s, rotationZ: -4 * s, opacity: 0, transformOrigin: i ? "100% 50%" : "0% 50%" },
      { z: 0, xPercent: 0, rotationY: 0, rotationZ: 0, opacity: 1, ease: "power3.out", duration: .8 }, .3 + i * .12)
      .fromTo(c.querySelector("img"), { scale: 1.35 }, { scale: 1, ease: "power2.out", duration: .9 }, .3 + i * .12)
      .fromTo(c.querySelectorAll(".hp-num, .hp-txt b, .hp-txt small, .hp-txt .hp-cta"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, stagger: .06, ease: "power2.out", duration: .3 }, .75 + i * .12);
  });
  tl.to({}, { duration: .35 }); // short hold once everything has landed

  // the bottom name bar slides away when the footer comes in
  const ft = document.querySelector(".footer");
  if (ft) gsap.to(".nav-row.is-bottom", { y: "4rem", ease: "none", scrollTrigger: { trigger: ft, start: "top bottom", end: "top 75%", scrub: true } });
}

/* ---------- HOME: WebGL "liquid" photos — bend with scroll speed, depth parallax with the mouse ---------- */
const HOME_GL = { vel: 0, mx: 0, my: 0, t: 0 };
function initHomeGL() {
  if (reduced || !document.querySelector(".home-projects-list")) return;
  const test = document.createElement("canvas").getContext("webgl");
  if (!test) return;
  test.getExtension("WEBGL_lose_context")?.loseContext();
  const items = [...document.querySelectorAll(".home-projects-item")];
  const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
  const VS = "attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}";
  const FS = `precision mediump float;varying vec2 v;uniform sampler2D T,D;uniform vec2 R,I,P,M;uniform float V,S,H;
  vec2 cov(vec2 u){float s=max(R.x/I.x,R.y/I.y);vec2 z=I*s;vec2 o=(R-z)*P;return (u*R-o)/z;}
  void main(){
    vec2 u=v;float a=abs(V);
    u.y+=sin(u.x*3.14159)*V*.07;                 // the whole photo bends like a sheet
    u.x+=sin(u.y*9.+S*2.)*V*.012;                // soft ripple
    u=(u-.5)*(1.-a*.05)+.5;                      // slight zoom while moving
    vec2 c=cov(u);
    if(H>.5){float d=texture2D(D,clamp(c,0.,1.)).r;c-=M*(d-.35)*.018;}  // depth parallax
    vec2 o=vec2(0.,V*.010);
    float r=texture2D(T,clamp(c+o,0.,1.)).r,g=texture2D(T,clamp(c,0.,1.)).g,b=texture2D(T,clamp(c-o,0.,1.)).b;
    gl_FragColor=vec4(r,g,b,1.);
  }`;
  class Pane {
    constructor(wrap) {
      this.wrap = wrap; this.img = wrap.querySelector("img");
      const pos = (this.img.style.objectPosition || "50% 50%").split(" ").map((x) => parseFloat(x) / 100);
      this.pos = [isNaN(pos[0]) ? .5 : pos[0], isNaN(pos[1]) ? .5 : pos[1]];
      const c = this.c = document.createElement("canvas"); c.className = "home-gl"; c.setAttribute("aria-hidden", "true");
      const gl = this.gl = c.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
      const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; };
      const pr = this.pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.u = {}; ["T","D","R","I","P","M","V","S","H"].forEach((k) => (this.u[k] = gl.getUniformLocation(pr, k)));
      gl.uniform1i(this.u.T, 0); gl.uniform1i(this.u.D, 1); gl.uniform1f(this.u.H, 0);
      this.ready = false; this.hasDepth = false;
      const load = () => { if (this.dead) return; this.tex(0, this.img); gl.uniform2f(this.u.I, this.img.naturalWidth, this.img.naturalHeight); this.ready = true; this.dirty = true; c.classList.add("is-on"); };
      this.img.complete && this.img.naturalWidth ? load() : this.img.addEventListener("load", load, { once: true });
      const dsrc = this.img.dataset.depth;
      if (dsrc) { const d = new Image(); d.onload = () => { if (this.dead) return; this.tex(1, d); gl.uniform1f(this.u.H, 1); this.hasDepth = true; this.dirty = true; }; d.src = dsrc; }
      wrap.appendChild(c); this.resize();
    }
    tex(unit, src) {
      const gl = this.gl, t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
      [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    resize() {
      const w = Math.max(1, Math.round(this.wrap.clientWidth * dpr)), h = Math.max(1, Math.round(this.wrap.clientHeight * dpr));
      if (this.c.width !== w || this.c.height !== h) { this.c.width = w; this.c.height = h; this.gl.viewport(0, 0, w, h); this.gl.uniform2f(this.u.R, w, h); this.dirty = true; }
    }
    draw() {
      if (!this.ready) return;
      const gl = this.gl, u = this.u;
      gl.uniform2f(u.P, this.pos[0], this.pos[1]); gl.uniform1f(u.V, HOME_GL.vel); gl.uniform1f(u.S, HOME_GL.t); gl.uniform2f(u.M, HOME_GL.mx, HOME_GL.my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); this.dirty = false;
    }
    destroy() { this.dead = true; this.gl.getExtension("WEBGL_lose_context")?.loseContext(); this.c.remove(); }
  }
  const panes = new Map();
  const sync = (e) => {
    const want = new Set();
    [e - 1, e, e + 1].forEach((k) => { const it = items[k]; if (it) it.querySelectorAll(".g_visual_wrap").forEach((w) => want.add(w)); });
    panes.forEach((p, w) => { if (!want.has(w)) { p.destroy(); panes.delete(w); } });
    want.forEach((w) => { if (!panes.has(w)) panes.set(w, new Pane(w)); });
  };
  sync(0);
  document.addEventListener("home:active", (ev) => sync(ev.detail));
  window.addEventListener("resize", () => panes.forEach((p) => p.resize()));
  const fine = window.matchMedia("(hover: hover)").matches;
  let tmx = 0, tmy = 0;
  if (fine) window.addEventListener("mousemove", (e) => { tmx = e.clientX / window.innerWidth * 2 - 1; tmy = e.clientY / window.innerHeight * 2 - 1; }, { passive: true });
  let lastY = window.scrollY, lastM = 0;
  gsap.ticker.add((time) => {
    const y = window.scrollY, raw = (lenis ? lenis.velocity : y - lastY); lastY = y;
    const target = Math.max(-1, Math.min(1, raw / 45));
    HOME_GL.vel += (target - HOME_GL.vel) * 0.12;
    if (Math.abs(HOME_GL.vel) < 0.0005) HOME_GL.vel = 0;
    if (!fine) { tmx = Math.sin(time * 0.35) * 0.35; tmy = Math.cos(time * 0.27) * 0.2; }   // touch: slow idle drift
    HOME_GL.mx += (tmx - HOME_GL.mx) * 0.06; HOME_GL.my += (tmy - HOME_GL.my) * 0.06;
    HOME_GL.t = time;
    const m = HOME_GL.mx * 1000 + HOME_GL.my;
    const moving = HOME_GL.vel !== 0 || Math.abs(m - lastM) > 0.5; lastM = m;
    panes.forEach((p) => { if (moving || p.dirty) p.draw(); });
  });
}

/* ---------- WORK: cards tilt toward the cursor, light sweeps across, text floats ---------- */
function initCardTilt() {
  if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".wc").forEach((card) => {
    const glare = document.createElement("span"); glare.className = "wc-glare"; (card.querySelector(".wc-media") || card).appendChild(glare);
    const txt = card.querySelector(".wc-txt"), chip = card.querySelector(".wc-chip");
    const set = { rx: gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" }), ry: gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" }) };
    const tx = txt && { x: gsap.quickTo(txt, "x", { duration: 0.6, ease: "power3.out" }), y: gsap.quickTo(txt, "y", { duration: 0.6, ease: "power3.out" }) };
    const cx = chip && { x: gsap.quickTo(chip, "x", { duration: 0.6, ease: "power3.out" }), y: gsap.quickTo(chip, "y", { duration: 0.6, ease: "power3.out" }) };
    gsap.set(card, { transformPerspective: 1000, transformOrigin: "50% 50%" });
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      set.rx(-y * 9); set.ry(x * 11);
      if (tx) { tx.x(x * 18); tx.y(y * 12); }
      if (cx) { cx.x(x * 26); cx.y(y * 18); }
      card.style.setProperty("--gx", (x + 0.5) * 100 + "%"); card.style.setProperty("--gy", (y + 0.5) * 100 + "%");
    });
    card.addEventListener("mouseleave", () => { set.rx(0); set.ry(0); if (tx) { tx.x(0); tx.y(0); } if (cx) { cx.x(0); cx.y(0); } });
  });
}

/* ---------- CAREER: 3D title — letters turn toward the cursor, fluo extrusion shifts with the light ---------- */
function initTitle3D() {
  const h = document.querySelector("body.is-career .dual-title");
  if (!h || reduced) return;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const chars = [];
  const split = (el) => {
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...n.textContent].forEach((ch) => {
          if (/\s/.test(ch)) { frag.appendChild(document.createTextNode(ch)); return; }
          const sp = document.createElement("span"); sp.className = "t3"; sp.textContent = ch; frag.appendChild(sp); chars.push(sp);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) split(n);
    });
  };
  // wait for the intro reveal to finish so we don't fight its transforms
  setTimeout(() => {
    split(h.querySelector(".dt-script")); h.querySelectorAll(".dt-bold .split-line > span").forEach(split);
    h.classList.add("is-3d");
    let mx = 0, my = 0, tx = 0, ty = 0, px = -9999, visible = true, rects = [];
    const measure = () => { rects = chars.map((c) => { const r = c.getBoundingClientRect(); return r.left + r.width / 2; }); };
    measure(); window.addEventListener("resize", measure);
    new IntersectionObserver((en) => (visible = en[0].isIntersecting)).observe(h);
    if (fine) window.addEventListener("mousemove", (e) => { tx = e.clientX / window.innerWidth * 2 - 1; ty = e.clientY / window.innerHeight * 2 - 1; px = e.clientX; }, { passive: true });
    gsap.ticker.add((time) => {
      if (!visible) return;
      if (!fine) { tx = Math.sin(time * 0.5) * 0.6; ty = Math.cos(time * 0.4) * 0.4; px = window.innerWidth * (0.5 + Math.sin(time * 0.5) * 0.4); }
      mx += (tx - mx) * 0.07; my += (ty - my) * 0.07;
      h.style.transform = `perspective(1100px) rotateX(${(-my * 7).toFixed(2)}deg) rotateY(${(mx * 9).toFixed(2)}deg)`;
      h.style.setProperty("--sx", (-mx * 5).toFixed(2) + "px"); h.style.setProperty("--sy", (-my * 5).toFixed(2) + "px");
      chars.forEach((c, i) => {
        const d = (px - rects[i]) / 260, f = Math.exp(-d * d);   // letters near the cursor react most
        c.style.transform = `translateY(${(-f * 3).toFixed(1)}px) rotateY(${(Math.max(-1, Math.min(1, d)) * 28 * f).toFixed(1)}deg)`;
      });
    });
  }, 2200);
}

/* ---------- inner page reveals ---------- */
function splitLines(el) {
  const words = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = words.map((w) => `<span class="split-line"><span>${w.trim()}</span></span>`).join("");
  return el.querySelectorAll(".split-line > span");
}

function initIntro() {
  const tl = gsap.timeline({ delay: document.documentElement.dataset.ptWas ? 0.55 : 0.15 });
  document.querySelectorAll("[data-split]").forEach((el) => {
    const lines = splitLines(el);
    tl.from(lines, { yPercent: 105, duration: 1.2, ease: "expo.out", stagger: 0.08 }, 0);
  });
  tl.fromTo(".tr-intro", { y: "2rem", opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", stagger: 0.05 }, 0.25);
}

function initScrollAnimations() {
  gsap.utils.toArray(".tr").forEach((el) => {
    gsap.fromTo(el, { y: "2rem", opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.1, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%" }
    });
  });
  gsap.utils.toArray(".pv img").forEach((img) => {
    gsap.fromTo(img, { scale: 1.12 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
  gsap.utils.toArray(".line-divider").forEach((el) => {
    gsap.from(el, { width: "0%", duration: 1.25, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 90%" } });
  });
  document.querySelectorAll(".about-split-grid").forEach((el) => {
    mm.add("(min-width: 992px)", () => {
      gsap.fromTo(el.querySelector(".about-txt-flex"), { y: el.getAttribute("split-section") === "02" ? "15rem" : "-3rem" }, {
        y: "0rem", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
      const img = el.querySelector(".about-visual img");
      if (img) gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
  document.querySelectorAll(".centere-big-txt").forEach((el) => {
    mm.add("(min-width: 992px)", () => {
      gsap.fromTo(el, { y: "0rem" }, { y: "10rem", ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
}

/* ---------- fixed footer reveal ---------- */
function initFooter() {
  const footer = document.querySelector(".footer");
  const main = document.querySelector(".page_main");
  if (!footer || !main) return;
  const setH = () => { main.style.marginBottom = footer.offsetHeight + "px"; ScrollTrigger.refresh(); };
  setH();
  window.addEventListener("resize", setH);
  gsap.timeline({ scrollTrigger: { trigger: main, start: "bottom bottom", end: () => "+=" + footer.offsetHeight, scrub: true } })
    .to(".nav-row.is-bottom", { y: "4rem", ease: "none" })
    .fromTo(".footer-inner", { yPercent: -30 }, { yPercent: 0, ease: "none" }, "<");
}

/* ---------- socials: IG -> Instagram typing on hover ---------- */
function initSocialsHover() {
  const map = { IG: "Instagram", EM: "E-mail", TEL: "Telefono" };
  document.querySelectorAll(".socials-flex a").forEach((a) => {
    const t = a.querySelector(".social-txt"); if (!t) return;
    const short = t.textContent.trim(), full = map[short]; if (!full) return;
    const p = { v: 0 }; let tw;
    const draw = () => (t.textContent = full.slice(0, Math.round(short.length + (full.length - short.length) * p.v)));
    a.addEventListener("mouseenter", () => { tw && tw.kill(); tw = gsap.to(p, { v: 1, duration: 0.25, ease: "none", onUpdate: draw }); });
    a.addEventListener("mouseleave", () => { tw && tw.kill(); tw = gsap.to(p, { v: 0, duration: 0.15, ease: "none", onUpdate: draw, onComplete: () => (t.textContent = short) }); });
  });
}

/* ---------- info drawers ---------- */
function initDrawers() {
  document.querySelectorAll(".drawer-top").forEach((top) => {
    top.addEventListener("click", () => {
      const item = top.closest(".drawer-item"), open = item.classList.contains("open");
      item.parentElement.querySelectorAll(".drawer-item").forEach((s) => s.classList.remove("open"));
      if (!open) item.classList.add("open");
      setTimeout(() => ScrollTrigger.refresh(), 650);
    });
  });
}

/* ---------- work filters (Flip) ---------- */
function initFilters() {
  const grid = document.querySelector(".work-grid");
  const btns = document.querySelectorAll(".filter-btn");
  if (!grid || !btns.length) return;
  let current = "all", pending;
  const renumber = () => grid.querySelectorAll(".work-item").forEach((el, i) => (el.querySelector("[work-count]").textContent = String(i + 1).padStart(2, "0")));
  btns.forEach((b) => b.addEventListener("click", () => {
    const f = b.dataset.filter; if (f === current) return; current = f;
    btns.forEach((x) => x.classList.toggle("is-active", x === b));
    const all = [...grid.children], on = [], off = [];
    all.forEach((el) => (f === "all" || el.dataset.cat.split(" ").includes(f) ? on : off).push(el));
    gsap.killTweensOf(all); pending && pending.kill();
    gsap.to(off, { opacity: 0.1, duration: 0.55, ease: "power1.inOut" });
    gsap.to(on, { opacity: 1, duration: 0.5, ease: "power1.inOut" });
    pending = gsap.delayedCall(0.25, () => {
      const state = Flip.getState(all);
      on.concat(off).forEach((el) => grid.appendChild(el));
      renumber();
      Flip.from(state, { duration: 0.7, ease: "power3.inOut", stagger: 0.05, absolute: true });
    });
  }));
  renumber();
}

/* ---------- Home: after the first 3 slides, a small arrow invites to Career ---------- */
function navHint(link) {
    const hint = document.createElement("span");
    hint.className = "career-hint";
    hint.innerHTML = '<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M6 15V2M1.5 6.5 6 2l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    link.appendChild(hint);
    link.classList.add("has-hint");
    requestAnimationFrame(() => requestAnimationFrame(() => hint.classList.add("is-in")));
}
function initCareerHint() {
  // career page: near the end, point at "Work"
  const work = document.querySelector('body.is-career .nav-row.is-top a[href^="work.html"]');
  if (work) {
    let done = false;
    const check = () => {
      if (done) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.85) { done = true; navHint(work); window.removeEventListener("scroll", check); }
    };
    window.addEventListener("scroll", check, { passive: true });
  }
}
/* ---------- Work: after load, an arrow points at "Full Stack Marketer" ---------- */
function initMarketerHint() {
  const btn = document.querySelector('.tab-btn[data-tab="marketer"]');
  if (!btn) return;
  const hint = document.createElement("span");
  hint.className = "tab-hint"; hint.setAttribute("aria-hidden", "true");
  hint.innerHTML = '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M15 6H1.5M6 1.5 1.5 6 6 10.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>110 collaborazioni in 9 anni</span>';
  btn.appendChild(hint);
  setTimeout(() => hint.classList.add("is-in"), 1600);
  btn.addEventListener("click", () => hint.classList.remove("is-in"), { once: true });
}

/* ---------- Career: testimonials selector — click a person to show the quote ---------- */
function initTestimonials() {
  const root = document.querySelector("[data-tst]");
  if (!root) return;
  const tabs = [...root.querySelectorAll(".tsel-btn")], panels = [...root.querySelectorAll(".tsel-panel")];
  const sel = (i) => {
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
    panels.forEach((p, j) => p.classList.toggle("is-on", j === i));
    tabs[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => sel(i));
    t.addEventListener("keydown", (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault(); const j = (i + d + tabs.length) % tabs.length; sel(j); tabs[j].focus();
    });
  });
}

/* ---------- case studies: YouTube players load only when clicked ---------- */
function initVideoFacades() {
  document.querySelectorAll("[data-yt]").forEach((b) => b.addEventListener("click", () => {
    if (b.classList.contains("is-playing")) return;
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    f.title = b.getAttribute("aria-label") || "Video"; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
    b.classList.add("is-playing"); b.appendChild(f);
  }));
}

/* ---------- Career: brand logos cascade in + count up ---------- */
function initBrandsReveal() {
  const sec = document.querySelector(".brands");
  if (!sec || reduced) return;
  const sup = sec.querySelector(".brands-title sup");
  const logos = sec.querySelectorAll(".brand");
  gsap.set(logos, { opacity: 0, y: 24 });
  ScrollTrigger.create({
    trigger: sec, start: "top 70%", once: true,
    onEnter: () => {
      gsap.to(logos, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.035 });
      if (sup) {
        const n = parseInt(sup.textContent, 10) || 0, o = { v: 0 };
        sup.classList.add("is-counting");
        gsap.to(o, { v: n, duration: 1.6, ease: "power2.out", onUpdate: () => (sup.textContent = Math.round(o.v)), onComplete: () => sup.classList.remove("is-counting") });
      }
    },
  });
}

/* ---------- elements that fade in when they enter the screen ---------- */
function initRevealHints() {
  document.querySelectorAll("[data-reveal-hint]").forEach((el) => {
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.4 }).observe(el);
  });
}

/* ---------- Project pages: "scroll the gallery" arrow + progress bar/counter ---------- */
function initGalleryGuide() {
  const vis = document.querySelector(".project-visuals");
  if (!vis) return;
  const shots = [...vis.querySelectorAll(".pv")];
  if (!shots.length) return;
  const bar = document.createElement("div"); bar.className = "gal-bar"; bar.innerHTML = "<span></span>";
  const count = document.createElement("div"); count.className = "gal-count";
  const hint = document.createElement("div"); hint.className = "gal-hint";
  hint.innerHTML = '<span>Scorri la galleria</span><svg viewBox="0 0 12 16" aria-hidden="true"><path d="M6 1v13M1.5 9.5 6 14l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.append(bar, count, hint);
  const fill = bar.firstChild;
  const first = shots[0];
  // arrow: appears after a few seconds if the visitor hasn't reached the photos yet
  setTimeout(() => { if (first.getBoundingClientRect().top > window.innerHeight * 0.55) hint.classList.add("is-in"); }, 2500);
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight, r = vis.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    fill.style.transform = `scaleX(${p})`;
    let n = 0;
    for (const el of shots) { if (el.getBoundingClientRect().top < vh * 0.6) n++; else break; }
    const inGallery = r.top < vh * 0.6 && r.bottom > vh * 0.4;
    bar.classList.toggle("is-in", inGallery);
    count.classList.toggle("is-in", inGallery && n > 0);
    count.textContent = String(Math.max(1, n)).padStart(2, "0") + " / " + String(shots.length).padStart(2, "0");
    if (first.getBoundingClientRect().top < vh * 0.55) hint.classList.remove("is-in");
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ---------- yellow tape: speeds up while scrolling ---------- */
function initTapeSpeed() {
  const tracks = [...document.querySelectorAll(".uc-tape-track")];
  if (!tracks.length || reduced) return;
  let lastY = window.scrollY, rate = 1;
  gsap.ticker.add(() => {
    const y = window.scrollY, v = Math.abs(y - lastY); lastY = y;
    const target = 1 + Math.min(v / 6, 5);
    rate += (target - rate) * 0.08;
    tracks.forEach((t) => t.getAnimations().forEach((a) => (a.playbackRate = rate)));
  });
}

/* ---------- Percorso: vertical timeline, hover cards + mobile popup ---------- */
function initTimeline() {
  const vt = document.querySelector("[data-vt]");
  if (!vt) return;
  const items = [...vt.querySelectorAll(".vt-item")];
  const fill = vt.querySelector(".vt-fill");
  const modal = document.querySelector(".vt-modal");
  document.body.appendChild(modal);
  const inner = modal.querySelector(".vt-modal-inner");
  const light = (p) => {
    const y = p * vt.offsetHeight;
    items.forEach((el) => el.classList.toggle("is-on", el.offsetTop + el.offsetHeight / 2 <= y + 1));
  };
  if (reduced) { fill.style.transform = "scaleY(1)"; light(1); }
  else ScrollTrigger.create({
    trigger: vt, start: "top 65%", end: "bottom 65%", scrub: true,
    onUpdate: (st) => { fill.style.transform = `scaleY(${st.progress})`; light(st.progress); },
  });
  const open = (item) => {
    inner.innerHTML = item.querySelector(".vt-pop").innerHTML;
    modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false");
    if (typeof lenis !== "undefined" && lenis) lenis.stop();
  };
  const close = () => {
    modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true");
    if (typeof lenis !== "undefined" && lenis) lenis.start();
  };
  const hoverCards = () => window.matchMedia("(hover: hover) and (min-width: 768px)").matches;
  items.forEach((item) => item.querySelector(".vt-box").addEventListener("click", () => { if (!hoverCards()) open(item); }));
  modal.querySelector(".vt-modal-bg").addEventListener("click", close);
  modal.querySelector(".vt-close").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* ---------- Work: Photography / Full Stack Marketer tabs ---------- */
function initWorkTabs() {
  const btns = document.querySelectorAll(".tab-btn");
  if (!btns.length) return;
  const panels = document.querySelectorAll("[data-panel]");
  const show = (tab, animate) => {
    btns.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === tab));
    panels.forEach((p) => { p.hidden = p.dataset.panel !== tab; });
    const on = document.querySelector(`[data-panel="${tab}"]`);
    if (animate && on) {
      const kids = on.querySelectorAll(".work-grid > *, .uc > .uc-card, .work-tape");
      gsap.fromTo(kids, { y: "2rem", opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.06 });
    }
    ScrollTrigger.refresh();
  };
  btns.forEach((b) => b.addEventListener("click", () => { show(b.dataset.tab, true); try { history.replaceState(null, "", "#" + b.dataset.tab); } catch (e) {} }));
  const h = (location.hash || "").replace("#", "");
  if (h === "marketer" || h === "photography") show(h, false);
}

/* ---------- "Chi sono": words light up as you read ---------- */
function initStory() {
  const texts = document.querySelectorAll(".ch-text");
  if (!texts.length || reduced) return;
  const wrap = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const sp = document.createElement("span"); sp.className = "w"; sp.textContent = part; frag.appendChild(sp);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) wrap(n);
    });
  };
  texts.forEach((t) => {
    wrap(t);
    gsap.to(t.querySelectorAll(".w"), {
      opacity: 1, ease: "none", stagger: 0.08,
      scrollTrigger: { trigger: t, start: "top 82%", end: "bottom 52%", scrub: 0.6 }
    });
    const y = t.parentElement.querySelector(".ch-year");
    if (y) gsap.from(y, { x: -24, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 85%" } });
  });
}

/* ---------- career title: make the small line exactly as wide as "& FULL STACK" ---------- */
function fitDualTitle() {
  const top = document.querySelector(".dt-script"), bold = document.querySelector(".dt-bold");
  if (!top || !bold) return;
  const fit = () => {
    const line = bold.querySelector(".split-line > span") || bold;
    top.style.fontSize = "";
    const target = line.getBoundingClientRect().width, cur = top.getBoundingClientRect().width;
    if (target && cur) top.style.fontSize = (parseFloat(getComputedStyle(top).fontSize) * target / cur) + "px";
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  window.addEventListener("resize", fit);
}

/* ---------- boot ---------- */
// mobile: the address bar showing/hiding must not recalculate every scroll animation
ScrollTrigger.config({ ignoreMobileResize: true });
// recompute trigger positions once late images/fonts have changed the layout
(() => {
  let t;
  const later = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200); };
  window.addEventListener("load", later);
  document.addEventListener("load", (e) => { if (e.target.tagName === "IMG") later(); }, true);
  if (document.fonts) document.fonts.ready.then(later);
})();

document.addEventListener("DOMContentLoaded", () => {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  initLenis();
  initCurrent();
  initTransitions();
  initSocialsHover();
  initDrawers();
  initFilters();
  fitDualTitle();
  initStory();
  initWorkTabs();
  initTimeline();
  // initHomeGL();  — disabled: Lucio prefers the plain, fluid slider
  initCardTilt();
  // initTitle3D();  — disabled on request: static career title
  initCareerHint();
  initBrandsReveal();
  initRevealHints();
  initGalleryGuide();
  initTapeSpeed();
  initMarketerHint();
  initTestimonials();
  initVideoFacades();
  if (document.querySelector(".page_scroll")) {
    initHomeScroll();
    initHomePick();
    initLoader(() => ScrollTrigger.refresh());
  } else {
    initIntro();
    initScrollAnimations();
    initFooter();
  }
});

