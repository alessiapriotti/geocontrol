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

**Requisiti Funzionali/Non Funzionali**

**Requisiti Funzionali**

**Requisiti Funzionali/Non Funzionali**

### **Requisiti Funzionali**

|  ID   | Descrizione  |
| :---: | :---------- |
|  **FR1**  | **Authentication** |
|  FR1.1 | Log in |
|  FR1.2 | Return bearer token |
|  FR1.3 | Log out |
|  **FR2**  | **Manage user** |
|  FR2.1 | Visualizza tutti gli utenti |
|  FR2.2 | Crea un nuovo utente (Admin) |
|  FR2.3 | Modifica un utente (Admin) |
|  FR2.4 | Cancella un utente (Admin) |
|  FR2.5 | Gestione ruoli |
|  **FR3**  | **Manage network** |
|  FR3.1 | Visualizza tutte le reti |
|  FR3.2 | Crea una nuova rete (Admin/Operator) |
|  FR3.3 | Aggiorna una rete (Admin/Operator) |
|  FR3.4 | Cancella una rete (Admin/Operator) |
|  **FR4**  | **Manage gateway within network** |
|  FR4.1 | Visualizza tutti i gateway di una rete |
|  FR4.2 | Crea un nuovo gateway per una rete (Admin/Operator) |
|  FR4.3 | Aggiorna un gateway (Admin/Operator) |
|  FR4.4 | Cancella un gateway (Admin/Operator) |
|  **FR5**  | **Manage sensors within gateway** |
|  FR5.1 | Visualizza tutti i sensori di un gateway |
|  FR5.2 | Crea un nuovo sensore per un gateway (Admin/Operator) |
|  FR5.3 | Aggiorna un sensore (Admin/Operator) |
|  FR5.4 | Cancella un sensore (Admin/Operator) |
|  FR5.5 | Invio misurazioni ad intervalli regolari |
|  **FR6**  | **Manage sensor measurements and statistics** |
|  FR6.1 | Recupera le misurazioni per un insieme di sensori di una rete specifica |
|  FR6.2 | Recupera solo le statistiche per un insieme di sensori di una rete specifica |
|  FR6.3 | Recupera solo le misurazioni anomale per un insieme di sensori di una rete specifica |
|  FR6.4 | Memorizza le misurazioni di un sensore |
|  FR6.5 | Recupera le misurazioni per un sensore specifico |
|  FR6.6 | Recupera le statistiche per un sensore specifico |
|  FR6.7 | Recupera solo le misurazioni anomale per un sensore specifico |
|  FR6.8 | Conversione fusi orari |
|  **FR7**  | **Calcoli** |
|  FR7.1 | Media |
|  FR7.2 | Varianza |
|  FR7.3 | Deviazione standard |
|  FR7.4 | Thresholds |
|  FR7.5 | Outliers |

## Non Functional Requirements

<Describe constraints on functional requirements>

|   ID    | Type (efficiency, reliability, ..) | Descrizione | Refers to |
| :-----: | :--------------------------------: | :---------: | :-------: |
|  **NFR1**  | Reliability | Non deve perdere più di 6 misurazioni all'anno per sensore | Sensori |
|  NFR1.1 | Implementation | I sensori effettuano una misurazione ogni 10 minuti | Sensori |
|  **NFR2**  | Security | Accesso consentito solo ad utenti autorizzati | Sistema |
|  NFR2.1 | Security | Comunicazione crittografata tra sensori, gateway e server | Comunicazione |
|  **NFR3**  | Comunicazione | I sensori comunicano con il gateway attraverso una porta seriale | Sensori |
|  NFR3.1 | Comunicazione | I gateway comunicano con il server attraverso la rete internet | Gateway |
|  **NFR4**  | Identificazione | Le reti devono essere identificate con un codice alfanumerico univoco | Reti |
|  NFR4.1 | Identificazione | I gateway devono essere identificati da un indirizzo MAC e devono avere una scheda di rete (NIC) | Gateway |
|  NFR4.2 | Identificazione | I sensori sono identificati da un indirizzo MAC, ma non dispongono di una propria scheda di rete (NIC) | Sensori |

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
