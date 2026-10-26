# ImportTycoon (ex-"O Importador") — Especificação do jogo (v0.1, rascunho)

> Jogo de gestão para navegador em que o jogador monta uma importadora do zero.
> Objetivo de negócio: viralizar entre quem vive ou sonha com importação e levar a marca Mainô junto.

---

## 1. Visão em uma frase

**"Você tem R$ 150 mil, um escritório alugado e um Radar limitado. Em 12 meses, vire o maior importador do Brasil ou quebre tentando."**

O jogo ensina, jogando, o que a Mainô resolve na vida real: custo de nacionalização, câmbio, modal, tributos, canal de venda, caixa. Quem termina uma partida entende por que importar é difícil e por que um sistema especializado importa.

---

## 2. Problema e oportunidade

- Importação é percebida como "caixa-preta": quem nunca importou acha que é só comprar na China; quem importa sofre com custo oculto, câmbio e burocracia.
- Conteúdo educativo de Comex é árido e não se espalha. Um jogo com placar e cards de resultado se espalha.
- A Mainô tem autoridade técnica (14 anos, 1.500+ importadores, time com MBA em Comex) para "balancear a economia" do jogo com números verossímeis. Nenhum concorrente genérico consegue assinar um jogo assim sem errar os tributos.

**Público-alvo (em ordem de prioridade):**
1. Donos e gestores de PMEs importadoras e distribuidoras (ICP da Mainô).
2. Profissionais de Comex, despachantes, analistas de importação (influenciadores de compra, muito ativos no LinkedIn).
3. Empreendedores e estudantes que sonham em importar (volume, viralização, pipeline futuro).

---

## 3. Objetivos e métricas

| Objetivo | Métrica | Meta 90 dias |
|---|---|---|
| Viralizar | Jogadores únicos | 50 mil |
| Viralizar | Taxa de compartilhamento do card final | ≥ 25% das partidas concluídas |
| Viralizar | K-factor (novos jogadores por jogador via link) | ≥ 0,3 |
| Engajar | Partidas concluídas (12 turnos) | ≥ 40% das iniciadas |
| Engajar | Retorno no desafio semanal seguinte | ≥ 20% |
| Marca | Lembrança de marca: "jogo da Mainô" nas menções | acompanhar menções em LinkedIn e Instagram |
| Pipeline | Opt-in de e-mail para salvar progresso e ranking | ≥ 10% dos jogadores |
| Pipeline | Cliques no CTA "faça isso de verdade" | ≥ 3% das partidas concluídas |

**Não-objetivos (v1):**
- Não é simulador fiscal exato. Tributos são simplificados, porém verossímeis (ordem de grandeza certa).
- Não tem multiplayer em tempo real. Competição é por ranking assíncrono.
- Não tem mapa de cidade completo estilo SimCity. A "base" cresce visualmente, mas as decisões são em painéis.
- Não tem compras in-app nem monetização direta. O jogo é mídia de marca.
- Não exige login para jogar. Login só para ranking e salvar.

---

## 4. Pilares de design

1. **Partida curta, decisão densa.** 12 turnos (meses) em 10 a 15 minutos. Cada turno tem 3 a 5 decisões reais.
2. **Toda decisão tem trade-off visível.** Aéreo é rápido e caro; marítimo é barato e lento; just in time economiza galpão e arrisca ruptura.
3. **O custo de nacionalização é o "aha".** O jogador vê FOB virar custo final e entende por que a margem some.
4. **Humor de Comex.** Eventos e selos falam a língua de quem importa: canal vermelho, demurrage, "o despachante sumiu".
5. **Mainô é mentora, não outdoor.** A marca aparece como upgrade de jogo e como quem explica o que aconteceu, nunca como banner.

---

## 5. Loop central

```
Turno (1 mês)
  1. Ler o mercado      → demanda, dólar, notícias do mês
  2. Comprar            → fornecedor, quantidade, modal, incoterm, câmbio
  3. Receber / liberar  → parametrização, tributos, armazenagem
  4. Vender             → canal, preço, prazo de recebimento
  5. Fechar o mês       → "o que aconteceu com a demanda" (por produto: demanda = base × sazonalidade × preço × marketing × confiança × eventos; estoque → vendido por canal → sem atendimento; diagnósticos em texto), depois DRE simplificada, caixa, dívidas, eventos. O mesmo painel fica fixo no topo da sala de Mercado até o próximo fechamento.
  6. Reinvestir         → galpão, equipe, Radar, sistema de gestão
```

Fim de partida: 12 turnos ou caixa negativo sem crédito (falência).
Pontuação: patrimônio líquido final + selos conquistados.

---

## 6. Sistemas do jogo

### 6.1 Segmentos como seletor de dificuldade
O jogador escolhe o segmento na tela inicial, e o segmento define a dificuldade pelo tratamento administrativo, pela logística e pela margem. Ranking semanal é por segmento.

