# Project Estimation part 2



Goal of this document is to compare actual effort and size of the project, vs the estimates made in task1.

## Computation of size

To compute the lines of code use cloc    
To install cloc:  
           `npm install -g cloc`   
On Windows, also a perl interpreter needs to be installed. You find it here https://strawberryperl.com/  
To run cloc  
           `cloc <directory containing ts files> --include-lang=TypeScript`  
As a result of cloc collect the *code* value (rightmost column of the result table)  
        

Compute two separate values of size  
-LOC of production code     `cloc <Geocontrol\src> --include-lang=TypeScript`  
-LOC of test code      `cloc <GeoControl\test> --include-lang=TypeScript`  


## Computation of effort 
From timesheet.md sum all effort spent, in **ALL** activities (task1, task2, task3) at the end of the project on June 7. Exclude task4

## Computation of productivity

productivity = ((LOC of production code)+ (LOC of test code)) / effort


## Comparison

|                                        | Estimated (end of task 1) | Actual (june 7, end of task 3)|
| -------------------------------------------------------------------------------- | -------- |----|
| production code size | 1800 loc  |1912 loc|
| test code size | unknown |5795 loc|
| total size  |unknown|7707 loc|
| effort |244 ph|190 ph|
| productivity  | 10 loc / hour |40,6 loc / hour|


Report, as estimate of effort, the value obtained via activity decomposition technique.

Actual test code size = 10221 loc - 4426 loc = 5795 loc

Nel calcolo delle LOC di test abbiamo sottratto le LOC degli acceptance tests per ottenere solo quelle scritte da noi.

Non abbiamo una stima per il test code size e di conseguenza della estimated total code size perchè in Estimation part1 abbiamo stimato le righe di codice considerando soltanto le classi del glossario, ottenendo di conseguenza solo le righe di codice.

Tuttavia nell' effort ottenuto via activity decomposition consideriamo anche il tempo dedicato ai tests. 




