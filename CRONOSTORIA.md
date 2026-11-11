# Cronostoria del sito ATAO

Registro delle decisioni e delle modifiche al sito, dalla più recente. Le date dei lavori pubblicati coincidono con lo storico dei commit (`git log`).

## 11 novembre 2026

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
