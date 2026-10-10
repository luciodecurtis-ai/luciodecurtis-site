"""Service landing pages (SEO): one page per service people search for, backed by the real projects on the site."""
import html

import mk_projects as MKP

AREA = "Napoli e Campania, e su richiesta in tutta Italia"

SERVICES = [
    dict(
        slug="fotografo-sportivo", short="Fotografo sportivo",
        title="Fotografo sportivo a Napoli e in Campania — Lucio De Curtis",
        desc="Fotografo sportivo a Napoli e in Campania: matchday di calcio, tornei di padel ed eventi sportivi per club, atleti e brand. Disponibile anche in tutta Italia.",
        kicker="Fotografia sportiva · Napoli · Campania", h1="Fotografo <br>sportivo",
        hero=("photo", "fidelis/DSC04435.jpg"), og="turris-fidelis-andria.jpg",
        service_type="Fotografia sportiva",
        lead=[
            "Sono Lucio De Curtis, fotografo sportivo a Napoli. Racconto partite, tornei ed eventi sportivi per club, atleti, organizzatori e brand: dal riscaldamento al fischio finale, dalle emozioni in tribuna ai dettagli che restano fuori dalle telecamere.",
            "Lavoro soprattutto in Campania, tra calcio di Serie D e padel, e seguo club e atleti anche in trasferta in tutta Italia.",
        ],
        rows=[("Servizio", "Fotografia sportiva"), ("Per", "Club · Atleti · Organizzatori · Brand"), ("Discipline", "Calcio · Padel · Running · Eventi"), ("Zona", AREA), ("Consegna", "Selezione e post-produzione<br>pronte per social e stampa")],
        items=[
            ("Matchday", "Copertura completa della partita per club e società: azione, esultanze, tifo, panchina e momenti fuori campo."),
            ("Tornei ed eventi", "Tornei di padel, gare di running ed eventi sportivi raccontati dall’inizio alla premiazione."),
            ("Atleti", "Foto d’azione e ritratti per atleti che vogliono comunicare la propria immagine sui social e con gli sponsor."),
            ("Contenuti per i social", "Selezione rapida degli scatti migliori per pubblicare durante e subito dopo l’evento."),
        ],
        projects=[("p", "turris-fidelis-andria"), ("p", "turris-gravina"), ("p", "npt-master"), ("m", "napoli-running")],
        faq=[
            ("In quali zone lavori come fotografo sportivo?", "Lavoro principalmente a Napoli e in Campania. Seguo club, atleti ed eventi anche in trasferta in tutta Italia, su richiesta."),
            ("Quali sport fotografi?", "Soprattutto calcio, con le partite di Serie D, e padel, con i tornei del Napoli Padel Tour. Ho seguito anche eventi di running ed eventi live."),
            ("In quanto tempo consegni le foto?", "Dipende dall’evento e dagli accordi: per i social posso consegnare una prima selezione in tempi brevi, la galleria completa arriva dopo la post-produzione."),
            ("Come posso chiedere un preventivo?", "Scrivimi via e-mail o su Instagram indicando data, luogo e tipo di evento: ti rispondo con una proposta su misura."),
        ],
    ),
    dict(
        slug="fotografo-commerciale", short="Fotografo commerciale",
        title="Fotografo commerciale a Napoli: food, location ed eventi — Lucio De Curtis",
        desc="Fotografo commerciale a Napoli e in Campania: shooting per ristoranti, locali, aziende e brand. Food, location, eventi e contenuti per social e siti web.",
        kicker="Fotografia commerciale · Napoli · Campania", h1="Fotografo <br>commerciale",
        hero=("photo", "sapureat/DSC07669.jpg"), og="sapureat.jpg",
        service_type="Fotografia commerciale",
        lead=[
            "Realizzo shooting fotografici per aziende, locali, ristoranti e brand a Napoli e in Campania: foto pensate per essere usate davvero, sui social, sul sito, nei menù e nelle campagne.",
            "Unisco la fotografia al marketing: prima di scattare ragiono su cosa deve comunicare ogni immagine e dove verrà pubblicata.",
        ],
        rows=[("Servizio", "Fotografia commerciale"), ("Per", "Aziende · Ristoranti · Locali · Brand"), ("Soggetti", "Food · Location · Prodotti · Eventi"), ("Zona", AREA), ("Consegna", "Foto post-prodotte<br>pronte per social, web e stampa")],
        items=[
            ("Food & ristorazione", "Piatti, menù e nuove proposte fotografate per il lancio sui social e per i materiali del locale."),
            ("Location", "L’atmosfera di un locale, di una sala o di uno spazio raccontata con luce e dettagli."),
            ("Eventi aziendali", "Inaugurazioni, presentazioni, workshop ed eventi di brand documentati per la comunicazione."),
            ("Contenuti per brand", "Foto per siti web, campagne e social, coerenti con l’identità del brand."),
        ],
        projects=[("p", "sapureat"), ("p", "bruno-mars-milano"), ("m", "the-workshow")],
        faq=[
            ("Che tipo di shooting commerciali fai?", "Food e ristorazione, location, eventi aziendali e contenuti per brand. Ogni shooting parte da cosa deve comunicare l’azienda."),
            ("Lavori solo a Napoli?", "Lavoro soprattutto a Napoli e in Campania, ma posso spostarmi anche nel resto d’Italia."),
            ("Posso usare le foto sui social e sul sito?", "Sì: le foto vengono consegnate post-prodotte e pronte per social, sito web e stampa, secondo gli accordi presi."),
            ("Come chiedo un preventivo?", "Scrivimi via e-mail o su Instagram raccontandomi il progetto: tipo di attività, cosa vuoi fotografare e dove."),
        ],
    ),
    dict(
        slug="social-media-manager", short="Social Media Manager",
        title="Social Media Manager a Napoli e in Campania — Lucio De Curtis",
        desc="Social Media Manager a Napoli: strategia, contenuti, stories e crescita organica su Instagram e TikTok per locali, aziende e brand in Campania e in tutta Italia.",
        kicker="Social media management · Napoli · Campania", h1="Social Media <br>Manager",
        hero=("mk", "le-cabine"), og="le-cabine.jpg",
        service_type="Social media management",
        lead=[
            "Gestisco i social di locali, aziende e brand a Napoli e in Campania: strategia, piano editoriale, contenuti foto e video, stories e community.",
            "Il mio approccio parte dagli obiettivi reali dell’attività, come prenotazioni, clienti e visibilità, e non solo dai follower.",
        ],
        rows=[("Servizio", "Social media management"), ("Piattaforme", "Instagram · TikTok · Facebook"), ("Per", "Locali · Aziende · Brand · Eventi"), ("Zona", AREA), ("Include", "Strategia · Contenuti<br>Stories · Analisi")],
        items=[
            ("Strategia", "Analisi dell’attività, del pubblico e dei concorrenti per definire posizionamento, tono e obiettivi."),
            ("Contenuti", "Foto, video, reel e grafiche prodotti in base al piano editoriale, con la cura di chi fotografa."),
            ("Stories & community", "Storytelling quotidiano nelle stories e gestione del rapporto con la community."),
            ("Analisi e crescita", "Monitoraggio dei risultati e ottimizzazione continua per una crescita organica."),
        ],
        projects=[("m", "le-cabine"), ("m", "lido-marina"), ("m", "edenlandia"), ("m", "acquaflash")],
        faq=[
            ("Gestisci i social di attività a Napoli?", "Sì, lavoro con locali, aziende e brand di Napoli e della Campania, e anche a distanza con realtà in altre città."),
            ("Crei anche i contenuti?", "Sì: essendo anche fotografo e videomaker, curo direttamente foto, video e reel, oltre alla strategia."),
            ("Serve per forza fare pubblicità a pagamento?", "No. Diversi progetti sono cresciuti in modo organico, senza advertising; quando serve, l’advertising si aggiunge alla strategia."),
            ("Come iniziamo?", "Scrivimi via e-mail o su Instagram: partiamo da un’analisi della tua attività e dei tuoi obiettivi."),
        ],
    ),
    dict(
        slug="full-stack-marketer", short="Full Stack Marketer",
        title="Full Stack Marketer e consulente di marketing digitale a Napoli — Lucio De Curtis",
        desc="Full Stack Marketer a Napoli: strategia digitale, branding, siti web, automazioni, AI, video e contenuti. Un solo referente per il marketing della tua azienda.",
        kicker="Marketing digitale · Napoli · Italia", h1="Full Stack <br>Marketer",
        hero=("mk", "acquaflash"), og="acquaflash.jpg",
        service_type="Consulenza di marketing digitale",
        lead=[
            "Un Full Stack Marketer segue il marketing di un’azienda dall’inizio alla fine: strategia, brand, contenuti, sito web, automazioni e risultati. È il ruolo che ricopro da anni, prima con OutKore Creative Collective e oggi come freelance.",
            "Lavoro con aziende, professionisti ed eventi a Napoli, in Campania e in tutta Italia, anche da remoto.",
        ],
        rows=[("Servizio", "Marketing digitale end-to-end"), ("Per", "Aziende · Professionisti · Eventi · Startup"), ("Competenze", "Strategia · Branding · Web<br>Automazioni · AI · Video"), ("Zona", "Napoli · Campania · tutta Italia, anche da remoto"), ("Con", "Un solo referente")],
        items=[
            ("Strategia digitale", "Obiettivi, posizionamento e piano d’azione per far crescere il business online."),
            ("Branding", "Naming, logo e brand identity per nuovi brand o per il rilancio di quelli esistenti."),
            ("Siti web & automazioni", "Siti, web app, e-mail marketing e automazioni che fanno risparmiare tempo e generano contatti."),
            ("AI, video & motion", "Video, motion graphic e strumenti di intelligenza artificiale applicati alla comunicazione."),
        ],
        projects=[("m", "acquaflash"), ("m", "the-workshow"), ("m", "rdp"), ("m", "alpha-network"), ("p", "npt-master"), ("m", "napoli-running")],
        faq=[
            ("Cosa fa un Full Stack Marketer?", "Segue tutto il marketing di un’azienda: dalla strategia al brand, dai contenuti al sito web, fino alle automazioni e all’analisi dei risultati."),
            ("Perché un solo referente invece di un’agenzia?", "Perché strategia ed esecuzione restano collegate: chi pensa la strategia la porta avanti in prima persona, con meno passaggi e più velocità."),
            ("Lavori anche da remoto?", "Sì. Sono a Napoli, ma collaboro con aziende in tutta Italia e anche all’estero."),
            ("Come posso contattarti?", "Scrivimi via e-mail o su Instagram raccontandomi la tua azienda e i tuoi obiettivi."),
        ],
    ),
]


