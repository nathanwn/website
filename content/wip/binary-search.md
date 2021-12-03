---
title: "Binary Search"
date: 2026-06-21T21:46:55+10:00
draft: false
tags:
  - algorithms
summary: A long discussion on the implementation and applications of one of my favourite algorithms
---

# Simple binary search implementation

```java
int binarySearch(int[] a, int target) {
    int left = 0;
    int right = a.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (target < a[mid]) {
            right = mid - 1;
        } else if (target > a[mid]) {
            left = mid + 1;
        } else {
            return mid;
        }
    }
    return -1;
}
```