| Segmento | Nível | Produtos (NCM, II / IPI) | Anuência | Outras regras |
|---|---|---|---|---|
| **Pet shop** | Fácil | Coleira de couro 4201.00.10 (18% / 0), cama pet 6307.90.90 (35% / 0), comedouro plástico 3924.90.00 (16,2% / 6,5%), ração 15 kg 2309.10.00 (12,6% / 6,5%) | Só a ração: registro e LI com anuência do MAPA (R$ 2 mil, 1 mês, 10% de exigência), pré-embarque | Demanda estável; produto volumoso e pesado (ração não compensa por aéreo) |
| **Eletrônicos** | Médio | Fone 8518.30.00, carregador 8504.40.21, smartwatch 8517.62.77, caixa de som 8518.22.00 | Anatel (fone, smartwatch, caixa) e Inmetro (carregador): certificação, não LI. Pode embarcar sem ela, mas carga que chega sem certificação fica retida um mês e paga R$ 3 mil (R$ 2,5 a 3 mil, 1 mês, 10% de exigência) | Black Friday forte; NCM errada comum |
| **Beleza e suplementos** | Difícil | Sérum 3304.99.10 (16,2% / 14,3%), protetor solar 3304.99.90 (16,2% / 0), whey 2106.10.00 (12,6% / 0), multivitamínico 2106.90.30 (14,4% / 0) | Todos: LI com anuência da Anvisa, pré-embarque (R$ 6 mil, 2 meses, 30% de exigência) | Validade: 3% do estoque vence por mês; canal vermelho +5 pontos; margens maiores |

Fornecedores mudam de nome e de certificação por segmento (o premium de beleza é coreano, com GMP/ISO 22716). Dificuldade medida com bots (patrimônio mediano em 12 meses, 100 seeds): mestre pet 355k, eletrônicos 264k, beleza 171k; prudente 247k, 175k, 175k; afobado quebra nos três.

Pente-fino de justiça (23/10/2026, após todas as mecânicas): bots por segmento, mestre/prudente/ingênuo em pet 316k/224k/153k, eletrônicos 266k/165k/195k, beleza 255k/204k/172k; afobado quebra em 94 a 96% dos casos. Plano "humano razoável" (sistema Mainô, anuências no mês 1, galpão, pedidos de 2,5 meses de demanda, marketing só com estoque): eletrônicos 285k, beleza 236k, pet 105k. O pet falha no plano humano por ruptura de estoque (repõe só quando acaba, com 2 meses de lead), o que motivou a coluna de cobertura e o alerta da Mia. Ajustes feitos no pente-fino: cheque especial automático, queda de confiança limitada a 10 pontos por mês com piso de 60%, promessa de recorrência com 3 meses entre pedidos, Anvisa a R$ 4 mil com 20% de exigência, validade de 2% ao mês e preços de beleza +10%.

Nicho detalhado abaixo refere-se ao segmento Eletrônicos (o primeiro implementado):
- 3 nichos na v1, cada um com perfil distinto:
  - **Eletrônicos e acessórios** — giro alto, margem baixa, muita concorrência, risco de anuência (Anatel).
  - **Autopeças** — demanda estável, pedido mínimo alto, cliente B2B, prazo longo.
  - **Máquinas e equipamentos** — ticket alto, poucas vendas, ex-tarifário possível, muito capital parado.
- Cada produto tem: NCM (simplificada), alíquotas, peso/volume (cubagem define modal), sazonalidade, demanda base e elasticidade de preço.
- **Classificação de NCM é mecânica:** o jogador escolhe entre 3 NCMs plausíveis. Errar baixa a alíquota agora e gera multa e retificação depois. Contratar despachante bom ou ter o sistema de gestão reduz o risco.

### 6.2 Demanda de mercado
- Curva mensal por nicho com sazonalidade (Dia das Mães, Black Friday, Natal, volta às aulas).
- "Relatório de mercado" custa dinheiro e revela demanda dos próximos 3 meses com margem de erro.
- Concorrência: se o jogador vende muito acima do preço de mercado, estoque encalha; muito abaixo, vende rápido e queima margem.
- **Marketing e confiança da marca.** Na sala de vendas o jogador regula um orçamento mensal (0 a R$ 40 mil) que aumenta a demanda de todos os produtos com retorno decrescente: R$ 6 mil dão +50%, R$ 18 mil dão +75%, teto de +100%. Demanda gerada e não atendida (cliente que procura e não acha estoque, em produto que esteve em estoque nos últimos 2 meses) decepciona: se mais de 20% da demanda do mês fica sem atendimento, a confiança da marca cai (até 20 pontos por mês, piso de 50%) e multiplica toda a demanda futura; ela sobe 10 pontos por mês em que menos de 10% fica sem atendimento. A sala mostra a barra de confiança e alerta quando a demanda prevista supera o estoque; a Mia liga marketing a compras. A tabela de vendas tem a coluna **Cobertura** (meses que o estoque cobre à demanda prevista, próximo embarque e quando chega; vermelho = vai faltar), e a Mia avisa quando a cobertura é menor que o lead time. A sala também tem a **Projeção de estoque mês a mês**: grade produto × mês até dezembro com o estoque previsto no fim de cada mês (demanda aos preços, canais, marketing e confiança de hoje; chegadas a caminho somadas depois da venda do mês; validade; cargas retidas por anuência marcadas), em vermelho onde vai faltar e em amarelo onde sobra mais de 4 meses. Bots confirmam a lição: marketing sincronizado com estoque (mestre, 250k) > sem marketing (231k) > marketing sempre ligado (197k); ingênuo com marketing e pipeline fraco cai de 215k para 156k.

### 6.3 Fornecedores e negociação
- 2 a 4 fornecedores por produto, em países diferentes (China, Índia, EUA, Alemanha, Itália, Coreia). Atributos: preço, MOQ, prazo de produção, confiabilidade, condição de pagamento (sinal 30/70, 100% antecipado, carta de crédito).
- **Negociação "na língua deles":** minigame de troca de mensagens. O fornecedor escreve no idioma dele (com tradução automática imperfeita) e o jogador escolhe entre 3 respostas. Respostas que respeitam etiqueta comercial do país (formalidade, pedido de amostra, pergunta sobre MOQ) destravam desconto ou melhor prazo; respostas apressadas pioram o acordo. Contratar "comprador internacional" ou "tradutor" remove a imperfeição.
  - Diretriz: a mecânica é sobre barreira de comunicação e prática comercial, nunca caricatura cultural.