def _photo_card(B, slug):
    s = next(p for p in B.PROJECTS if p["slug"] == slug)
    a, b = s.get("work_cover", s["cover"])
    t = s["title"].replace("<br>", " ")
    chip = {"calcio": "Calcio", "padel": "Padel", "live": "Live", "food": "Food"}[s["filter"]]
    return f'''<a class="work-item wc" href="project-{slug}.html" style="--accent:{s['accent']}">
      <span class="wc-media"><img src="{B.src(s['dir'], a)}" alt="{html.escape(t)}" loading="lazy"><img class="is-hover" src="{B.src(s['dir'], b)}" alt="" loading="lazy"><span class="wc-shade"></span></span><span class="wc-chip">{chip}</span>
      <span class="wc-txt"><span class="wc-cat">{s['cats'][0]}</span><span class="wc-title">{t}</span><span class="wc-cta">Progetto completo ↗</span></span>
    </a>'''


def _mk_card(slug):
    p = next(m for m in MKP.MK if m["slug"] == slug)
    hover = MKP.im(slug, p["card"][1], cls="is-hover") if len(p["card"]) > 1 else ""
    return f'''<a class="work-item wc" href="project-{slug}.html" style="--accent:#c8ff3a">
      <span class="wc-media">{MKP.im(slug, p['card'][0], p['name'])}{hover}<span class="wc-shade"></span></span><span class="wc-chip">{p['chip']}</span>
      <span class="wc-txt"><span class="wc-cat">{p['card_cat']}</span><span class="wc-title">{p['name']}</span><span class="wc-cta">Progetto completo ↗</span></span>
    </a>'''


