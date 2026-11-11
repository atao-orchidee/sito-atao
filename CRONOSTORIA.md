# Cronostoria del sito ATAO

Registro delle decisioni e delle modifiche al sito, dalla più recente. Le date dei lavori pubblicati coincidono con lo storico dei commit (`git log`).

## 11 novembre 2026

- **Facebook:** richiesta la pubblicazione automatica degli incontri. Requisiti: un post per ogni sede (anche se due sedi cadono lo stesso giorno), uscita almeno 4 giorni prima, nessun testo inventato. In attesa di sapere se esiste una Pagina Facebook e chi la amministra.
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
