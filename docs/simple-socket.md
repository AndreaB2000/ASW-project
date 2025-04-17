# Funzionamento Socket.IO

In questa versione, dal client è possibile inviare un messaggio al server tramite un form (in `TheWelcome.vue`); alla ricezione del messaggio, il server stampa in console "Messaggio ricevuto" e lo rispedisce indietro. Con questo sistema, il server risponde direttamente al singolo client (usando appunto `socket.emit()`).

## Server

- In `server.ts` viene chiamata una funzione per inizializzare l'oggetto "io", a partire dall'oggetto "server" di Express: `ioHandler.initializeIO(server)`
- In `server.ts` vengono definiti gli _handler_ dei messaggi ricevuti tramite socket (definizioni in `registerSocketHandlers.ts`): `registerSocketHandlers(ioHandler.getIO())`
- `registerSocketHandlers.ts` può essere visto come la definizione delle API, dove al posto della route (per esempio, "/account/register") è specificato il nome del messaggio (in questo caso "message"), e viene definito il comportamento del server alla ricezione di un messaggio di quel tipo. Idealmente, all'interno della lambda definita in `socket.on()` andrebbe messa una chiamata al controller.

## Client

- In `App.vue` viene inizializzata la socket lato client, e viene esportata per essere utilizzabile anche negli altri file
- In `TheWelcome.vue` viene importato l'oggetto `socket`, ed è implementato un form che al click del bottone invia un messaggio. Il server risponde reinviando indietro lo stesso messaggio.
