---
title: "Notes on Makefile"
date: 2022-02-22T12:30:00+10:00
draft: false
tags:
- C
- C++
- Tools
---

# Introduction

Makefile is a special filetype that is commonly used to write build automation script for compiled languages, most notably C and C++.

The program that use a Makefile to automate a build system is Make. There are
different versions of make, including [**GNU
Make**](https://www.gnu.org/software/make/), which is a well-known package on GNU/Linux systems.

GNU Make is automatically installed alongside a lot of Linux distributions. If your machine does not have GNU Make, you can simply install it from the respective package manager of your distro. For example, on a Debian-based distro, one can install GNU Make with apt:

```
sudo apt update
sudo apt install build-essential
```

# Basic Structure of a Makefile

## First Makefile

Makefile consists of rules, each is in the following format:

```makefile
target: dependencies
    command 1
    command 2
    ...
```

A very simple Makefile that compiles a source file named `main.cpp` to an executable named `main` looks like this:

```makefile
main: main.cpp
    g++ main.cpp -o main
```

The target `main` is also the name of the executable file that we want to produce. To create the executable file, the source file `main.cpp` is required, and so it is a a **dependency** of this target. To create the file `main`, we run `make main` at the directory containing the Makefile. Similarly, to invoke any target in a makefile, we run `make <target-name>`. If we only run `make` alone on a Makefile with more than 1 rule, the rule at the top of the file is invoked.

When the target `main` is invoked, `make` check if `main` exists.
* If `main` does not exist, the `g++` command is invoked to produce `main`.
* On the other hand, if `main` does exist, `make` compare the last modified timestamp of the target file with those of its dependencies.
  * If there is any dependency with a later timestamp than the target file's timestamp the `g++` command is run to rebuild `main`
  * Otherwise, `g++` need not be invoked again since none of `main` dependencies changed.

This characteristic of `make` in combination with the way the C/C++ compilation process works makes Makefiles suitable for C/C++ build scripts. Building C/C++ involves compiling individual source files into object files before all object files are combined into one single executable. With `make`, we can ensure only the changed source files are recompiled, saving significant compilation time.


# Makefile for a C project

## Simple Makefile for a C project

Given the following project structure:
```
./
    add.c
    add.h
    main.c
    subtract.c
    subtract.h
```

Normally, to build this project, we need to run these commands:

```sh
# Compile each source file into an object file
gcc -c add.c
gcc -c main.c
gcc -c subtract.c
# Link all object files into one executable
gcc -o main add.o main.o subtract.o
```

We can put these commands into our Makefile as follow:

```makefile
all: add.o main.o subtract.o

add.o:
    gcc -c add.c

main.o:
    gcc -c main.c

subtract.o:
    gcc -c subtract.c
```

Most of the time, we also want to enable warnings.

```makefile
all: add.o main.o subtract.o
    gcc add.o main.o subtract.o -o main

add.o:
    gcc -Wall -Wextra -c add.c

main.o:
    gcc -Wall -Wextra -c main.c

subtract.o:
    gcc -Wall -Wextra -c subtract.c
```

If you want your Makefile to be stricter, you can make each `.c` file the dependency for the corresponding `.o` target.

```makefile
all: add.o main.o subtract.o
    gcc add.o main.o subtract.o -o main

add.o: add.c
    gcc -Wall -Wextra -c add.c

main.o: main.c
    gcc -Wall -Wextra -c main.c

subtract.o: subtract.c
    gcc -Wall -Wextra -c subtract.c
```


Also, in each Makefile there is usually a target named `clean` which is used to clean up temporary build files.

```makefile
clean:
    rm *.o
    rm main
```

## Example 5: Makefile with variables

You can also use variables in a Makefile.

* To declare a variable, use the `=` operator. *Note that there should be no space on the left and the right of the `=` operator.*
```makefile
CC = gcc # this is bad
CC=gcc   # this is ok
```
* To use a variable, use the syntax: `$(var)`.

```makefile
CC=gcc
CFLAGS=-Wall -Wextra
EXEC=main

all: add.o main.o subtract.o
    gcc add.o main.o subtract.o -o $(EXEC)

add.o: add.c
    $(CC) $(CFLAGS) -c add.c

main.o: main.c
    $(CC) $(CFLAGS) -c main.c

subtract.o: subtract.c
    $(CC) $(CFLAGS) -c subtract.c

clean:
    rm *.o
    rm $(EXEC)
```

## Example 6: Makefile with automatic variables

Oftentimes, the names of targets and dependencies are also names of files that participate in the build process. In those situations, we can use the following automatic variables.

* `$@`: The name of the target.
* `$<`: The name of the first prerequisite.
* `$^`: The name of all prerequisites, with spaces between them.

[More info here](https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html#Automatic-Variables)

A Makefile that uses automatic variables:

```makefile
CC=gcc
CFLAGS=-Wall -Wextra
EXEC=main

all: $(EXEC)

$(EXEC): add.o main.o subtract.o
    gcc $^ -o $@

add.o: add.c
    $(CC) $(CFLAGS) -c $<

main.o: main.c
    $(CC) $(CFLAGS) -c $<

subtract.o: subtract.c
    $(CC) $(CFLAGS) -c $<

clean:
    rm *.o
    rm main
```


## Example 7: Makefile that group object targets into one target

As we can see from the previous examples, the compile commands of object targets are all the same. To avoid this kind of repetition, we need some way to group all object targets into one.

To do that, we can use the `%` pattern, together with an extension, for example, `%.c` or `%.o`. When we run make, the `%.c` pattern expands into all `.c` files in the current directory. Note that, this kind of expansion only work within **rules**, and does not work for variable assignment, or inside the arguments of a function.

```makefile
CC=gcc
CFLAGS=-Wall -Wextra
EXEC=main

all: $(EXEC)

$(EXEC): add.o main.o subtract.o
    gcc $^ -o $@

%.o: %.c
    $(CC) $(CFLAGS) -c $<

clean:
    rm *.o
    rm main
```


## Example 8: Makefile that allow expansions in variable assignments and functions

From this example, since you are quite familiar with Makefile already, I will only give the Makefile, and the links to the resources that you need to read in order to understand the file.

* [`wildcard` Function](https://www.gnu.org/software/make/manual/html_node/Wildcard-Function.html)
* [Sources from subdirectories in Makefile](https://stackoverflow.com/a/4038459)

```makefile
CC=gcc
CFLAGS=-Wall -Wextra
SRCS=$(wildcard *.c) $(wildcard */*.c)
OBJS=$(patsubst %.c,%.o,$(SRCS))
EXEC=main

all: $(EXEC)

$(EXEC): add.o main.o subtract.o
    gcc $^ -o $@

$(OBJS): $(SRCS)
    $(CC) $(CFLAGS) -c $<

clean:
    rm *.o
    rm main
```
