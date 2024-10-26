---
title: "Dynamic Programming (Generic)"
summary: "Discover the basics of dynamic programming with an example"
date: "Mar 17 2024"
draft: false
tags:
- Algo
---

Dynamic programming is a powerful technique in computer science that makes it possible to optimise algorithms by avoiding the recalculation of solutions that have already been solved.

In algorithms, we talk about complexity in order to evaluate the order of magnitude as a function of the size of the input.

There are several categories:
- $O(1)$: Constant complexity
- $O(log\; n)$: Logarithmic complexity
- $O(n)$: Linear complexity
- $O(n\; log\; n)$: Linearithmic complexity
- $O(n^k)$: Quadratic, cubic complexity, …
- $O(2^n)$: Exponential complexity

## Understanding Dynamic Programming

Dynamic programming solves problems by dividing tasks into smaller sub-problems and solving each sub-problem once, storing the results. This avoids the need to recalculate solutions that are already known, thus improving the efficiency of the algorithms.

### Substructure Optimality

A key property of dynamic programming is the optimality of substructures. This means that the optimal solution to a problem can be constructed from the optimal solutions to its sub-problems.

### Recurrence

The recurrence relation is an equation that describes the solution to a problem in terms of the solutions to smaller sub-problems. This recurrence equation is often the key to formulating a dynamic algorithm.

### Memoization

Memoization is the act of storing (or saving) the results of sub-problems that have already been solved. This avoids having to recalculate the same solutions several times.

### Fibonacci: A classic example

The Fibonacci algorithm is often used to illustrate dynamic programming concepts. In Go, we can implement a recursive version and a dynamic version with `memoization`

```go
package main

import (
	"fmt"
	"time"
)

func fibonacci(n int) int {
	if n <= 1 {
		return n
	}
	return fibonacci(n-1) + fibonacci(n-2)
}

func fibonacciDyn(n int) int {
	var fib func(int, map[int]int) int
	fib = func(n int, memo map[int]int) int {
		if n <= 1 {
			return n
		}

		if value, ok := memo[n]; ok {
			return value
		}

		// Appel récursif à la fonction interne
		memo[n] = fib(n-1, memo) + fib(n-2, memo)

		return memo[n]
	}

	memo := make(map[int]int, n)
	return fib(n, memo)
}

func measureTime(f func(int) int, n int) (int, time.Duration) {
	startTime := time.Now()
	result := f(n)
	elapsedTime := time.Since(startTime)
	return result, elapsedTime
}

func main() {
	tab := []int{10, 20, 25, 40, 50, 75, 100, 200, 1000}

	fmt.Println("Résultats pour Fibonacci (récursif) :")
	fmt.Println("-------------------------------------")
	for _, i := range tab {
		if i > 40 {
			break
		}
		result, elapsedTime := measureTime(fibonacci, i)
		fmt.Printf("Fibonacci(%2d) = %10d | Temps d'exécution : %s\n", i, result, elapsedTime)
	}

	fmt.Println("\nRésultats pour Fibonacci (dynamique avec mémoïsation) :")
	fmt.Println("------------------------------------------------------")
	for _, i := range tab {
		result, elapsedTime := measureTime(fibonacciDyn, i)
		fmt.Printf("Fibonacci(%2d) = %10d | Temps d'exécution : %s\n", i, result, elapsedTime)
	}
}
```

<img src="/src/content/blog/01-dynamic-programming/image1.webp" />


In the first function a we calculate the value for each call, the use of dynamic programming has made it possible here to memorise the results of each fib(n) avoiding additional calls for parts that have already been solved.

By going back through the calls we have injected the value found for each index, which means that when we have found $fib(4)$ and we have to deal with the right-hand leaf of the call $fib(5)$ , the result of $fib(3)$ is at index $2$, which avoids having to redo all the calculations.

## Optimisation

There are several ways to optimise your programme, the best known of which is to use the language tools to establish parallelism and utility functions to make things easier and reduce certain costs.

### Top-Down Dynamic Programming with Memoization

In this approach, recursion is used with memoization to avoid recalculating the same sub-problems.

The worst-case time complexity of this approach is also $O(n)$. However, memoization significantly reduces the number of distinct sub-problems to be solved, which can significantly improve execution time compared to simple recursion.

### Time Complexity Analysis

The time complexity of the above approach is linear, $O(n)$, where $n$ is the term of the Fibonacci sequence to be calculated. This is because each term is calculated only once, and each calculation involves a constant number of operations.

## Knapsack Problem

The `Knapsack problem` is a classic combinatorial optimisation problem. There are different versions of this problem.

**Statement**

Given a rucksack with a maximum capacity $W$ and $n$ objects, each object $i$ having a weight $w_i$ and a value $v_i$. The problem is to maximise the total value of the objects in the bag, while respecting the bag's maximum capacity.


### Formalising the problem

Let $x_i$ be the binary variable that indicates whether object $i$ is included in the bag (1 if included, 0 otherwise).

The objective is to maximise the sum of the values of the objects included in the bag:

$$
\sum^n_{i=1} x_i .v_i
$$

Provided that the sum of the weights of the items included does not exceed the maximum capacity of the bag:

$$
\sum^n_{i=1} x_i .w_i \leq W
$$


```go
package main

import (
	"fmt"
)

func knapsack01(values, weights []int, capacity int) int {
	n := len(values)

	// Memoization table
	memo := make([][]int, n+1)
	for i := range memo {
		memo[i] = make([]int, capacity+1)
	}

	// Recursive function with memoization
	var knapsackRec func(int, int) int
	knapsackRec = func(item, remainingCapacity int) int {
		if item == 0 || remainingCapacity == 0 {
			return 0
		}

		// Check whether the value is already stored
		if memo[item][remainingCapacity] != 0 {
			return memo[item][remainingCapacity]
		}

		// Cases where the object cannot be included
		if weights[item-1] > remainingCapacity {
			memo[item][remainingCapacity] = knapsackRec(item-1, remainingCapacity)
			return memo[item][remainingCapacity]
		}

		// Cases where the object can be included or excluded
		include := values[item-1] + knapsackRec(item-1, remainingCapacity-weights[item-1])
		exclude := knapsackRec(item-1, remainingCapacity)
		memo[item][remainingCapacity] = max(include, exclude)

		return memo[item][remainingCapacity]
	}

	return knapsackRec(n, capacity)
}

func main() {
	values := []int{60, 100, 120}
	weights := []int{10, 20, 30}
	capacity := 50

	result := knapsack01(values, weights, capacity)
	fmt.Printf("La valeur maximale du sac à dos est : %d\n", result)
}
```

This code solves the knapsack problem using a recursive approach with memoization. The knapsack01 function takes into account the values of the objects, their weights and the maximum capacity of the bag to return the maximum value that can be obtained. The use of memoization ensures optimal complexity.

---

## Conclusion

Dynamic programming makes it possible to change complexity domain, as with the Fibonacci sequence, moving from exponential complexity to linear complexity.

## Ressources

- [Rust Dynamic programming](https://github.com/NathaelB/rust-beginner/tree/master)
