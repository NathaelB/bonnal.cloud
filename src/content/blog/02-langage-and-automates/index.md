---
title: "Automates & Langages"
summary: "En cours de rédaction"
date: "Nov 7 2024"
draft: false
tags:
- Algo
---

# Introduction

Lorem ipsum

# Grammaire Simplifiée
Voici une grammaire simplifiée en notation `EBNF` pour le sous-ensemble de YAML que nous allons considérer:

```
document       ::= element+
element        ::= sequence | mapping | scalar
sequence       ::= "-" [space] scalar
mapping        ::= scalar ":" [space] scalar
scalar         ::= [a-zA-Z0-9]+
space          ::= " "
```

Cette grammaire permet de représenter des documents YAML contenant des scalaires simples, des séquences et des mappages sans imbrication.

# Construction de l'Automate à Pile
Un automate à pile (AP) est défini par les éléments suivants:
- $$Q$$: ensemble fini d'états
- $$\Sigma$$: alphabet d'entrée (symboles du langage)
- $$\Gamma$$: alphabet de pile (symboles utilisés dans la pile)
- $$\delta$$: fonction de transition $$(Q \times (\Sigma \cup \{\epsilon\}) \times \Gamma \rightarrow Q \times \Gamma^*)$$
- $$q_0$$: état initial
- $$Z_0$$: symbole initial de pile
- $$F$$: ensemble d'états acceptants

## États (Q)
Nous définirons les états suivants:
- $$q_0$$: État initial
- $$q_{\text{scalar}}$$: Lecture d'un scalaire
- $$q_{\text{sequence}}$$: Lecture d'une séquence
- $$q_{\text{mapping}}$$: Lecture d'un mapping
- $$q_{\text{accept}}$$ : État acceptant

## Alphabet d'Entrée ($$\Sigma$$)
Les symboles d'entrée seront:
- `-`: indique le début d'un élément de séquence
- `:`: Séparateur clé-valeur dans un mapping
- `[a-zA-Z0-9]`: Caractères alphanumériques pour les scalaires
- ` `: Espace

## Alphabet de Pile ($$\Gamma$$)
Les symboles de pile seront:
- $$Z_0$$: Symbole initial de pile
- $$S$$: Indique que nous sommes en train de lire une séquence
- $$M$$: Indique que nous sommes en train de lire un mapping

## État Initial et État Acceptant
- État initial ($$q_0$$): $$q_0$$
- Symbole initial de pile ($$Z_0$$): $$Z_0$$
- États acceptants ($$F$$): $$\{ q_{\text{accept}}\}$$

## Fonction de Transition ($$\delta$$)
Nous allons définir les transitions de l'automate en fonction de l'état actuel, du symbole d'entrée, et du sommet de la pile.

### Transitions
1. Début du document
    - $$(q_0, \epsilon, Z_0) \rightarrow (q_0, Z_0)$$

2. Lecture d'un scalaire
    - $$(q_0, \text{caractère}, X) \rightarrow (q_{\text{scalar}}, X)$$
    - $$(q_{\text{scalar}}, \text{caractère}, X) \rightarrow (q_{\text{scalar}}, X)$$
    - $$(q_{\text{scalar}}, \epsilon, X) \rightarrow (q_{\text{accept}}, X)$$

3. Lecture d'une séquence
    - $$(q_0, -, X) \rightarrow (q_{\text{sequence}}, SX)$$
    - $$(q_{\text{sequence}}, \text{' '}, S) \rightarrow (q_{\text{sequence}}, S)$$
    - $$(q_{\text{sequence}}, \text{caractère}, S) \rightarrow (q_{\text{scalar}}, S)$$
    - $$(q_{\text{scalar}}, \text{caractère}, S) \rightarrow (q_{\text{scalar}}, S)$$
    - $$(q_{\text{scalar}}, \epsilon, S) \rightarrow (q_{\text{sequence}}, S)$$
    - $$(q_{\text{sequence}}, -, S) \rightarrow (q_{\text{sequence}}, S)$$
    - $$(q_{\text{sequence}}, \epsilon, S) \rightarrow (q_{\text{accept}}, X)$$

4. Lecture d'un mapping
    - $$(q_0, \text{caractère}, X) \rightarrow (q_{\text{mapping}}, MX)$$
    - $$(q_{\text{mapping}}, \text{caractère}, M) \rightarrow (q_{\text{mapping}}, M)$$
    - $$(q_{\text{mapping}}, \text{':'}, M) \rightarrow (q_{\text{mapping}}, M)$$
    - $$(q_{\text{mapping}}, \text{' '}, M) \rightarrow (q_{\text{mapping}}, M)$$
    - $$(q_{\text{mapping}}, \text{caractère}, M) \rightarrow (q_{\text{scalar}}, M)$$
    - $$(q_{\text{scalar}}, \text{caractère}, M) \rightarrow (q_{\text{scalar}}, M)$$
    - $$(q_{\text{scalar}}, \epsilon, M) \rightarrow (q_{\text{accept}}, X)$$


## Explications
- $$(q_0, -, X) \rightarrow (q_{\text{sequence}}, SX)$$: Lorsqu'on lit un `-`, on passe à l'état de séquence et on empile `S` pour indiquer que nous sommes dans une séquence.
- $$(q_{\text{sequence}}, \text{''}, S) \rightarrow (q_{\text{sequence}}, S)$$: On ingore les espaces après `-`.
- $$(q_{\text{sequence}}, \text{caractères}, S) \rightarrow (q_{\text{scalar}}, S)$$: Après le `-`, on attend un scalaire.
- $$(q_{\text{scalaire}}, \epsilon, S) \rightarrow (q_{\text{sequence}}, S)$$: Après avoir lu un scalaire dans une séquence, on peut revenir à l'état de séquence pour éventuellement lire un autre élément.
- $$(q_{\text{sequence}}, -, S) \rightarrow (q_{\text{sequence}}, S)$$: On peut lire un autre `-` pour un nouvel élément de séquence.
- $$(q_{\text{sequence}}, \epsilon, S) \rightarrow (q_{\text{accept}}, X)$$: Si on a fini de lire la séquence on dépile `S` et on passe à l'état acceptant.

Pour le mapping, c'est similaire mais avec le symbole `M` pour indiquer qu'on est dans un mapping.

# Exemple de Fonctionnement
Prenons le document YAML simplifié suivant:

```yaml
- apple
- banana
```

## Étapes de traitement

1. État initial: ($$q_0$$, Entrée = "- apple - banana", Pile = $$[Z_0]$$)
2. Lecture du `-`
    - Transition: $$(q_0, -, Z_0) \rightarrow (q_{\text{sequence}}, SZ_0)$$
    - Pile: $$[S, Z_0]$$
    - Entrée restante: ` apple - banana`
3. Lecture de l'espace
    - Transition: $$(q_{\text{sequence}}, \text{''}, S) \rightarrow (q_{\text{sequence}}, S)$$
    - Pile: $$[S, Z_0]$$
    - Entrée restante: `apple - banana`
4. Lecture du scalaire `apple`
    - Transition : $$(q_{\text{sequence}}, \text{a}, S) \rightarrow  (q_{\text{scalar}}, S)$$
    - Continue de lire les caractères 'p', 'p', 'l', 'e' en restant dans $$q_{\text{scalar}}$$.
    - Pile : $$[S, Z_0]$$
    - Entrée restante : ` - banana`