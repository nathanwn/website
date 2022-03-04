---
title: "Building C++"
date: 2022-02-22T12:30:00+10:00
draft: false
tags:
- C++
- Tools
- Compilers & Intepreters
---


This article provides an overview of the C++ build process and different build tools & systems for the C++ language. For a list of comprehensive articles and documentations regarding the topic, please refer to the bottom of the article.

# C++ Compilation Process

There are different ways to divide the C++ compilation process into steps. In the context of building C++, I usually think of the process as having 2 main steps:

* Compiling
* Linking

Other documentations on the Internet may divide the process into more than 2 steps, including steps such as Preprocessing before Compiling, or Assembling after Compiling. However, I reckon these details are not too relevant to what I want to discuss in this article.

## Compiling

The compiling phase is a whole complex multi-step process in itself. It takes the source code files, preprocesses them, checks for syntax and semantic errors, and produces object files (`.o`) containing low-level machine code.

## Linking

The linking step combine multiple object files (`.o`) into a single file. There are a couple of reasons why having linking and compiling as two separated steps is a good idea. One key reason is speeding up the compilation process of a large program: once a source file changes, it is the only file that needs recompiling to an object file; other unchanged files need not be touched.

# C++ Build Tools

## Make

Make is one of the oldest and most basic build tools for C and C++. When running in a shell (such as bash or zsh), the command `make` works on the makefile in the current directory. Each makefile contains some number of rules with the following structure:

```makefile
target: dependencies
  commands
```

* The command `make` can be invoked with a target. This run all commands under the target. If `make` is invoked without a specific target, the default target is the first target found in the makefile.
* A target can be a name, or one or more files.
* Dependencies are the list of files, and/or other targets required for the current target.