- **Inspeção pré-embarque é decisão por pedido** (R$ 1.800 por embarque, entra no custo nacionalizado). Sem ela, a chance de incidente no lote é proporcional à confiabilidade do fornecedor: 34% no barato, 10% no de lista, 1% no premium. O incidente sorteado é lote com defeito (perde 12 a 25% das unidades), produto fora da especificação (perde 30%, sem valor de revenda) ou quantidade curta (perde 15%); em todos os casos você pagou por tudo e o custo unitário sobe. Lote com defeito também derruba a confiança da marca em 8 pontos e produto fora da especificação em 4 (devoluções e avaliações ruins), com aviso no modal de chegada e linha no fechamento; quantidade curta é só financeira. Primeiro pedido com o fornecedor barato tem 4% de chance de ele sumir com o sinal (1% com inspeção, porque o inspetor visita a fábrica); o fornecedor some do jogo. Bots: inspeção vale +23k com o fornecedor barato, +6k com o de lista e nada com o premium.
- **Promessa tem cobrança.** Quando o desconto vem de uma promessa de recorrência (Guangzhou: 3 embarques com no máximo 2 meses entre eles; Taipei: 2 lotes em até 3 meses), o jogo registra o acordo. Os pedidos seguintes dentro do acordo recebem o preço de volume sem nova negociação. Se o prazo passa sem pedido: na primeira vez o fornecedor fica chateado (preço 5% maior e nenhum desconto por 3 meses); na segunda, para de atender por 3 meses. Quem cumpre vira parceiro e ganha 2% extra em todos os pedidos futuros. O status aparece no card do fornecedor e a Mia avisa no mês do prazo.

### 6.4 Logística e modal
| Modal | Custo | Lead time | Observações |
|---|---|---|---|
| Marítimo FCL | baixo por unidade | 35 a 50 dias | precisa encher um contêiner; demurrage se atrasar retirada |
| Marítimo LCL | médio | 40 a 60 dias | volume pequeno; mais manuseio, mais avaria |
| Aéreo | alto | 5 a 10 dias | ideal pra reposição urgente e produto leve |
| Courier / remessa expressa | muito alto | 3 a 7 dias | só pequenas quantidades; tributação simplificada |
| Rodoviário (Mercosul) | médio | 7 a 15 dias | só fornecedores da região |

- Incoterm na v1: EXW, FOB, CIF (o jogador vê como o risco e o custo mudam de mão).
- Seguro de carga opcional. Sem seguro, avaria ou perda vira prejuízo total.

### 6.5 Desembaraço e tributos
- Ao chegar, a carga cai em um canal: **verde** (libera), **amarelo** (documentos, +5 dias), **vermelho** (vistoria, +15 dias, chance de multa se NCM errada), **cinza** (raro, investigação de preço).
- Probabilidade do canal depende de histórico do jogador, NCM, despachante e sistema de gestão.
- **Custo de nacionalização mostrado em cascata**, do FOB ao custo final:
  frete + seguro → II → IPI → PIS/COFINS-importação → ICMS (por dentro) → AFRMM (só marítimo) → taxa Siscomex → capatazia/THC → armazenagem → despachante → frete interno.
- A tela final de cada processo mostra: "Você comprou por R$ X. Custou R$ Y pra ter em estoque." Esse é o momento educativo central e o mais compartilhado.
- Licenças de importação (LI) com anuência (Anvisa, Inmetro, Anatel, Exército) aparecem em produtos específicos: sem LI prévia, a carga fica retida e paga armazenagem.

### 6.6 Câmbio e financiamento
- Dólar flutua a cada turno com tendência + ruído + choques de eventos.
- Opções: **câmbio spot** (paga a taxa do dia), **fechamento antecipado / trava** (paga taxa de hoje + spread, elimina risco), **pagar no vencimento** (aposta no dólar).
- Crédito disponível, destravado por maturidade:
  - Capital de giro (juros altos, rápido).
  - **FINIMP** (financiamento à importação, juros menores, exige histórico).
  - **FIDC / antecipação de recebíveis** (transforma vendas a prazo em caixa, com deságio).
  - Assunção: a sigla "FDIC" da ideia original foi interpretada como FIDC. Confirmar.
- **Cheque especial automático:** se o caixa fecha negativo, o banco cobre com capital de giro até o limite (R$ 80 mil), cobrando juros; a partida só acaba quando o caixa fica negativo além do limite por dois meses seguidos. Antes disso, empresas lucrativas quebravam só pelo choque da chegada.
- **Fluxo de caixa mês a mês (Financeiro).** Meses realizados abrem entradas (vendas à vista já sem comissão, recebimentos B2B, crédito e FIDC) e saídas (chegadas com saldo e tributos, sinais e investimentos, fixos com marketing, juros, ICMS efetivo da filial) mais um "outros" que concilia com o caixa final (multas, perdas, eventos). Meses futuros são projetados só com o que já está contratado: recebíveis, embarques a caminho ao dólar de hoje, vendas do estoque atual e das chegadas aos preços de hoje, custos fixos e juros atuais, sem compras novas nem eventos. A Mia aponta o menor caixa previsto e o mês em que ele fica negativo.

