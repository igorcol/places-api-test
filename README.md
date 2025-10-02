<div align="center">

### Mapeando a noite sorocabana.

</div>

---

### `> L A B _ N O T E S . T X T`

> Este projeto foi feito para praticar e aprender sobre a PLACES API do google
>
> A mesma api será utilizada em um outro projeto pessoal.
>

---

### `⚡ T E C H _ S T A C K ⚡`

* 🚀 **NEXT.JS 14+ // REACT**
    * *A carcaça do foguete. A estrutura para construir o futuro, de forma rápida e escalável.*

* 🗺️ **GOOGLE PLACES API**
    * *O oráculo. A fonte de dados brutos que alimenta a nossa inteligência.*

* 🎨 **TAILWIND CSS**
    * *Estilo no modo ultra-instinto. Design rápido, direto e sem firulas.*

* 🔒 **TYPESCRIPT**
    * *O colete à prova de balas. Garante que o código não sangre por erros bobos.*

* ☁️ **VERCEL**
    * *A plataforma de lançamento. Onde o código se torna real e acessível para o mundo.*

---

---

### `V1  Evolução -> V2`

#### `V1: (Client-Side)`
O cliente (navegador) trabalhava sozinho. A partir do `useEffect`, disparava uma única `textQuery` genérica (`'bares e baladas em Sorocaba'`) direto para a API do Google. Era funcional, mas amador. **Resultado:** Lento para o usuário, lógica de busca exposta e sem inteligência de curadoria.

#### `V2: (Server-Side)`
O cliente agora delega. Ele faz **UMA** chamada para nossa própria API (`/api/places`). Nosso servidor, organiza **MÚLTIPLAS** chamadas em paralelo ao Google, buscando por tipos específicos (`'baladas'`, `'bares'`, `'shows'`). Os resultados são agregados, duplicatas removidas, e a lista final é mantida em um **cache** de memória para velocidade absurda. **Resultado:** Resposta quase instantânea, segurança máxima com a chave de API 100% secreta e controle total sobre os dados entregues.

    O primeiro usuário realiza a chamada para a API, que salva os dados retornados em cache durante X tempo. Outros usuários que acessarem neste intervalo de tempo, não realizarão novas chamadas na API.

---
