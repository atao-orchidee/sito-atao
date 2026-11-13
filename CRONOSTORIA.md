# Cronostoria del sito ATAO

Registro delle decisioni e delle modifiche al sito, dalla più recente. Le date dei lavori pubblicati coincidono con lo storico dei commit (`git log`).

## 13 novembre 2026

- **CMS online, account GitHub:** l'account segreteria-atao resta segnalato (verifica SMS non riuscita). Creata l'organizzazione atao-orchidee con l'account personale dell'utente; il sito è ora nel repository pubblico atao-orchidee/sito-atao (il vecchio repository resta come copia). App del CMS "atao-orchidee Keystatic" creata e installata: funziona.
- **Hosting:** Netlify Free è a crediti (300 al mese; 15 per ogni pubblicazione, 20 per GB di traffico; a crediti finiti il sito va in pausa). Durante la messa a punto ne sono stati consumati circa 250. Collegamento automatico GitHub → Netlify sospeso in attesa della scelta dell'hosting.
- **Netlify bloccato:** crediti per le pubblicazioni esauriti ("operational credits"): il sito resta online ma non si può più aggiornare fino al rinnovo del 10 dicembre. L'utente ha scelto **Cloudflare (Workers, piano gratuito)**; per un'eventuale versione a pagamento consigliato Cloudflare Workers Paid (5 $/mese), non Netlify.
- **Preparazione per Cloudflare (ramo `cloudflare`):** adattatore `@astrojs/cloudflare` al posto di Netlify, foto ottimizzate durante la build, file `wrangler.jsonc`. Tolto l'archivio `anno2009.zip` di ViaVai (29 MB, oltre il limite di 25 MB per file di Cloudflare): i numeri del 2009 restano scaricabili uno per uno in PDF. Le costanti delle schede (temperatura, luce) spostate in `src/lib/coltivazione.ts`, perché la pagina del catalogo non si compilava su Cloudflare. Provato in locale: pagine, 404, reindirizzamenti dai vecchi indirizzi e accesso al CMS funzionano.
- **Primo sito su Cloudflare:** ramo `cloudflare` unito in `main`; GitHub collegato a Cloudflare Workers dall'utente. Sito provvisorio su https://sito-atao.segreteria-ata.workers.dev (pagine con indirizzo ufficiale www.orchidee-atao.it, quindi niente doppioni su Google). Chiavi del CMS inserite dall'utente su Cloudflare, indirizzo di ritorno aggiunto all'app GitHub. Corretto: aperto da un browser, /keystatic dava la pagina 404 (aggiunto `run_worker_first` in wrangler.jsonc). Il dominio resta per ora su Netlify.
- **Dominio su Cloudflare (in preparazione):** CMS provato con successo sul sito provvisorio. Il dominio è stato aggiunto su Cloudflare con gli stessi record di TOL (posta e FTP senza proxy, DNSSEC spento). Il cambio dei nameserver su TOL (daniella e leif.ns.cloudflare.com) è rimandato a domani, su decisione dell'utente.

## 11 novembre 2026

