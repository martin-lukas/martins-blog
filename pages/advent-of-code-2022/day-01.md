# Day 1 - Snack carrying elves

[Advent of Code 2022 - Day 1](https://adventofcode.com/2022/day/1)

This is the first day of the Advent of Code 2022 challenges.
I decided to try this challenge using Java, specifically Java 17, as I'd like to improve especially my Stream API knowledge.

Today's challenges are:

1. Find the elf with the most calories
2. Find the top 3 elves with the most carried calories

## 1. Find the elf with the most calories

I started by writing a simple record called `Elf` with two methods - static `from(String)` for creating an elf from a string, and `totalCalories()` for getting the sum of all his snacks' calories. Implementation here:

```java
record Elf(List<Integer> calories) {
    static Elf from(String calorieString) {
        List<Integer> calories = Arrays
                .stream(calorieString.split("\n"))
                .map(Integer::parseInt)
                .toList();
        return new Elf(calories);
    }

    int totalCalories() {
        return calories.stream().mapToInt(i -> i).sum();
    }
}
```

You can notice a heavy use of Streams. I'd point out in the method `totalCalories()`, I use the operation `mapToInt(i -> i)`, which may seem a bit strange to some.

### Conversion from `Stream<Integer>` to `IntStream`

The only purpose of this operation is to convert the `Stream<Integer>` object into an `IntStream` stream of primitives. The terminal operation `sum()` is available only for `IntStream`, because it's not useful for all objects like the other terminal operations for `Stream<T>`.

The conversion uses the concept of "automatic unboxing" of the `Integer` object. Another way would be to use the operation `mapToInt(Integer::intValue)`, which would do the same, just in a more verbose way.

We could also stick to `Stream<Integer>` only, by using `reduce(Integer, BinaryOperator<Integer>)` instead of `sum()`. That would look something like - `reduce(0, (a, b) -> a + b)`. The `0` is the initial value, and `a` is always the previous element of the stream, `b` is the following, and the result of the function is set into `a` again. That way, the stream gets "reduced" into a single value. This is more verbose, and less clear from just glancing at it what the goal is. The operation `sum()` is definitely much clearer.

###

After this, I needed a class to easily manage the creation of many elves from a very long string. I decided to name it `ElfManager`. I need a method for parsing the elven string, called `createElves(String)`.

```java
class ElfManager {
    static List<Elf> createElves(String caloriesString) {
        // each elf separated by empty line
        return Arrays.stream(caloriesString.split("\n\n"))
                .map(Elf::from)
                .toList();
    }
}
```

I'm using the `Elf::from` method reference to create the elves from the substrings easily. Apart from that, nothing special here.

Next method is the one that is going to solve the part 1 of this exercise - `getElfWithMostCalories(List<Elf>)`

```java
// ElfManager class

static Optional<Elf> getElfWithMostCalories(List<Elf> elves) {
    return elves.stream().max(Elf.BY_TOTAL_CALORIES_ASC);
}
```

For this method, I added a `Comparator` object into `Elf` to reuse the behavior of comparing based on total carried calories. Thanks to this, we can use the `max()` operation which finds the maximum in the stream based on this `Comparator`. It will then be easy to get the solution to part 1 from this method.

###

Now comes the time to finally calculate the first solution. For that, we need to read the input text file, and then use the prepared methods to get the result. I created a helper class `FileUtils` to easily read the file:

```java
public class FileUtils {
   private static final String PREFIX = "src/main/resources/";

    public static String toString(String relativePath) {
        try {
            return Files.readString(Paths.get(PREFIX + relativePath));
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }
}
```

###

Let's get the result with this code:

```java
String elvenString = FileUtils.toString("day01/elf-calories.txt");
List<Elf> elves = ElfManager.createElves(elvenString);
int maxCalories = ElfManager.getElfWithMostCalories(elves)
        .map(Elf::totalCalories)
        .orElse(0);

System.out.println(maxCalories);
```

This code prints out the correct answer.

## 2. Find the top 3 elves with the most carried calories

The next part will build up on the methods I've already created, or at least on similar concepts. For getting this solution, I need a new method - `getTopNElves(List<Elf>, int)`:

```java
// ElfManager class

static List<Elf> getTopNElves(List<Elf> elves, int n) {
    return elves.stream()
            .sorted(Elf.BY_TOTAL_CALORIES_ASC.reversed())
            .limit(n)
            .toList();
}
```

This method will sort the list of provided elves by the comparator that I'm reusing from the 1st part. However, it needs to be reversed, in order to correctly use the `limit(int)` operation. This operation takes the top `n` stream items, so in this case the list has to be sorted in a descending order by the total calories.

After we get the top 3 elves, we should sum up all of their carried calories - new method `sumElfCalories(List<Elf>)`:

```java
static int sumElfCalories(List<Elf> elves) {
    return elves.stream()
            .map(Elf::totalCalories)
            .mapToInt(i -> i)
            .sum();
}
```

Now I have all the necessary pieces to glue together the code for calculation this part's solution:

```java
String elvenString = FileUtils.toString("day01/elf-calories.txt");
List<Elf> elves = ElfManager.createElves(elvenString);
List<Elf> top3Elves = ElfManager.getTopNElves(elves, 3);
int sumOfCalories = ElfManager.sumElfCalories(top3Elves);

System.out.println(sumOfCalories);
```

This gives the correct solution as well. And it's pretty readable too, at least in my opinion.

###

So there we have it, a bit verbose solution to a pretty simple programming problem. But I feel like I've created a bit of a framework for dealing with the other exercises on the following days.