### 6.7 Estoque e armazenagem
- Três estratégias:
  - **Just in time** — sem galpão, mercadoria vai direto do porto pro cliente. Zero custo fixo, risco alto de ruptura e de perder venda.
  - **Galpão alugado** — custo fixo mensal, capacidade por m³, permite comprar em FCL e aproveitar sazonalidade.
  - **Armazém geral / 3PL** — paga por volume usado, flexível, mais caro por unidade.
- Estoque parado custa capital e, em eletrônicos, deprecia.

### 6.8 Canais de venda
| Canal | Margem | Giro | Prazo de recebimento | Risco |
|---|---|---|---|---|
| Distribuidor regional (B2B) | média | alto em volume | 45 a 60 dias | inadimplência |
| Marketplace | baixa (comissão 15 a 20%) | alto | 14 dias | guerra de preço |
| Loja própria online | alta | baixo no início | à vista | exige investir em marketing |
| Representante comercial | média | médio | 30 dias | comissão |
| Licitação pública | média | lote grande e raro | 90 dias | atraso de pagamento |

- O jogador abre canais com investimento e os canais amadurecem com o tempo (reputação).

### 6.9 Expansão e progressão
- **Nível da empresa (tycoon):** experiência = faturamento acumulado + R$ 50 mil por marco. Cinco níveis com vantagem concreta: Garagem (0) → Escritório (100k: fornecedores aceitam MOQ 25% menor) → Importadora (300k: capital de giro a 2,5% ao mês) → Trading (600k: +10% de demanda) → Grupo Importador (1,2M: Radar Ilimitada sem custo). Nível na barra superior com % para o próximo, barra de progresso na Diretoria, modal de celebração ao subir, nível no card final.
- **Marcos (10):** primeira importação, sistema contratado, Mainô em operação, galpão, Radar Limitada, 1.000 unidades vendidas, primeiro FCL, fornecedor parceiro, filial com benefício fiscal, capital dobrado. Checklist na Diretoria e modal ao conquistar.
- **Radar Siscomex** como gate real de progressão: Expresso (até USD 50 mil por semestre) → Limitado (USD 150 mil) → Ilimitado. Subir de nível exige comprovar capacidade financeira e histórico limpo.
- Contratações: analista de Comex júnior, pleno ou sênior (R$ 600 / 1.200 / 2.000 por mês, valores estilizados para a escala do jogo): 3/6/9% a menos no preço do fornecedor e 5/10/15% no frete; o sênior conduz a negociação sozinho no melhor desconto. Substitui o antigo "comprador internacional" (26/10/2026).
- Infra: escritório → galpão → segundo galpão → **filial em Santa Catarina com TTD 409** (benefício fiscal de ICMS na importação). Implantação R$ 35 mil, custo fixo R$ 3,5 mil/mês, pronta em 1 mês, exige 2 importações concluídas e Radar Limitada. Efeito: ICMS da importação diferido no desembaraço (a linha de 18% por dentro sai da cascata) e carga efetiva de 2,6% sobre as vendas; soma 80 m³ de galpão. O card avisa que só compensa acima de uns R$ 25 mil importados por mês, e a Mia explica que o benefício exige operação real no estado e cai gradualmente com a Reforma Tributária (2029 a 2032). Base: art. 246 do Anexo 2 do RICMS/SC e Lei 17.763/2019 (diferimento no desembaraço + crédito presumido na saída); a carga efetiva de 2,6% é simplificação a confirmar com a área fiscal. Espírito Santo (Invest-ES) tem desenho parecido e pode virar segunda opção.
- **Sistema de gestão em 4 níveis**, cada um reduzindo um risco (medido com bots no perfil ingênuo, patrimônio mediano):
  | Nível | Mensalidade | O que muda | Mediana |
  |---|---|---|---|
  | Sem sistema | 0 | Não emite NF-e: marketplace bloqueado, só metade dos clientes B2B compra, 20% de chance por mês de fiscalização (multa R$ 8 mil e operação parada 30 dias) | 173k |
  | Sistema generalista | R$ 600 | Emite NF-e e libera marketplace, mas erra a NF-e de importação em 35% das chegadas e a fiscalização multa R$ 4 mil | 230k |
  | Mainô ERP · Operação | R$ 990 | NF-e de importação pela DUIMP sem erro, fiscalização nunca multa, metade do canal vermelho, sugestão de NCM, aviso de alíquota, R$ 800/mês e R$ 500/processo economizados | 242k |
  | Mainô ERP · Gestão | R$ 1.690 | Armazenagem extra de amarelo/vermelho pela metade, sem demurrage nem efeito de porto congestionado, mais R$ 800/mês de contabilidade, margem por produto (custo nacionalizado contra preço de venda) na compra e nas vendas, previsão de demanda exata | 244k |
  | Mainô ERP · Comando | R$ 2.900 | Botão "Sugerir quantidade" (cobre 2 meses após a chegada descontando estoque e trânsito), inadimplência B2B zero, canal amarelo pela metade | 248k |
  Sem downgrade. A diferença entre planos cresce com o volume: para um importador pequeno cada degrau se paga por pouco; para quem escala, Gestão e Comando viram diferença de dezenas de milhares.
- Cada upgrade de base muda o visual: a base cresce na tela (isométrico simples).