def page(B, s):
    kind, h = s["hero"]
    hero = f'<img src="assets/img/{h}" alt="{s["short"]} — Lucio De Curtis" fetchpriority="high">' if kind == "photo" else MKP.im(h, "cover", f'{s["short"]} — Lucio De Curtis')
    rows = "".join(f'<div class="info-row"><dt>{k}</dt><dd>{v}</dd></div>' for k, v in s["rows"])
    lead = "".join(f"<p>{p}</p>" for p in s["lead"])
    items = "".join(f'<div class="mk-val"><span class="mk-val-n">{i + 1:02d}</span><b>{t}</b><p>{d}</p></div>' for i, (t, d) in enumerate(s["items"]))
    cards = "".join(_photo_card(B, x) if k == "p" else _mk_card(x) for k, x in s["projects"])
    faq = "".join(f'<details class="sv-q"><summary>{q}</summary><p>{a}</p></details>' for q, a in s["faq"])
    others = "".join(f'<a class="sv-link" href="{o["slug"]}.html">{o["short"]} <span>↗</span></a>' for o in SERVICES if o is not s)
    out = B.head(s["title"], s["desc"], "project-page mk-page sv-page", "#c8ff3a") + B.NAV
    out += f'''<main class="page_main">
  <header class="big-head u-container glow glow-tc">
    <div class="cats tr-intro">{s['kicker']}</div>
    <h1 class="big-title" data-split>{s['h1']}</h1>
  </header>
  <section class="mk-wrap u-container">
    <figure class="mk-cover tr">{hero}</figure>
    <div class="mk-grid">
      <aside class="mk-info"><dl class="info-table">{rows}</dl></aside>
      <div class="mk-body"><section class="mk-ch tr"><span class="mk-n">Chi sono</span><h2 class="mk-h">{s['short']} a Napoli</h2>{lead}</section></div>
    </div>
    <div class="sv-sec"><h2 class="sv-h">Cosa posso fare per te</h2><div class="mk-vals">{items}</div></div>
    <div class="sv-sec"><h2 class="sv-h">Alcuni lavori</h2><div class="work-grid sv-grid" style="--n:{4 if len(s['projects']) == 4 else 3}">{cards}</div></div>
    <div class="sv-sec"><h2 class="sv-h">Domande frequenti</h2><div class="sv-faq">{faq}</div></div>
    <div class="sv-sec wc-end uc-card sv-cta"><div class="uc-grid" aria-hidden="true"></div><div class="wc-end-body">
      <span class="uc-label"><i class="uc-dot"></i>{AREA}</span>
      <h3 class="wc-end-title">Parliamo del<br>tuo progetto?</h3>
      <p class="uc-text">Scrivimi via e-mail o su Instagram: ti rispondo personalmente.</p>
      <div class="uc-ctas"><a class="uc-btn is-solid" href="mailto:{B.EMAIL}">Scrivimi ↗</a><a class="uc-btn" href="{B.IG}" target="_blank" rel="noopener">Instagram ↗</a></div>
    </div></div>
    <nav class="sv-sec sv-others" aria-label="Altri servizi"><span class="sv-h-s">Altri servizi</span>{others}</nav>
  </section>
</main>
''' + B.footer() + B.SCRIPTS
    return out


def schema(B, name):
    s = next((x for x in SERVICES if name == x["slug"] + ".html"), None)
    if not s:
        return None
    url = f"{B.SITE_URL}/{name}"
    return [
        {"@type": "Service", "@id": url + "#service", "name": s["short"] + " — Lucio De Curtis", "serviceType": s["service_type"], "description": s["desc"], "url": url,
         "provider": {"@id": B.PERSON_ID},
         "areaServed": [{"@type": "City", "name": "Napoli"}, {"@type": "AdministrativeArea", "name": "Campania"}, {"@type": "Country", "name": "Italia"}],
         "inLanguage": "it-IT"},
        {"@type": "FAQPage", "url": url, "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in s["faq"]]},
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": B.SITE_URL + "/"},
                                                        {"@type": "ListItem", "position": 2, "name": s["short"], "item": url}]},
    ]


def build_all(B, write):
    for s in SERVICES:
        write(s["slug"] + ".html", page(B, s))
