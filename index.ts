import { of, Observable, interval, fromEvent } from 'rxjs'; 
import { tap, take, map, filter, delay, mapTo, reduce, scan } from 'rxjs/operators';


/** RXJS Operators */
// Operators are pure functions that takes a source observable as an input, and returns another observable (the input observable is immutable.) You can use `pipe` to link these operators together.

// const customOperator = (sourceObservable) => {
// const resultObservable = ...do some thing with sourceObservable
// return resultObservable;
// }

// Pre-defined RXJS Operators that transform data

// #1 map (works similar to Array.map, pass in a callback function to transform value of the source obserbale)
const mapObs$ = interval(1000).pipe( // returns 0, 1, 2, 3... on 1000 ms
  take(4), // take the first 4 values (0, 1, 2, 3)
  map(x => x + 1) // returns 1, 2, 3, 4
);

// Marble diagram for `map`
// source: -----0-----1-----2-----(3|)
//            map(x => x + 1)
// output: -----1-----2-----3-----(4|)

// ##############################################

// #2 mapTo is like a shortcut of map, which transform each input into a new static value
// fromEvent(document, 'click').pipe(
//   mapTo('hello world!')
// ).subscribe(data => console.log(data));

// Marble diagram for `mapTo`: map each click to a number 2
// source: -----e-----e-----e-----e--...
//                mapTo(2)
// output: -----2-----2-----2-----2--...

// Practical example: `save` indicator: https://www.learnrxjs.io/recipes/save-indicator.html


// ##############################################

// #3 filter (works similar to Array.filter, pass in a callback function to filter values of the source obserbale)
const filterObs$ = interval(1000).pipe( // return 0, 1, 2, 3... on 1000 ms
  take(4), // take the first 4 values (0, 1, 2, 3)
  filter(x => x > 1) // wait for 2 seconds and returns 2, 3 on each second
);

// Marble diagram for `filter`
// source: -----0-----1-----2-----(3|)
//            filter(x => 1)
// output: -----------------2-----(3|)


// ##############################################

// #4 reduce (works similar to Array.reduce, which shows only the final value emitted)
const reduceObs$ = interval(1000).pipe( // return 0, 1, 2, 3... on 1000 ms
  take(4), // take the first 4 values (0, 1, 2, 3)
  reduce((accu, curr) => accu + curr, 0) // return 6 after 4 seconds
)

// Marble diagram for `reduce`
// source: -----0-----1-----2-----(3|)
// reduce((accu, curr) => accu + curr, 0)
// output: -----------------------(6|)


// ##############################################

// #5 scan (Similar to reduce, it's mainly used to accumulate data, but the difference is that scan shows all the emitted value) - this operator can be used to build a progress bar
const scanObs$ = interval(1000).pipe( // return 0, 1, 2, 3... on 1000 ms
  take(4), // take the first 4 values (0, 1, 2, 3)
  scan((accu, curr) => accu + curr, 0) // return 0, 1, 3, 6 
)

// Marble diagram for `reduce`
// source: -----0-----1-----2-----(3|)
// reduce((accu, curr) => accu + curr, 0)
// output: -----------------------(6|)

// ##############################################

// Practice: build a progress bar using scan operator :)


// RXJS offers pre-defined operators, but you can write a custom operators knowing it's basically a pure function.
// Example: write a custom operator https://angularfirebase.com/lessons/custom-rxjs-operators-by-example/

// This adder custom operator is similar to a curried function/closure, which is a function that takes
// a number as an argument, and returns a function that add the argument to the value of the source observable.
const adder = (number) => {
  return (sourceObservable) => {
  // The `adder` operator will return a new observable, which basically listen to the changes
  // of the source observable, and return `number + value of the current source observable`
  const newObservable = Observable.create(observer => {
    sourceObservable.subscribe(source => {
      observer.next(source + number);
    });
    // Adding `observer.complete()` here indicates that you only want to transform the first emitted value and stop there
    // But why the observable is not emitting any value at all if the source observable is `interval(1000)`?
    observer.complete();
    });
    return newObservable;
  }
}
// Demo of the custom `adder` operator
// of(10).pipe(adder(2)).subscribe(data => console.log('result of the adder operator ' data));
// interval(1000).pipe(adder(2)).subscribe(data => console.log('result of the adder operator ', data));

// You can also write a custom operator by transforming an existing operator.
const logger = () => tap(x => console.log('This is a custom logger...', x));
// Demo of the custom `logger` operator
// of('I am the raw data').pipe(logger()).subscribe()



// ##############################################
// Update DOM - ignore these...
const onMapOperator = () => mapObs$.subscribe(data => console.log('Using map operator', data));
const onFilterOperator = () => filterObs$.subscribe(data => console.log('Using filter operator', data));
const onReduceOperator = () => reduceObs$.subscribe(data => console.log('Using reduce operator', data));
const onScanOperator = () => scanObs$.subscribe(data => console.log('Using scan operator', data));


document.querySelector('#mapOperator').addEventListener('click', () => onMapOperator());
document.querySelector('#filterOperator').addEventListener('click', () => onFilterOperator());
document.querySelector('#reduceOperator').addEventListener('click', () => onReduceOperator());
document.querySelector('#scanOperator').addEventListener('click', () => onScanOperator());

