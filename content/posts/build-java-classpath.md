---
title: "Building Java: The classpath"
date: 2026-09-01T18:46:55+10:00
draft: false
tags:
  - build
  - java-build
summary: A classpath - one of the most important concepts for Java builds.
---

> This article is part of the **[Building Java](/tags/java-build/)** series:
> 1. [The Classpath](/posts/build-java-classpath/) *(this article)*
> 2. [Java Packages](/posts/build-java-packages/)
> 3. [JAR Artifacts](/posts/build-java-jar/)

## Compiling a single Java source file

Let's start with the most simple Java source file `Main.java`.

```java {file="Main.java"}
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");
    }
}
```

To compile it, we run the `javac` command:

```
javac Main.java
```

This creates a Java `.class` file in the same directory.

```
> ls
Main.class Main.java
```

To run the program, we run `java` with the class having the `main` method, which in this case is the `Main` class.

```
> java Main
Hello world!
```

## Compiling multiple Java source files

What happens when we want to add another Java source file?

Let's add a simple `English.java` file in the current directory with a `English` class, and make `Main.java` use this new class.

```java {file="English.java"}
public class English {
    public void greet() {
        System.out.println("Hello!");
    }
}
```

```java {file="Main.java"}
public class Main {
    public static void main(String[] args) {
        English english = new English();
        english.greet();
    }
}
```

We compile the same way with `javac Main.java`. Now, there is another `English.class` file created.

```
> javac Main.java

> ls
English.class English.java  Main.class    Main.java
```

Interestingly, `javac` is smart enough to also compile the `English` class. The `English` class can also be compiled separately with `javac English.java` before `Main` class is compiled.

To run the program, we do the same way:

```
> java Main
Hello!
```

Again, we did not explicitly pass the `English` class to the `java` command. However, `java` still knows how to discover it, as long as the class file is in the current directory.

We will understand why `javac` and `java` still know about the `English` class without it being specified explicitly later. Let's now take a look at a more complex example.

## Discovering Java class in a different directory

### Compile classpath

Let's now create a new file `French.java` with a `French` class in a new child directory `french`.

```java {file="french/French.java"}
public class French {
    public void greet() {
        System.out.println("Bonjour!");
    }
}
```

The current directory tree should be like this:

```
> tree .
.
├── English.java
├── french
│   └── French.java
└── Main.java
```

We also update `Main.java` to reference the `French` class.

```java {file="Main.java"}
public class Main {
    public static void main(String[] args) {
        English english = new English();
        english.greet();
        French french = new French();
        french.greet();
    }
}
```

If we compile with `javac Main.java`, now we get these compile errors:

```
> javac Main.java
Main.java:5: error: cannot find symbol
        French french = new French();
        ^
  symbol:   class French
  location: class Main
Main.java:5: error: cannot find symbol
        French french = new French();
                            ^
  symbol:   class French
  location: class Main
2 errors
```

`javac` now does not know where to find the `French` class.

Clearly, the compiler does not know how to find the `French` class if it is not in the current directory like the `English` class. How do we fix this issue?

It turns out that there is a command line option to `javac` to specify additional directories where the compiler may look for classes to compile: `-classpath` or `-cp`. Formally, this is known as the **compile classpath**.

In this case, we need to pass the classpath value `french:.`: the `french` directory and the current directory `.` separated by the path separator `:`

```
> javac -classpath french:. Main.java
```

By default, if this argument is not specified, the classpath only contains the current directory. This explains why before we introduced the `French` class, we compiled without issue.

> **Note**: The colon `:` is the valid path separator on Mac and Linux. If you are on Windows, use a semicolon `;` instead.

On the other hand, if the classpath only contains `french` but not the current directory `.`, we get the following compile errors:

```
> javac -classpath french Main.java
Main.java:3: error: cannot find symbol
        English english = new English();
        ^
  symbol:   class English
  location: class Main
Main.java:3: error: cannot find symbol
        English english = new English();
                              ^
  symbol:   class English
  location: class Main
2 errors
```

### Runtime classpath

We also now discover that we cannot run the program the same way anymore.

```
> java Main
Hello!
Exception in thread "main" java.lang.NoClassDefFoundError: French
	at Main.main(Main.java:5)
Caused by: java.lang.ClassNotFoundException: French
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:580)
	at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:490)
	... 1 more
```

Notice that `Hello!` was still printed. The program crashes when it needs to reference the `French` class right after the `english.greet()` call. From the error message, something called the "class loader" cannot find the `French` class. As the program crashed in the middle of running, we discover another interesting behavior: the JVM does not verify or load all classes ahead of time, but does so in a lazy/on-demand manner.

Similar to when we compile, here we also need to provide a "classpath" to the class loader. This is formally known as the **runtime classpath**.

```
> java -classpath french:. Main
Hello!
Bonjour!
```

We specify an argument `-classpath` with the value `french:.`: the `french` directory and the current directory `.` separated by the path separator `:`.

What if we only include `french` in the classpath?

```
> java -classpath french Main
Error: Could not find or load main class Main
Caused by: java.lang.ClassNotFoundException: Main
```

### Summary

Through the example of a source file in a different directory, we learned one of the most important concepts to understand for Java builds: the classpath.

There are two types of classpaths: compile classpath and runtime classpath.

In the next articles of the this "Building Java" series, we will move on to some more complex topics.