- **Prossimo incontro:** quando più sedi si incontrano lo stesso giorno (es. Limena e Pescara, secondo sabato) il riquadro le mostra tutte, ciascuna con orario e luogo, e il titolo diventa "Prossimi incontri". Segnalato dall'utente: prima si vedeva solo Limena.
- **Icone social con i simboli ufficiali** (raccolta Simple Icons, licenza CC0): monocolore nel piè di pagina, con il colore del marchio al passaggio del mouse; in Contatti pulsanti chiari con i simboli nei colori originali (Instagram con il suo gradiente). Fondo pieno scartato perché il testo bianco su rosso/giallo non era abbastanza leggibile.
- **Canali social nel sito:** piè di pagina (tutte le pagine) e sezione "Seguici" in Contatti, con icone disegnate nel sito (nessuno script né cookie di terze parti), modificabili dal CMS. Canali scelti dall'utente: Instagram @atao_la_casa_delle_orchidee, Pagina Facebook "ATAO la casa delle orchidee", Gruppo Facebook "Orchidee ATAO", YouTube "Associazione Triveneta Amatori Orchidee ATAO" (@associazionetrivenetaamato738). Aggiunti anche ai dati per Google (sameAs).
- **Home: mostre in programma in evidenza.** Fascia a tutta larghezza subito dopo il frontespizio, con locandina, titolo, date in parole, conto alla rovescia ("Tra 10 giorni", "Domani", "In corso, oggi", "Ultimo giorno, oggi"), luogo e pulsanti "Programma e dettagli", "Sito dell'evento", "Come arrivare". Sparisce da sola a fine mostra; tolto il vecchio riquadro "Prossima mostra".
- **Prossima mostra:** "Ali tra le Orchidee – 1ª Mostra Mercato di orchidee e piante particolari", 21-22 novembre 2026, 9:00–18:00, Oasi Rossi, via Salzena, Santorso (VI), organizzata con Oasi Rossi – Cooperativa sociale Nuovi Orizzonti ONLUS. Dati dalla locandina fornita dall'utente (online non c'era). Pubblicata la copertina; il programma è riportato come testo, senza il numero WhatsApp privato. Corretto il sito perché un evento resti visibile fino a sera dell'ultimo giorno e poi sparisca da solo, anche senza ripubblicare.
- **Orquideas Katias:** confermata dall'utente la data del 23 gennaio 2021.
- **Altre 7 cronache dalle foto dell'associazione** (controllo doppioni per contenuto, non per nome):
  - "Video Conferenza Orquideas Katias Colombia 23 gennaio 2021 in pieno Covid" (locandina + 9 immagini; titolo corretto da "rquideas", su indicazione dell'utente);
  - "Mostra Mercato 26 giugno 2021 - Villa Cordellina" (locandina + 23 foto; esclusi 2 doppioni e un ritaglio di giornale, protetto da diritto d'autore);
  - "19 dicembre 2021 GranGala dello Sport Zanè" (7 foto; escluso un doppione e lo screenshot del post con i nomi);
  - "5 febbraio 2022 Corso presso Vivai Dalle Rive" (10 foto, senza testo: nessuna fonte trovata);
  - "15 marzo 2022 Corso a Zanè Centro Socio Culturale" (locandina senza il cellulare + 11 foto);
  - "Riunione 26 ottobre 2023 nello Showroom di Valeria Moro" (22 foto, senza testo: nessuna fonte trovata);
  - "Video Conferenza di Fred Clarke (California)", 20 luglio 2024 (locandina e presentazione ritagliate dagli screenshot, senza il cellulare).
  - Caldogno 2022: aggiunte 7 immagini (pieghevole + 6 foto) e l'indirizzo via G. Zanella 3 dal pieghevole.
  - "Conferenza Orquivalle Colombia 21 settembre 2024": la cartella contiene le stesse foto di Orquideas Katias 2021 e l'utente conferma che è lo stesso evento, già pubblicato: nessuna cronaca in più.
- **Nuove cronache dalle foto dell'associazione:** "Mostra a Caldogno 26 - 27 novembre 2022" (15 foto) e "Mostra Asolo 2023" (13 foto e la locandina ritagliata). Testi solo con dati verificati: Caldogno su VicenzaReport e Pro Loco Vicentine (Villa Caldogno, 9-18, ingresso libero); Asolo sulla locandina e su Orchidofilia (Quinta Mostra Mercato Internazionale, La Fornace di Asolo, via Strada Muson 2/c, 11-12 febbraio 2023, 9-18, ingresso libero). Foto senza didascalie, per scelta.
- **Facebook:** richiesta la pubblicazione automatica degli incontri. Requisiti: un post per ogni sede (anche se due sedi cadono lo stesso giorno), uscita almeno 4 giorni prima, nessun testo inventato. Lavoro rimandato su richiesta dell'utente; da riprendere con le domande aperte (Pagina Facebook, testo del post, incontri sospesi).
- **Zanè:** gli incontri si tengono alla Biblioteca civica "Carlo Goldoni", via Giuseppe Mazzini 21 (indirizzo verificato sul sito del Comune e sull'Anagrafe delle biblioteche). Aggiornata anche la notizia "ATAO nel Triveneto".
- **Pescara:** aggiunto l'incontro del secondo sabato del mese, 15:30–17:30, senza sede fissa. I testi che parlano del Triveneto restano invariati, per scelta.
- **Altre associazioni:** tolta la sezione "Altre associazioni e siti utili", i suoi dati e la voce del CMS. Restano le cronache storiche che le citano.

## 10 novembre 2026

- **Nuovo logo** fornito dall'associazione: sfondo reso trasparente, nuove favicon, icona per telefoni e anteprima social. Risoluzione adatta al web; per la stampa grande serve il file vettoriale.
- **Dominio:** `orchidee-atao.it` collegato a Netlify (record su TOL), HTTPS attivo, posta e FTP invariati.
- **Recupero dalla copia del vecchio hosting:** 667 foto in versione grande, le 96 foto mancanti, gli articoli su "ViaVai" 2008–2012 come PDF singoli. Lo statuto era già identico. La copia mostra che il vecchio hosting è stato compromesso.
- **Pubblicazione:** sito online su Netlify (`sito-atao`). Codice nel repository privato GitHub `segreteria-atao/sito-atao`. L'account GitHub è stato segnalato: il CMS online è in attesa dello sblocco.
- **Movimento e Google:** transizioni tra pagine, foto che passano dall'elenco alla scheda, apertura animata della home, dati strutturati schema.org.
- **Home a frontespizio:** il logo e lo scopo dell'associazione aprono la pagina; il muro dei 111 nomi diventa l'indice in fondo al catalogo.
- **Sede dell'associazione:** Contrà Angelini 2, Schio (VI).
- **Nervesa della Battaglia (TV)** sostituisce Breda di Piave per l'incontro dell'ultima domenica.
- **Foto piccole:** mostrate su un passe-partout invece che allargate e sgranate.
- **Primo commit:** nuovo sito in Astro con CMS Keystatic, contenuti importati dal vecchio sito (111 orchidee, 71 cronache, guide, generi, notizie).

## 9 novembre 2026

- Analisi del vecchio sito (Adobe Spry) e scelta di rifarlo con Astro e un CMS per i volontari.