### 6.10 Eventos e riscos (baralho de cartas)
Sorteados por turno, com probabilidade modulada pelas escolhas do jogador:
- Greve de auditores fiscais (desembaraço para).
- Navio atrasado / contêiner rolou pro próximo navio.
- Alta brusca do dólar (quem não travou câmbio sofre).
- Avaria ou extravio de carga (seguro decide).
- Canal vermelho com multa por NCM.
- Fornecedor atrasa 30 dias a produção.
- Fornecedor some com o sinal (só fornecedor sem histórico).
- Cliente distribuidor atrasa pagamento.
- Antidumping novo no seu produto (tributo sobe).
- Ex-tarifário aprovado (tributo cai) para máquinas.
- Mudança de alíquota pela Receita (quem tem sistema atualizado é avisado antes).
- Chuva e congestionamento no porto (armazenagem sobe).
- Demurrage por contêiner parado.
- Concorrente derruba preço de mercado.
- Pedido grande inesperado (oportunidade, se tiver estoque).
- Fiscalização do estoque (sem nota de entrada correta, multa).

Eventos positivos existem para não ser só punição. Cada evento vem com uma explicação de 2 linhas: o que é, por que aconteceu, como evitar.

---

## 7. Modo de jogo

Um único modo: o **Desafio da semana**. A seed é a semana ISO mais o segmento, então todo mundo que jogar aquele segmento naquela semana enfrenta o mesmo dólar, a mesma demanda e os mesmos eventos. Não há ranking (nem global nem local) nem sandbox: o placar é o print do resultado que a pessoa compartilha. Pode-se jogar quantas vezes quiser. Decisão de 23/10/2026: ranking global exigiria backend e LGPD e tiraria o foco do card compartilhado, que é o motor viral; a sandbox só fazia sentido como treino e confundia o propósito.

## 8. Mecânicas de viralização

- **Card de resultado** (imagem gerada no cliente, pronta para LinkedIn, Instagram e WhatsApp): patrimônio final, faturamento, "maior erro do mês", selos, posição no ranking, link. Exemplo de copy: "Faturei R$ 2,3 mi, sobrevivi a 2 canais vermelhos e quebrei no mês 11 por causa do dólar. Você faz melhor? #ImportTycoon".
- **Selos com humor de Comex**: "Sobrevivente do Canal Vermelho", "Rei do FCL", "Travou o câmbio na hora certa", "Pagou demurrage e aprendeu", "Just in time de verdade", "Radar Ilimitado".
- **Desafio entre amigos**: link com seed fixa, "jogue a mesma partida que eu".
- **Liga corporativa** (v2): empresas e turmas de curso de Comex competem por 4 semanas.
- **Compartilhar no WhatsApp**: a tela de dezembro gera um card quadrado de 1080 px (patrimônio, caixa, estoque, faturamento, lucro acumulado, margem bruta, a receber, dívida, importações e canais vermelhos, sistema e Radar, selos, segmento, avatar) e oferece: botão WhatsApp (compartilhamento nativo com a imagem onde o navegador permite; senão copia a imagem e abre o WhatsApp com o texto), salvar imagem (capacidade `downloads` do artefato, que no app iOS abre a folha de compartilhamento), copiar imagem e copiar texto. No celular, segurar a imagem também funciona.
- **Tela final educativa**: "Na sua partida, fechar o mês levou 3 dias e 2 erros de NF-e. Na vida real, com a Mainô, a NF-e de importação sai em 2 minutos." CTA único, verde da marca: "Quero importar de verdade".

---

## 9. Integração de marca (como a Mainô aparece)

| Onde | Como | Pilar |
|---|---|---|
| Sistema de gestão em 4 níveis | Generalista libera a nota; os três planos Mainô (Operação, Gestão, Comando) eliminam riscos em escada: fiscalização, NF-e, armazenagem, demurrage, inadimplência, decisão de compra | Simplicidade |
| Mentora **Mia** | Personagem que explica cada evento e tributo em 2 linhas, com tom especialista e direto | Especialização |
| Eventos regulatórios | Quem tem o sistema é avisado um turno antes da mudança de alíquota | Confiança |
| Glossário | Cada termo (DI, DUIMP, NCM, demurrage) abre um pop-up curto | Especialização |
| Card final e CTA | Única chamada comercial do jogo | Confiança |

Regras: nunca banner, nunca pop-up de venda no meio da partida, nunca travar progresso atrás de cadastro. Presença de marca fixa: logotipo oficial da Mainô (SVG do site, versão branca) discreto no canto superior esquerdo da barra, com link para www.maino.com.br, e rodapé "Desenvolvido por Mainô Tecnologia S.A." em todas as telas.

---

## 10. Direção visual e tom

