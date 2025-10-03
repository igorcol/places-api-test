<div align="center">

### Mapeando a noite sorocabana.

</div>

---

### `> L A B _ N O T E S . T X T`

> Este projeto foi feito para praticar e aprender sobre a PLACES API do google
>
> A mesma api será utilizada em um outro projeto pessoal.

---

### `⚡ T E C H _ S T A C K ⚡`

- 🚀 **NEXT.JS 14+ // REACT**

- 🗺️ **GOOGLE PLACES API**

- 🎨 **TAILWIND CSS**

- 🔒 **TYPESCRIPT**

- ☁️ **VERCEL**

---

### `V1  Evolução -> V2`

#### `V1: (Client-Side)`

O cliente (navegador) trabalhava sozinho. A partir do `useEffect`, disparava uma única `textQuery` genérica (`'bares e baladas em Sorocaba'`) direto para a API do Google. Era funcional, mas amador. **Resultado:** Lento para o usuário, lógica de busca exposta e sem inteligência de curadoria.

#### `V2: (Server-Side)`

O cliente agora delega. Ele faz **UMA** chamada para nossa própria API (`/api/places`). Nosso servidor, organiza **MÚLTIPLAS** chamadas em paralelo ao Google, buscando por tipos específicos (`'baladas'`, `'bares'`, `'shows'`). Os resultados são agregados, duplicatas removidas, e a lista final é mantida em um **cache** de memória para velocidade absurda. **Resultado:** Resposta quase instantânea, segurança máxima com a chave de API 100% secreta e controle total sobre os dados entregues.

    O primeiro usuário realiza a chamada para a API, que salva os dados retornados em cache durante X tempo. Outros usuários que acessarem neste intervalo de tempo, não realizarão novas chamadas na API.

#### `V3: A CONSCIÊNCIA GEOGRÁFICA`

O app deixa de ser sobre Sorocaba e passa a ser sobre **o usuário**. O cliente agora tem a missão de obter as coordenadas do usuário via `navigator.geolocation` e enviá-las para a nossa API. O servidor usa essa localização para realizar buscas geográficas precisas (`searchNearby`), e o **cache** evolui: deixa de ser um "post-it" único e se torna um "arquivo" com pastas para cada região do mapa. **Resultado:** Uma aplicação universal, capaz de funcionar em qualquer cidade. A experiência se torna pessoal e altamente relevante para o contexto do usuário.

#### `V3.1: CURADOR DE NICHOS`

Percebemos que as categorias oficiais do Google eram insuficientes para o nosso nicho. A solução foi fazer nosso app ser mais inteligente que a ferramenta que ele usa. O servidor agora dispara um arsenal de buscas em paralelo: uma **Busca por Proximidade** com tipos oficiais (`bar`, `night_club`) para criar a base, e múltiplas **Buscas por Texto** para caçar os nichos específicos com palavras-chave (`lounge`, `hookah`, `festas`). **Resultado:** Qualidade de dados massivamente superior. O app agora encontra não apenas os lugares óbvios, mas a _vibe_ que o usuário procura, tornando-se um verdadeiro especialista.

#### `V3.2: O PENTE FINO (Curadoria Pós-Busca)`

Com a telemetria do 'Modo Debug', identificamos que a busca híbrida ainda trazia "ruído" (lojas, restaurantes, etc.). Esta versão implementa um funil de filtragem no servidor. Ele aplica um conjunto de regras (baseado em `primaryType` e `types`) **depois** de receber os dados, garantindo que apenas os resultados mais relevantes para o nosso nicho cheguem ao usuário. **Resultado:** A mais alta qualidade de dados até agora. O app se torna um especialista, eliminando "falsos positivos" e entregando uma lista confiável.

---

```
**ERROS PARA VERIFICAR DEPOIS**

- Se der algum erro na busca e não achar nada
    O cache é salvo vazio e só é recarregado novamente depois que o cache expira

```
