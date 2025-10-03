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

### `V1 -> V3.2`

#### `V1: A IDEIA`

O cliente (navegador) trabalhava sozinho. Disparava uma única `textQuery` genérica e estática. Era funcional para provar o conceito, mas amador. **Resultado:** Lento, inseguro e sem inteligência.

#### `V2: A MÁQUINA`

A arquitetura é profissionalizada. O cliente faz uma única chamada para nossa própria API, que orquestra múltiplas buscas em paralelo e salva os resultados em um cache de memória. **Resultado:** Performance, segurança e controle. A fundação robusta foi construída.

#### `V3: Busca Dinâmica e Curadoria`

Com a máquina pronta, começamos o processo de ensiná-la a "pensar".

- **`V3.0: Geolocalização`**
  O app aprendeu **ONDE** olhar. Deixou de ser fixo em Sorocaba para usar as coordenadas do usuário, com um cache segmentado por região. **Resultado:** Uma aplicação universal e pessoal.

- **`V3.1: Busca Híbrida`**
  O app aprendeu **O QUE** procurar. A busca evoluiu para uma estratégia híbrida, combinando a "rede" (`searchNearby`) com a "lança" (`searchText`) para encontrar tanto a base de bares/clubes quanto os nichos específicos (`lounge`, `hookah`). **Resultado:** Cobertura de dados massivamente superior.

- **`V3.2: Curadoria Pós-Busca`**
  O app aprendeu **O QUE IGNORAR**. Com a telemetria do Modo Debug, implementamos um funil de filtragem no servidor que aplica regras de negócio (baseadas em `primaryType` e `types`) para eliminar "falsos positivos". **Resultado:** A mais alta qualidade de dados. O app se torna um especialista confiável.

---


```
**ERROS PARA VERIFICAR DEPOIS**

- Se der algum erro na busca e não achar nada
    O cache é salvo vazio e só é recarregado novamente depois que o cache expira

```