- **Estilo:** pixel art desenhada em canvas, sem imagens externas (sprites de 12 a 36 px: produtos, fornecedores, Mia, fiscal, navio, avião, caminhão, contêineres, escritório, galpão). A base é uma cena animada: navios avançam no mar conforme o progresso de cada embarque marítimo, aviões cruzam o céu para embarques aéreos, caminhão sai quando houve venda no mês, pátio empilha um contêiner a cada 8 m³ em estoque. Respeita `prefers-reduced-motion`. Painéis de decisão em UI limpa com ícones pixelizados nos cards e modais.
- **Paleta:** verde Mainô `#00B386` para ações positivas e CTAs, azul `#1A2B4A` para fundos e autoridade, verde claro `#E8F8F3` para cards. Vermelho reservado para canal vermelho e prejuízo.
- **Tom dos textos:** direto, especialista, com humor de quem já passou por aquilo. Sem alarmismo.
- **Navegação pelo escritório, não por abas.** A planta do escritório tem quatro salas (Sala de compras, Expedição e vendas, Diretoria, Financeiro). Ao clicar numa sala ou no botão correspondente, o avatar do jogador caminha pelo corredor até lá e só então o painel da sala aparece. Com `prefers-reduced-motion` a troca é imediata.
- **Avatar escolhido antes de começar.** Cinco opções em pixel art geradas a partir de um template 12x20 (Ana, mulher negra de black power; Chen, homem chinês; Marina, mulher branca ruiva; Lucas, homem pardo de barba; Roberto, homem branco de uns 40 anos, de roupa social (paletó, camisa e gravata)). O avatar aparece no escritório, na barra superior e no card final.
- **Revisar e fechar o mês.** O botão de fechar abre uma tela com todas as decisões registradas no mês (pedidos, anuências, galpão, sistema, comprador, Radar, filial, crédito, FIDC), cada uma com "Desfazer", os ajustes em vigor (preço e canal por produto, marketing) com atalhos para as salas, e a previsão do fechamento. Desfazer restaura o estado do início do mês e reexecuta as demais decisões na ordem, com os mesmos resultados de negociação, atraso e golpe; uma decisão que deixa de ser possível (por exemplo, compra sem o crédito desfeito) cai junto e a tela avisa. Preço, canal e marketing são editáveis a qualquer momento e não precisam de desfazer.
- **Confirmação antes de ações irreversíveis:** fechar o mês (com vendas previstas, chegadas e custos fixos do fechamento), enviar pedido ao fornecedor (sinal agora e saldo + tributos na chegada), alugar galpão, contratar Mainô ou comprador, habilitar Radar, tomar ou pagar crédito e antecipar recebíveis.
- **Todo modal fecha.** Botão × e tecla Esc em todos os modais, exceto o de fim de jogo. Nos modais de NCM e de negociação, uma nota avisa que fechar não envia o pedido (o sinal só sai depois da resposta), então o jogador pode consultar o Mercado ou a cascata e voltar.
- **Tela limpa, explicação sob demanda.** Textos de apoio (modais, câmbio, seguro, inspeção, canais de venda, marketing e confiança, notas do Mercado, descrições dos planos, galpões, filial, comprador, crédito e FIDC) ficam atrás de um ícone de dica (ⓘ) que abre um balão ao clicar e fecha ao clicar de novo ou fora. Só avisos de risco e números ficam sempre visíveis.
- **Mobile first.** A maioria dos compartilhamentos vai chegar pelo celular. Tudo funciona em tela vertical.

---

## 11. Requisitos

### P0 — sem isso não lança
- [ ] Partida de 12 turnos jogável em até 15 minutos no celular e no desktop.
- [ ] 1 nicho completo (eletrônicos) com 6 produtos.
- [ ] Sistemas: demanda, fornecedor com negociação, modal, desembaraço com canais e tributos em cascata, câmbio spot/trava, 2 canais de venda, galpão vs just in time, 1 linha de crédito.
- [ ] Baralho com no mínimo 12 eventos, cada um com explicação.
- [ ] Desafio semanal com seed determinística (mesma seed = mesma partida, verificável).
- [ ] Card de resultado em imagem, botão de compartilhar com Web Share API e fallback de download.
- [ ] Ranking semanal por apelido.
- [ ] Upgrade "Mainô" e mentora Mia.
- [ ] Tutorial de 1 partida guiada.
- [ ] Salvar partida localmente (sem login).

### P1 — logo depois
- [ ] 3 nichos.
- [ ] Campanha de 5 capítulos.
- [ ] Opt-in de e-mail para salvar progresso entre dispositivos (LGPD: consentimento explícito, finalidade clara).
- [ ] Negociação com fornecedores em mais idiomas e mais nuances.
- [ ] Ex-tarifário, antidumping e LI com anuência.
- [ ] Selos e conquistas completos.

### P2 — insurance arquitetural
- [ ] Liga corporativa e modo turma (educação).
- [ ] Base isométrica rica com animações de contêiner chegando.
- [ ] Modo "DUIMP": versão do jogo com o novo processo de importação.
- [ ] Localização em espanhol (mercado LATAM da Mainô, se houver).

### Critérios de aceite (amostra)
- Dado que o jogador escolhe marítimo FCL no turno 1, quando o turno 2 fecha, então a carga ainda está em trânsito e o caixa já pagou o sinal e o frete.
- Dado que o jogador não travou o câmbio e há evento "alta do dólar", quando o pagamento vence, então o custo em reais sobe e a DRE mostra a diferença como "variação cambial".
- Dado que a NCM escolhida está errada e a carga cai em canal vermelho, quando o desembaraço termina, então há multa e a tela mostra qual NCM era a correta.
- Dado dois jogadores com a mesma seed e as mesmas decisões, quando a partida termina, então os resultados são idênticos.

---

## 12. Arquitetura técnica (proposta)

- **Front:** SPA em React + TypeScript. Renderização da base com PixiJS (ou Phaser, se o time preferir engine de jogo completa). UI de painéis em HTML/CSS normal, não dentro do canvas, para acessibilidade e velocidade de iteração.
- **Simulação:** módulo puro e determinístico (`engine/`), sem dependência de UI, com RNG seedável. Isso permite testes automatizados de balanceamento (rodar 10 mil partidas com bots) e garante o desafio semanal justo.
- **Dados de balanceamento** em JSON versionado (alíquotas, custos, curvas). O time fiscal da Mainô revisa esses arquivos, não o código.
- **Persistência:** localStorage/IndexedDB no MVP. Ranking e opt-in via backend leve (Supabase ou similar) com apelido + hash de partida + score.
- **Antifraude do ranking:** o servidor re-executa a partida a partir da seed e do log de decisões e confere o score. Como a simulação é determinística, isso é barato.
- **Distribuição:** PWA, hospedagem estática com CDN, bundle inicial abaixo de 3 MB, carregamento em menos de 3 segundos em 4G.
- **Analytics:** eventos de funil (início, turno 6, conclusão, share, CTA). Sem dado pessoal sem consentimento.

