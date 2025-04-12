# Project Estimation

Date:

Version:

# Estimation approach

Consider the GeoControl project as described in the swagger, assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch

# Estimate by size

###

|                                                                                                         | Estimate |
| ------------------------------------------------------------------------------------------------------- | :--------: |
| NC = Estimated number of classes to be developed                                                        |     6     |
| A = Estimated average size per class, in LOC                                                            |   300       |
| S = Estimated size of project, in LOC (= NC \* A)                                                       |       1800   |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)                    |       180   |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro)                                     |    5400      |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) |        1   |

# Estimate by product decomposition

###

| component name       | Estimated effort (person hours) |
| -------------------- | :-------------------------------: |
| requirement document |   50                            |
| design document      |            60                     |
| code                 |   90                              |
| unit tests           |             30                    |
| api tests            |      20                           |
| management documents |     10                           |

# Estimate by activity decomposition

###

| Activity name | Estimated effort (person hours) |
| ------------- | :-------------------------------:|
|**WP1   Produzione documentazione**    |                                 |
|T1.1 analisi del sistema basandosi sulle specifiche fornite|12|
|T1.2 Identificazione dei requisiti funzionali e non funzionali|12|
|T1.3 Identificazione use cases|12|
|T1.4 Definizione del glossario|12|
|T1.5 Approvazione dei requisiti identificati da parte degli stakeholder (*milestone*)|2|
|T1.6 Stima tempi e costi|8|
|**WP2 Implementazione design**    |                                 |
|T2.1 progettazione classi e metodi |16|
|T2.2 progettazione interfaccia grafica|30|
|**WP3 Implementazione codice**  |                                 |
|T3.1 Sviluppo dei metodi|40|
|T3.2 Implementazione delle API|40|
|T3.3 Sviluppo codice di integrazione con database|16|
|**WP4 Testing**   |                                 |
|T4.1 Identificazione dei test da effettuare (basandosi su use cases)|12|
|T4.2 Implementazione dei test|20|
|T4.3 Verifica superamento tutti i test (*milestone*)|10|

###

Insert here Gantt chart with above activities

# Summary

Report here the results of the three estimation approaches. The estimates may differ. Discuss here the possible reasons for the difference

|                                    | Estimated effort | Estimated duration |
| ---------------------------------- | ---------------- | ------------------ |
| estimate by size                   |                  |
| estimate by product decomposition  |                  |
| estimate by activity decomposition |                  |
