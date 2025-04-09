# Requirements Document - GeoControl

Date:

Version: V1 - description of Geocontrol as described in the swagger

| Version number | Change |
| :------------: | :----: |
|                |        |

# Contents

- [Requirements Document - GeoControl](#requirements-document---geocontrol)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Business model](#business-model)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, UC1](#use-case-1-uc1)
      - [Scenario 1.1](#scenario-11)
      - [Scenario 1.2](#scenario-12)
      - [Scenario 1.x](#scenario-1x)
    - [Use case 2, UC2](#use-case-2-uc2)
    - [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

GeoControl is a software system designed for monitoring physical and environmental variables in various contexts: from hydrogeological analyses of mountain areas to the surveillance of historical buildings, and even the control of internal parameters (such as temperature or lighting) in residential or working environments.

# Business Model

# Stakeholders

| Stakeholder name | Description |
| :--------------: | :---------: |
| Stakeholder x..  |             |

# Context Diagram and interfaces

## Context Diagram

\<Define here Context diagram using UML use case diagram>

\<actors are a subset of stakeholders>

## Interfaces

\<describe here each interface in the context diagram>


|   Actor   | Logical Interface | Physical Interface |
| :-------: | :---------------: | :----------------: |
| Actor x.. |                   |                    |

# Stories and personas

\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>

# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

### **Requisiti Funzionali**

| ID | Descrizione  |
| :---: | :---------- |
| **FR1**  | **Autenticazione** |
| **FR2**  | **Gestione utenti** |
| FR2.1 | Visualizza utenti (uno o tutti) |
| FR2.2 | Crea un nuovo utente |
| FR2.3 | Cancella un utente |
| **FR3**  | **Gestione reti** |
| FR3.1 | Visualizza reti (una o tutte) |
| FR3.2 | Crea una nuova rete |
| FR3.3 | Aggiorna una rete |
| FR3.4 | Cancella una rete |
| **FR4**  | **Gestione gateway nelle reti** |
| FR4.1 | Visualizza i gateway di una rete (uno o tutti) |
| FR4.2 | Crea un nuovo gateway per una rete |
| FR4.3 | Aggiorna un gateway |
| FR4.4 | Cancella un gateway |
| **FR5**  | **Gestione sensori nelle reti** |
| FR5.1 | Visualizza i sensori di un gateway (uno o tutti) |
| FR5.2 | Crea un nuovo sensore per un gateway |
| FR5.3 | Aggiorna un sensore |
| FR5.4 | Cancella un sensore |
| **FR6**  | **Gestire le misurazioni e le statistiche dei sensori** |
| FR6.1 | Recupera le misurazioni per un insieme di sensori di una rete specifica |
| FR6.2 | Recupera solo le statistiche per un insieme di sensori di una rete specifica |
| FR6.3 | Recupera solo le misurazioni anomale per un insieme di sensori di una rete specifica |
| FR6.4 | Memorizza le misurazioni di un sensore |
| FR6.5 | Recupera le misurazioni per un sensore specifico |
| FR6.6 | Recupera le statistiche per un sensore specifico |
| FR6.7 | Recupera solo le misurazioni anomale per un sensore specifico |
| **FR7**  | **Calcoli** |
| FR7.1 | Media |
| FR7.2 | Varianza |
| FR7.3 | Deviazione standard |
| FR7.4 | Calcolare le Thresholds come: \( \text{sogliaMax} = \mu + 2\sigma \), \( \text{sogliaMin} = \mu - 2\sigma \) |
| FR7.5 | Identificare Outliers considerando i valori oltre le soglie come anomali |
| FR7.6 | Conversione fusi orari |

## Requisiti non funzionali

<Describe constraints on functional requirements>

|   ID    | Type | Descrizione | Refers to |
| :-----: | :--------------------------------: | :--------- | :-------: |
|  **NFR1**  | Affidabilità | Non deve perdere più di 6 misurazioni all'anno per sensore | FR6 |
|  **NFR2**  | Sicurezza | Accesso consentito solo ad utenti autorizzati | FR1 |
|  NFR2.1 | Sicurezza | Utente Admin può accedere a: FR1, FR2, FR3, FR4, FR5, FR6 |  |
|  NFR2.2 | Sicurezza | Utente Operator può accedere a FR1, FR3, FR4, FR5, FR6 |  |
|  NFR2.3 | Sicurezza | Utente Viewer può accedere a: FR1, FR3.1, FR4.1, FR5.1, FR6.1, FR6.2, FR6.3, FR 6.5, FR6.6, FR6.7  |  |
|  **NFR3**  | Funzionalità | Le reti devono essere identificate con un codice alfanumerico univoco | FR3 |
|  NFR3.1 | Funzionalità | I gateway sono identificati da un indirizzo MAC | FR4 |
|  NFR3.2 | Funzionalità | I sensori sono identificati da un indirizzo MAC | FR5 |
|  **NFR4**  | Funzionalità | Il sistema deve essere in grado di eseguire calcoli sulle misurazioni raccolte | FR7 |
|  NFR4.1 | Funzionalità | Il sistema converte e memorizza il timestamp nel formato ISO 8601 utilizzando il fuso orario UTC | FR7 |
|  **NFR5** | Dominio | Il software deve avere una struttura modulare |  |



# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

\<next describe here each use case in the UCD>

### Use case 1, UC1

| Actors Involved  |                                                                      |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition  |  \<Boolean expression, must evaluate to true after UC is finished>   |
| Nominal Scenario |         \<Textual description of actions executed by the UC>         |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    |                        \<exceptions, errors >                        |

##### Scenario 1.1

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

|  Scenario 1.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | \<Boolean expression, must evaluate to true before the scenario can start> |
| Post condition |  \<Boolean expression, must evaluate to true after scenario is finished>   |
|     Step#      |                                Description                                 |
|       1        |                                                                            |
|       2        |                                                                            |
|      ...       |                                                                            |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2

..

### Use case x, UCx

..

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

\<describe here deployment diagram >
