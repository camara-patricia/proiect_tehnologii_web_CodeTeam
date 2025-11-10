# proiect_tehnologii_web_CodeTeam
Aplicație web monitorizarea prezenței

**Obiectiv**
Realizarea unei aplicații web care să permită monitorizarea prezenței la o serie de activități a unor participanți.
**Descriere**
Aplicația trebuie să permită înregistrarea unor evenimente și înregistrarea participării la aceste evenimente.

Platforma este bazată pe o aplicație web cu arhitectură de tip Single Page Application accesibilă în browser de pe desktop, dispozitive mobile sau tablete (considerând preferințele utilizatorului).
Funcționalități (minime)

Ca organizator al unui eveniment (OE) trebuie să pot adăuga un grup de evenimente.
Un grup de evenimente poate conține un singur eveniment sau un grup de evenimente repetate pentru o perioadă de timp.
Un eveniment este inițial în starea CLOSED. La momentul programat, evenimentul devine OPEN. După intervalul în care se desfășoară evenimentul, starea evenimentului este din nou CLOSED.
La crearea evenimentului se generează un cod de acces la acesta (aplicația oferă opțiunea de a reprezenta codul sub forma unui QR sau a unui text). OE poate afișa codul pe un proiector.
Participanții introduc codul în aplicație și devin prezenți. Introducerea se poate face printr-o poză cu telefonul mobil pentru codurile QR sau printr-un text input pentru codurile text
OE poate monitoriza lista participanților prezenți și poate vedea momentul în care fiecare participant și-a confirmat prezența
OE poate exporta lista cu participanții într-un fișier CSV sau XLSX, atât pentru un singur eveniment cât și pentru un grup de evenimente.