---

## 13. Fases e esforço

| Fase | Escopo | Esforço estimado |
|---|---|---|
| Protótipo em papel / planilha | balancear a economia de 12 turnos com o time fiscal | 2 semanas |
| MVP (P0) | desafio semanal, 1 nicho, card, ranking | 8 a 10 semanas, 2 devs + 1 artista + 1 pessoa de Comex meio período |
| Lançamento | campanha de LinkedIn com influenciadores de Comex, desafio semanal nº 1 | 2 semanas |
| v1.1 (P1) | 3 nichos, campanha, opt-in | 6 semanas |
| v2 (P2) | liga, isométrico rico, modo DUIMP | a definir conforme tração |

Primeiro teste de viralização recomendado: lançar o desafio semanal para a base de 1.500 clientes e para os seguidores da Mainô, e medir share rate antes de investir em mídia.

---

## 14. Riscos do projeto

- **Balanceamento errado** torna o jogo chato ou impossível. Mitigação: simulação determinística com bots antes do lançamento.
- **Erro em tributo real** vira constrangimento para uma marca especialista. Mitigação: revisão do time fiscal e aviso "valores simplificados para o jogo" no glossário.
- **Jogo bom, marca invisível** ou **marca demais, jogo chato**. Mitigação: integração via mecânica (upgrade Mainô), não via banner; testar com 20 jogadores antes do lançamento.
- **Custo de arte isométrica.** Mitigação: MVP com arte flat simples e base com 4 estágios visuais só.
- **LGPD no ranking.** Mitigação: apelido livre, sem e-mail obrigatório, consentimento explícito para opt-in.

---

## 15. Perguntas em aberto

1. Nome final: "O Importador" ou variação com marca ("O Importador, por Mainô")? **Marketing.**
2. O ERP do jogo usa o nome Mainô ou "sistema especializado" com logo discreto? **Marketing + CEO.**
3. "FDIC" na ideia original é FIDC, FINIMP ou outra linha? **Financeiro.**
4. Quem balanceia as alíquotas e custos: time fiscal interno ou consultor? **Fiscal/Comex.**
5. Engine: PixiJS (leve, mais controle) ou Phaser (mais pronto)? **Engenharia.**
6. Lançar primeiro como desafio semanal fechado para clientes ou aberto? **Marketing.**
7. Vale incluir o modo DUIMP já na v1 para reforçar o pioneirismo? **Produto.**

---

## 16. Balanceamento (protótipo, simulação com bots)

Harness em Node carrega o motor do jogo sem interface e roda 300 seeds por perfil. Patrimônio final (início R$ 150 mil; estoque a 75% do custo, adiantamentos a fornecedor e recebíveis incluídos):

| Perfil | Quebra | Termina com lucro | p10 | mediana | p90 |
|---|---|---|---|---|---|
| Mestre (pipeline contínuo, trava, seguro, Mainô, negociação boa) | 0% | 100% | 225k | 312k | 397k |
| Agressivo | 0% | 96% | 183k | 250k | 310k |
| Prudente (cobre 2 meses de demanda, reserva de caixa) | 0% | 97% | 172k | 229k | 273k |
| Ingênuo (Shenzhen, sem trava/seguro/Mainô, reposição aérea, reserva 3x sinal) | 0% | 100% | 195k | 241k | 300k |
| Passivo (um pedido, nunca repõe) | 0% | 57% | 127k | 152k | 161k |
| Afobado (aéreo sempre que sobra caixa pro sinal, sem reserva) | 100% | 0% | 36k | 54k | 68k |
| Imprudente (tudo no mês 1, preço abaixo do custo, sem crédito) | 100% | 0% | 18k | 34k | 41k |

Instrumentos de prudência medidos isoladamente sobre o perfil ingênuo (mediana): trava de câmbio neutra; seguro +4k; Mainô +5k; fornecedor confiável neutro; negociação boa +13k; todos juntos +26k e p10 +21k.

Ajustes feitos a partir da simulação: demanda base +33%, custo fixo R$ 5 mil/mês, inadimplência B2B parcial (15% de chance de perder 25% da carteira do mês) em vez de total, lote com 12% de defeito quando o fornecedor pouco confiável falha, erro de NF-e proporcional à carga (3%, 35% de chance por mês com chegada) e Mainô a R$ 990/mês economizando R$ 800/mês de retrabalho e R$ 500 por processo. A aba Comprar alerta quando o caixa projetado na chegada não cobre saldo e tributos.

Lição de design confirmada: o que separa quem lucra de quem quebra é reservar caixa para a chegada (saldo + tributos ≈ 1,8x o FOB em reais) e manter pipeline contínuo, não o instrumento isolado.

---

## 17. Conceitos de Comex verificados (revisão de 23/10/2026)

Revisão feita antes de abrir o protótipo para especialistas. Fontes são blogs e buscadores do setor, não o texto oficial; a área fiscal deve confirmar na TEC, TIPI e Siscomex antes de uso externo.

