# Client e non solo

Provo un po' spiegare qualche info utile che ho appreso durante l'implementazione di [MatchView.vue](../src/client/src/views/MatchView.vue). Chiaramente è ancora tutto da raffinare, ma secondo me è già una buona base.

## Avvio del sistema

All'inizio ho notato che era necessario fare esplicitamente una _build_ del sistema prima di avviarlo. Non ho fondamenti scentifici per dire che è fondamentale, ma da quel momento l'ho sempre fatta. Quindi se non vedete qualche modifica, provate a buildare.

Per testare la parte grafica ovviamente basta avviare solo il client. `npm run serve:client` funziona benissimo.

Per avviare tutto il sistema e partire da zero, io uso questo comando:

```sh
npm run build && docker compose down -v && sudo npm run start
```

**NB**: se quando eseguite questo comando cerca di eseguire un download e fallisce l'esecuzione, è perché non avete l'immagine di MongoDB in locale. Per il momento basta fare una volta `docker compose up database`, farlo scaricare con calma, e da quel momento funziona. Per sistemare questa cosa basterebbe fare in modo che se il server non riesce a connettersi con il database, riprovi un certo numero di volte prima di terminare.

## Funzionamento della pagina

`MatchView` è la pagina in cui ha luogo la partita. C'è la _board_ di gioco e due _card_ che mostrano le informazioni dei giocatori.

Appena un utente entra in questa pagina, invia un messaggio "matchmaking" via socket, per simulare l'utente che "mette ready" e attende un altro giocatore. Lato server, il giocatore viene aggiunto a una _room_ di socket.io che si chiama "queue", per simulare che l'utente è in coda. Ovviamente questa parte è provvisoria!

Quando un altro utente si collega alla pagina, entra anch'esso nella _room_ "queue", e il server, vedendo che ci sono 2 giocatori, li toglie dalla "queue", crea una nuova partita e li inserisce in una _room_ denominata con l'ID (di MongoDB) della partita. Qui nel mezzo ci sarà la logica del matchmaking.

Il server invia un messaggio "matchStart" ai due client, che richiedono la partita tramite una richiesta "getMatch" e visualizzano lo stato sulla _board_. Da questo momento, il _player1_ può effettuare la prima mossa.

Quando una mossa viene eseguita, viene inviato al server un messaggio "addMove", la mossa viene processata e aggiunta, e il server invia a entrambi i client un messaggio "move" contenente la nuova mossa. Questo significa che in assenza di connessione l'utente non vedrà la sua mossa avere effetto neanche in locale. L'animazione di esplosione delle _pile_ avviene in ogni client separatamente.

## Parte di TypeScript

Per il momento ho lasciato tutta la parte che configura le socket nel file principale; ce le vedo bene lì, ma sono aperto a cambiamenti. Sono più convinto che la funzione che aggiorna la _board_ vada lasciata nello stesso file.

Ho usato gli **store** della libreria _Pinia_ per salvare i dati della partita e dell'utente (al momento solo lo username). Una volta che ci siamo accordati sull'utilizzo degli _store_ forse sarebbe il caso di scrivere qualche test.

## Parte di Vue

Ho integrato **Material Design Bootstrap**, che mette a disposizione dei tag un po' più avanzati da utilizzare al posto di quelli di base (per esempio `<MDBContainer>` invece del classico `<div>`), e ho creato dei componenti con questi tag (Vedi [Title.vue](../src/client/src/components/Title.vue), che potrebbe essere utile a tutti, anche se ovviamente ancora in fase embrionale).

**NB**: all'inizio, appena importavo un componente Vue per utilizzarlo, venivano fuori degli errori strani e del tutto scollegati. Se vi succede questo, riavviate Code, non perdete mezz'ora del vostro tempo per cercare una soluzione :)

## Colori

Con SCSS è possibile definire un tema specificando un colore per ogni elemento del sito; al momento è dentro [index.html](../src/client/index.html), e ci sono ancora dei colori scritti in giro per il codice.
