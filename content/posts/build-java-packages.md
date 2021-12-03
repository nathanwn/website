---
title: "Building Java: Java packages"
date: 2026-09-05T20:26:12+10:00
draft: false
tags:
  - build
  - java-build
summary: How the use of packages affects Java builds.
---

> This article is part of the **[Building Java](/tags/java-build/)** series:
> 1. [The Classpath](/posts/build-java-classpath/)
> 2. [Java Packages](/posts/build-java-packages/) *(this article)*
> 3. [JAR Artifacts](/posts/build-java-jar/)

## Introduction to Java packages

What are packages, and why do we need them?

The [Java official documentation](https://docs.oracle.com/javase/tutorial/java/package/packages.html) says:

> A package is a grouping of related types providing access protection and name space management.

The [Java Language Specification](https://docs.oracle.com/javase/specs/jls/se8/html/jls-7.html#jls-7.2) says:

> For small programs and casual development, a package can be unnamed or have a simple name, but if code is to be widely distributed, unique package names should be chosen using qualified names. This can prevent the conflicts that would otherwise occur if two development groups happened to pick the same package name and these packages were later to be used in a single program.

For example, you can have two classes of the same name, `Main`, if they belong to two different packages, `foo` and `bar`. In this case, they are two classes with different fully-qualified class names (FQCNs):

- `foo.Main`
- `bar.Main`

Packages are declared through the use of the `package` statement.

By convention, package names are written in all lower case using reversed Internet domain names.

For example, the `Main` class below belongs to the `com.example` package.

```java {file="Main.java"}
package com.example;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello!");
    }
}
```

## Compiling and running classes with packages

Let's now compile the `Main.java` file above and run it.

```
> javac Main.java

> ls
Main.class Main.java

> java Main
Error: Could not find or load main class Main
Caused by: java.lang.NoClassDefFoundError: Main (wrong name: com/example/Main)
```

Now we cannot run the class with the short class name `Main` anymore.

What if we use the FQCN instead?

```
> java com.example.Main
Error: Could not find or load main class com.example.Main
Caused by: java.lang.ClassNotFoundException: com.example.Main
```

It turns out that Java expects the `Main.class` file to be under a directory hierarchy matching the package name of the `com.example.Main` class. The [Java documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/findingclasses.html) says:

> A class file has a subpath name that reflects the fully-qualified name of the class. For example, if the class com.mypackage.MyClass is stored under myclasses, then myclasses must be in the user class path, and the full path to the class file must be myclasses/com/mypackage/MyClass.class.

In this case, we want `Main.class` to be stored under `com/example`. We can let `javac` do that automatically for us with the `-d .` argument, which tells the compiler the destination root directory for the compiled class hierarchy.

```
> javac -d . Main.java

> tree
.
├── com
│   └── example
│       └── Main.class
└── Main.java

> java com.example.Main
Hello!
```

In real projects, there are a few things we normally want to do.

First, we also want to match the source directory structure to the package hierarchy to avoid confusion. This explains why in a lot of Java projects, source files are stored in a few layers of nested directories, which might seem counter-intuitive for people who are new to Java.

Second, we usually want to separate compiled `.class` files from the source files by producing them to a separate destination.

For example, let's put the `.java` files in a `src` directory and create the `.class` files in a `classes` directory.

```
> tree .
.
└── src
    └── com
        └── example
            └── Main.java

> javac -d classes src/com/example/Main.java

> tree .
.
├── classes
│   └── com
│       └── example
│           └── Main.class
└── src
    └── com
        └── example
            └── Main.java

> java -classpath classes com.example.Main
Hello!
```

## Directory structures in projects using common Java build systems

If you have used common Java build systems such as Maven or Gradle before, you must be familiar with this kind of directory hierarchy we have discussed.

- In `Maven` projects, classes are produced under `target/classes/<packages>`.
- In `Gradle` projects, classes are by default produced under `build/classes/java/<sourceSetName>/<packages>`. (For example, `sourceSetName` could be `main`. As this article is not about Gradle, we won't go into what a source set is in Gradle).