| Conceito | Como estava | Como ficou | Base |
|---|---|---|---|
| Radar Siscomex | "Expresso/Limitado/Ilimitado", limite contado em FOB | Modalidades **Expressa / Limitada / Ilimitada** (IN RFB 1.984/2020); Expressa até US$ 50 mil e Limitada até US$ 150 mil por semestre, contados em **valor CIF** | guelcos.com.br, toexceed.com.br, taxup.com.br |
| Taxa Siscomex | R$ 250 fixo | R$ 115,67 por DUIMP + R$ 38,56 por adição (IN RFB 2.024/2021), isenta em remessa expressa | fazcomex.com.br, aasp.org.br |
| AFRMM | 8% do frete marítimo | Mantido: 8% no longo curso (Lei 14.301/2022) | planalto.gov.br |
| Declaração | "DI" em todos os textos | **DUIMP** (obrigatória no grosso do marítimo e aéreo desde abril/2026, Portaria Coana 165/2024); XML da DI citado só como legado | taxup.com.br, econeteditora |
| Multa por NCM errada | 1% do valor aduaneiro, mínimo R$ 500 | Multa de 1% **revogada pela LC 227/2026**; o jogo aplica reclassificação de ofício + multa por declaração inexata (valor simplificado de R$ 5 mil) | contabeis.com.br, reformatributaria.com |
| Capatazia | Fora do valor aduaneiro | **Integra o valor aduaneiro** (STJ, Tema 1014) e entra na base do II | jurisprudência STJ |
| Alíquotas II/IPI | 16% e 10% fixos para tudo | Por NCM: fone 8518.30.00 (18% / 9,75%), carregador 8504.40.21 (16,2% / 3,75%), smartwatch 8517.62.77 (16% / 15%), caixa 8518.22.00 (18% / 15%) | buscadorncm.com.br, ncm.fazcomex.com.br, Decreto 11.182/2022 |
| NCM do carregador | 8504.40.10 (carregador de acumuladores) | **8504.40.21** (retificador de cristal): a Receita trata o carregador de tomada como retificador (SC Cosit 279/2017); 8504.40.10 virou opção-armadilha | actana.com.br, tributodevido.com.br |
| NCM do smartwatch | 8517.62.77 sem critério | 8517.62.77 para taxa > 34 Mbit/s (Wi-Fi), SC Cosit 98.008/2020; 8517.62.72 para até 34 Mbit/s; 9102.12.20 é a orientação antiga da Secex | okai.com.br, tributodevido.com.br |
| NCM do fone | 8518.30.00 | Mantido, com a SC Cosit 98.245/2024 citada (Bluetooth não muda a função essencial) | tributodevido.com.br |
| Pet: ração 2309.10.00 | novo | II 12,6%, IPI 6,5%; anuência MAPA assumida (alimento para animais), não confirmada em fonte oficial | ncm.fazcomex.com.br, buscadorncm.com.br |
| Pet: coleira 4201.00.10 | novo | Não existe 4201.00.00; couro é .10 (II 18%, IPI 0), outras matérias .90 | buscadorncm.com.br |
| Pet: cama 6307.90.90 | novo | II 35%, IPI 0 (fonte única) | ncm.fazcomex.com.br |
| Pet: comedouro 3924.90.00 | novo | II 16,2%, IPI 6,5% | buscadorncm.com.br |
| Beleza: 3304.99.10 / .90 | novo | II 16,2%; IPI 14,3% para cremes, 0% para protetor solar (fontes divergem no IPI do .90) | treayo.com, tabelasfiscais.com.br |
| Beleza: whey 2106.10.00 e complementos 2106.90.30 | novo | II 12,6% e 14,4%, IPI 0; whey hidrolisado cai em 2106.90.30 (SC Cosit 98.155/2023) | tributodevido.com.br, buscadorncm.com.br |
| Anatel / Inmetro | novo | Homologação Anatel obrigatória para Bluetooth/Wi-Fi (LGT); Inmetro para carregadores assumido, não confirmado em fonte oficial | tecnoblog.net, olhardigital.com.br |
| ICMS | "18% por dentro" | "18% (SP, por dentro)", base com II, IPI, PIS/COFINS, AFRMM e taxa Siscomex | LC 87/96 art. 13 |

Fora do escopo desta versão e declarado na tela inicial: LI e anuências (Anatel, Inmetro), ex-tarifário, catálogo de produtos da DUIMP, Reforma Tributária (CBS/IBS).

Pontos que seguem simplificados e que um especialista pode questionar: armazenagem, capatazia e despachante são valores médios fixos; o seguro cobre avaria mas não defeito de lote; o Radar Ilimitada depende da capacidade financeira estimada pela Receita, não de "3 importações"; o II não usa ex-tarifário nem Letec.

---

*Documento produzido com apoio de IA e sujeito a revisão humana. Valores de tributos, prazos e custos citados são simplificações para fins de jogo e devem ser validados pela área fiscal antes de qualquer uso externo.*


### Adendo 26/10/2026 — sem sala de Mercado

A sala "Inteligência de mercado" foi removida. Preço de venda, demanda estimada (3 meses), estoque + trânsito e sazonalidade aparecem na sala de compras para o produto selecionado; o gráfico do dólar foi para o Financeiro; a tabela de tributos por NCM fica atrás de uma seta na compra; o painel "O que aconteceu no mês" abriu a sala de vendas. A margem por produto (custo nacionalizado × preço de venda) só aparece com Mainô Plano Gestão ou superior, na compra e na previsão de vendas; sem ele, o jogador vê um cadeado e a sugestão de contratar na Diretoria.
