# Mettere online il sito ATAO

Guida passo passo per pubblicare il sito su Netlify e permettere ai volontari di aggiornarlo dal CMS.
Il sito e la configurazione sono già pronti: servono solo gli account e qualche clic.

## A che punto siamo (10 novembre 2026)

| Passo | Stato |
|---|---|
| Account GitHub `segreteria-atao`, con verifica in due passaggi | fatto |
| Codice nel repository privato `segreteria-atao/sito-atao` | fatto |
| App GitHub del CMS "segreteria-atao Keystatic" (chiavi nel file `.env` locale) | creata, **non installata** |
| Sito su Netlify: <https://sito-atao.netlify.app> (progetto `sito-atao`, team `segreteria-atao`) | **online** |
| CMS online | in attesa: GitHub ha segnalato l'account e blocca le app esterne |
| Dominio `orchidee-atao.it` | registrato su Netlify; **da cambiare su TOL** (passo 6) |

**Per sbloccare GitHub:** con l'account `segreteria-atao` aprire <https://support.github.com/contact/reinstatement>, fare la verifica via SMS e chiedere di rivedere la segnalazione. Dopo lo sblocco restano i passi 3 (installare l'app), 4.3 (chiavi su Netlify), 5 e il collegamento automatico del repository a Netlify.

**Finché il CMS online non c'è,** i contenuti si modificano con il CMS locale (`npm run dev`, poi <http://127.0.0.1:4321/keystatic>) e si pubblicano dal computer:

```sh
git add -A && git commit -m "Aggiorna i contenuti"
git push
npx netlify-cli deploy --build --prod
```

Il progetto Netlify non è ancora collegato a GitHub: il `git push` salva le modifiche, ma è l'ultimo comando a pubblicarle.

---

**Tempo stimato:** un'ora circa, più l'attesa del cambio di dominio (da pochi minuti a un giorno).

**Cosa serve:**

- un account GitHub dell'associazione (gratuito);
- un account Netlify (gratuito; si può entrare direttamente con l'account GitHub);
- l'accesso al pannello di chi gestisce oggi il dominio `orchidee-atao.it` (il "registrar").

---

## 1. Creare l'account GitHub dell'associazione

Fatto: l'account è `segreteria-atao`.

1. Attiva l'autenticazione a due fattori (Settings → Password and authentication): l'account custodisce il sito.

## 2. Caricare il sito su GitHub

Fatto: il codice è nel repository privato `segreteria-atao/sito-atao` e `keystatic.config.ts` punta già lì.
Per inviare le modifiche fatte in locale: `git push`.

## 3. Creare l'app GitHub del CMS (una volta sola)

Il CMS online fa entrare i volontari con il loro account GitHub. Per farlo serve una piccola "app GitHub", che Keystatic crea da solo.

1. Crea nella cartella del progetto un file `.env` con questa riga:

   ```
   PUBLIC_CMS_GITHUB=si
   ```

2. Avvia il sito in locale con `npm run dev` e apri <http://127.0.0.1:4321/keystatic>.
3. Keystatic propone di creare l'app GitHub: segui le istruzioni e installala sull'account dell'associazione, scegliendo il repository `sito-atao`.
4. Alla fine Keystatic scrive nel file `.env` quattro chiavi: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. **Tienile da parte e non condividerle**: servono al passo 4.
5. Togli la riga `PUBLIC_CMS_GITHUB=si` dal file `.env`: in locale il CMS torna a salvare sui file del computer.

Il file `.env` non viene mai caricato su GitHub (è escluso in `.gitignore`).

## 4. Pubblicare su Netlify

1. Vai su <https://app.netlify.com>, entra con l'account GitHub dell'associazione e scegli **Add new site → Import an existing project → GitHub → sito-atao**.
2. Le impostazioni di build sono già nel file `netlify.toml`: non cambiare nulla.
3. Prima di pubblicare, in **Site configuration → Environment variables** aggiungi le quattro chiavi del passo 3, con gli stessi nomi e valori.
4. Avvia la pubblicazione. Dopo qualche minuto il sito è visibile a un indirizzo provvisorio, tipo `https://sito-atao.netlify.app`.
5. Controlla il sito a quell'indirizzo prima di toccare il dominio.

## 5. Autorizzare il CMS sull'indirizzo online

L'app GitHub creata al passo 3 conosce solo l'indirizzo locale. Su GitHub apri **Settings → Developer settings → GitHub Apps → (l'app del CMS) → General** e in **Callback URL** aggiungi:

```
https://sito-atao.netlify.app/api/keystatic/github/oauth/callback
https://www.orchidee-atao.it/api/keystatic/github/oauth/callback
```

(usa l'indirizzo provvisorio vero che ti ha dato Netlify). Ora `https://sito-atao.netlify.app/keystatic` chiede di entrare con GitHub.

## 6. Collegare il dominio orchidee-atao.it

Su Netlify il dominio è già registrato nel progetto (`www.orchidee-atao.it` principale, `orchidee-atao.it` che rimanda a `www`).
Il dominio è gestito da **TOL** (server DNS `dns.tol.it` e `dns2.tol.it`): nel loro pannello, gestione DNS di `orchidee-atao.it`, cambiare **solo** questi tre record.

| Nome | Oggi | Dopo |
|---|---|---|
| `www` | CNAME → `orchidee-atao.it` | **CNAME → `sito-atao.netlify.app`** |
| `@` (dominio senza www) | A → `80.88.84.7` | **A → `75.2.60.5`** (Netlify) |
| `ftp` | CNAME → `orchidee-atao.it` | **A → `80.88.84.7`** (resta sul vecchio spazio web) |

**Non toccare** i record della posta: MX, `mail`, `smtp`, `imap`, `webmail` (puntano a 62.149.157.x e restano come sono).
Sul dominio senza www deve restare un solo record A; non ci sono record AAAA da togliere.

Il record `ftp` va fissato perché oggi segue il dominio principale: senza questa modifica l'FTP finirebbe su Netlify e si perderebbe l'accesso al vecchio spazio web, dove ci sono le foto originali.

Il cambio si propaga in qualche ora (TTL attuale 4 ore, al massimo un giorno). Quando il dominio risponde, Netlify attiva da solo il certificato HTTPS.

Gli indirizzi del vecchio sito (`Pagina_….html`) vengono reindirizzati alle pagine nuove dal file `public/_redirects`: i link già sparsi in giro e su Google continuano a funzionare.

## 7. Aggiungere i volontari

Ogni volontario che deve aggiornare il sito:

1. si crea un account GitHub gratuito;
2. viene aggiunto come collaboratore del repository `sito-atao` (su GitHub: **Settings → Collaborators → Add people**);
3. entra da `https://www.orchidee-atao.it/keystatic` con GitHub.

Ogni salvataggio dal CMS diventa una modifica su GitHub e Netlify ripubblica il sito da solo in un paio di minuti. Lo storico di GitHub conserva tutte le versioni: un errore si può sempre annullare.

---

## Se qualcosa non va

- **Il CMS online dice che non trova il repository:** controlla il nome in `keystatic.config.ts` (passo 2) e che l'app GitHub sia installata su quel repository (passo 3).
- **"Redirect URI mismatch" quando si entra nel CMS:** manca l'indirizzo nella Callback URL dell'app GitHub (passo 5).
- **La pubblicazione su Netlify fallisce:** in **Deploys** si apre il registro dell'errore; spesso manca una delle quattro chiavi del passo 3.
- **Le foto caricate dal CMS non compaiono subito:** è normale, il sito si ricostruisce in un paio di minuti.
