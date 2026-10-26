# ImportTycoon

Jogo de gestão no navegador, da Mainô Tecnologia S.A.: você abre uma importadora com R$ 150 mil e tem 12 meses para construir patrimônio ou quebrar tentando. Fornecedor, modal, câmbio, NCM, tributos, Radar, galpão, canais de venda, marketing, filial com benefício fiscal e sistema de gestão entram na conta.

Um único arquivo HTML, sem backend. Modo único: Desafio da semana, com a mesma semente para todo mundo que joga o mesmo segmento na mesma semana. O placar é o print que o jogador compartilha no final.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | O jogo completo, pronto para publicar em qualquer hospedagem estática |
| `icons/` | Favicon e ícone de tela inicial (64, 192 e 512 px) |
| `docs/spec.md` | Especificação do jogo: pilares, sistemas, segmentos, balanceamento e conceitos de Comex verificados |
| `sim/sim.mjs` | Simulador com bots (mestre, prudente, ingênuo, passivo, afobado, imprudente) para balanceamento |
| `sim/play.mjs` | Partida roteirizada "humana" para conferir o loop ponta a ponta |
| `sim/mundo.mjs` | Prova de que jogadores com decisões diferentes veem o mesmo dólar e os mesmos eventos na mesma semana |
| `sim/consult.mjs` | Mede o que acontece seguindo a consultoria todo mês, por nível e com ou sem Mainô Gestão |

## Rodar localmente

```bash
python3 -m http.server 8765
```

Abra `http://localhost:8765/`. Abrir o arquivo direto pelo sistema também funciona.

## Balanceamento

```bash
node sim/sim.mjs 100
node sim/sim.mjs 100 --segmentos
```

Flags extras: `--instrumentos`, `--filial`, `--mkt`, `--insp`, `--diag`. Alvo: estratégia razoável lucra, imprudente quebra por volta do quarto mês.

## Publicar

1. Suba `index.html` e `icons/` para um caminho do site (ex.: `maino.com.br/importtycoon/`). GitHub Pages, Vercel, Netlify ou S3 também servem.
2. Não há backend nem coleta de dados pessoais. A partida em andamento fica no navegador do jogador.
3. Única chamada externa: Google Fonts (Barlow, Barlow Condensed e Press Start 2P). Para zero terceiros, baixe as fontes e troque o `<link>` por `@font-face` locais.
4. Teste em HTTPS: o botão de compartilhar no WhatsApp com imagem usa a Web Share API, que só funciona em HTTPS e no celular. No desktop ele copia a imagem e abre o WhatsApp Web com o texto.
5. Troque o `og:image` por uma imagem 1200×630 se quiser preview grande em redes sociais.

## Antes de publicar

- Fiscal: validar alíquotas de II/IPI por NCM, taxa Siscomex, AFRMM, regra da multa de NCM (LC 227/2026) e a carga efetiva do TTD 409 (2,6%) usada na filial.
- Jurídico e marketing: revisar as frases sobre os planos Mainô (ex.: "fiscalização nunca multa") e o CTA final. Conferir que os nomes dos fornecedores fictícios não coincidem com empresas reais.
- Marketing: definir o link e as UTMs do CTA "Quero importar de verdade".
- Produto: confirmar nomes e benefícios dos planos Operação, Gestão e Comando.

## Licença

© Mainô Tecnologia S.A. Todos os direitos reservados.

Produzido com apoio de IA e sujeito a revisão humana.
