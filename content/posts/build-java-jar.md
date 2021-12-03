---
title: "Building Java: JAR Artifacts"
date: 2026-09-06T09:10:37+10:00
draft: false
tags:
  - build
  - java-build
summary: An introduction to JAR files in Java.
---

> This article is part of the **[Building Java](/tags/java-build/)** series:
> 1. [The Classpath](/posts/build-java-classpath/)
> 2. [Java Packages](/posts/build-java-packages/)
> 3. [JAR Artifacts](/posts/build-java-jar/) *(this article)*

## Introduction to JAR files

JAR files usually come up when a Java project needs third-party dependencies. If you need a library for your project, you download a JAR file of that third-party dependency and run it.

The [JAR File Specification](https://docs.oracle.com/en/java/javase/25/docs/specs/jar/jar.html) says:

> JAR file is a file format based on the popular ZIP file format and is used for aggregating many files into one. A JAR file is essentially a zip file that contains an optional META-INF directory.

## An example of JAR files

Unlike some other common programming languages, Java does not have a built-in JSON library. Common JSON libraries include Gson, or Jackson. The example below makes use of Gson.

To use the Gson library, we need to first download a JAR file. The following `curl` command downloads a JAR file `gson-2.11.0.jar`, the JAR file for version `2.11.0` of the Gson library, from Maven Central, a free and public package registry for Java.

```
> curl -O https://repo1.maven.org/maven2/com/google/code/gson/gson/2.11.0/gson-2.11.0.jar

> ls
gson-2.11.0.jar
```

We can now create a simple Java file that creates a JSON object and prints it to the console.

```java {file="Main.java"}
import com.google.gson.JsonObject;

public class Main {
    public static void main(String[] args) {
        JsonObject obj = new JsonObject();
        obj.addProperty("name", "Alice");
        obj.addProperty("message", "Hello!");
        System.out.println(obj);
    }
}
```

Let's first try to compile it the simplest way we know: `javac Main.java`.

```
> javac Main.java
Main.java:1: error: package com.google.gson does not exist
import com.google.gson.JsonObject;
                      ^
Main.java:5: error: cannot find symbol
        JsonObject obj = new JsonObject();
        ^
  symbol:   class JsonObject
  location: class Main
Main.java:5: error: cannot find symbol
        JsonObject obj = new JsonObject();
                             ^
  symbol:   class JsonObject
  location: class Main
3 errors
```

`javac` here does not know what the `JsonObject` class is. We need to add the JAR file onto the **compile classpath**.

```
> javac -classpath gson-2.11.0.jar Main.java
```

If we run the `Main` class simply with `java Main`, we also hit an exception.

```
Exception in thread "main" java.lang.NoClassDefFoundError: com/google/gson/JsonObject
	at Main.main(Main.java:5)
Caused by: java.lang.ClassNotFoundException: com.google.gson.JsonObject
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:580)
	at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:490)
	... 1 more
```

Similarly, we also need to add the JAR file to the runtime classpath when we run class `Main`.

```
> java -classpath gson-2.11.0.jar:. Main
{"name":"Alice","message":"Hello!"}
```

We can look into the JAR file using the command `unzip -l`. There are a lot of `.class` files in this JAR, including the `.class` file for the class `com.google.gson.JsonObject` we just used.

```
> unzip -l gson-2.11.0.jar | grep 'JsonObject'
     4918  05-19-2024 11:53   com/google/gson/JsonObject.class
```

## Types of library JAR files

There is a common misconception that each JAR file must contain `.class` files. However this is not the case.

If we open the following URL in a browser:

```
https://repo1.maven.org/maven2/com/google/code/gson/gson/2.11.0/
```

we should see 3 different JAR files:

- `gson-2.11.0.jar`: The JAR file that we just downloaded, which contains the `.class` files of the Gson library. This is usually called a library JAR or a thin JAR.
- `gson-2.11.0-javadoc.jar`: This is called a Javadoc JAR, which contains the documentation of the library.
- `gson-2.11.0-sources.jar`: This is called a Source JAR, which contains the source code of the library.

There are also other types of JAR files.

## Packaging applications with Uber JARs

Another quite common type of JAR file for applications (not libraries) is called an uber JAR or fat JAR. This is a standalone JAR that bundles both the compiled `.class` files of an app and the `.class` files of all third-party dependencies. This JAR file is commonly used to simplify deployment.

For example, if you want to deploy a Java application inside a container image, it is much simpler to copy a single uber JAR into the image instead of copying each and every JAR file required for the app.

Another example that has come up in my own work before is supporting air-gapped or private Maven registries. Some users need to operate in restricted environments without direct access to public registries like Maven Central due to specific project requirements. However, their private registries may not contain all of the required third-party dependencies for our app. If they just upload our thin JAR, dependency resolution will fail and the app will not work. Distributing an uber JAR would solve this problem entirely by bundling all required dependencies into a single artifact.
