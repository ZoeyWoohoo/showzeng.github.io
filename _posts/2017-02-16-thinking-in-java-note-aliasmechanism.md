---
layout: post
title:  "Thinking in Java 学习笔记之别名现象"
date:   2017-02-16 00:00:00 +0800
category: Java
excerpt: 由赋值引起的别名现象：对于基本数据类型的赋值，存储的是实际的数值，将内容复制给了另一方。而对于对象的赋值则是操作的对象的引用。
---

### 赋值

对于基本数据类型的赋值，存储的是实际的数值，将内容复制给了另一方。而对于对象的赋值则是操作的对象的引用。

由此引出 “**别名现象**”：

``` java
class Tank {
  float number;
}

public class HelloWorld {
  public static void main(String[] args) {

    System.out.println("别名现象：");
    Tank tank1 = new Tank();
    Tank tank2 = new Tank();
    tank1.number = 6;
    tank2.number = 8;
    System.out.println("First: tank1.number: " + tank1.number + ", tank2.number: " + tank2.number);
    tank1 = tank2;
    System.out.println("Second: tank1.number: " + tank1.number + ", tank2.number: " + tank2.number);
    tank1.number = 9;
    System.out.println("Third: tank1.number: " + tank1.number + ", tank2.number: " + tank2.number);

    System.out.println("");
    System.out.println("-------------------------------");
    System.out.println("");

    System.out.println("避免别名现象：");
    Tank tank3 = new Tank();
    Tank tank4 = new Tank();
    tank3.number = 6;
    tank4.number = 8;
    System.out.println("First: tank3.number: " + tank3.number + ", tank4.number: " + tank4.number);
    tank3.number = tank4.number;
    System.out.println("Second: tank3.number: " + tank3.number + ", tank4.number: " + tank4.number);
    tank3.number = 9;
    System.out.println("Third: tank3.number: " + tank3.number + ", tank4.number: " + tank4.number);
  }
}
```

其输出结果如下：

![aliasMechanismResult](http://7xtt0k.com1.z0.glb.clouddn.com/ThinkingInJava/aliasMechanismResult.png)

> **方法调用中的别名问题**

同样的，在将一个对象作为参数传递给方法时，也会产生别名问题。

``` java
class Letter {
  char c;
}

public class AliasMechanism {
  static void f(Letter y) {
    y.c = 'z';
  }

  public static void main(String[] args) {
    Letter x = new Letter();
    x.c = 'a';
    System.out.println("1: x.c: " + x.c);
    System.out.println("------ 对象传递 -------");
    f(x);
    System.out.println("2: x.c: " + x.c);
  }
}
```

其输出结果如下：

![aliasMechanismFunctionResult](http://7xtt0k.com1.z0.glb.clouddn.com/ThinkingInJava/aliasMechanismFunctionResult.png)

在 `f(x);` 这一步时其实相当于执行了 `y = x;` ,所以，当方法 f 结束后，其 x.c 的值也已经改变了。
