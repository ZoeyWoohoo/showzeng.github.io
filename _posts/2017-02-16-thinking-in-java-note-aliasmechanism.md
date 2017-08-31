---
layout: post
title:  "Thinking in Java 学习笔记之别名现象"
date:   2017-02-16 00:00:00 +0800
category: Java
excerpt: 由赋值引起的别名现象：对于基本数据类型的赋值，存储的是实际的数值，将内容复制给了另一方。而对于对象的赋值则是操作的对象的引用。
---

> 导语：《Thinking in Java》系列笔记，因为在此前的学习过程中，一些比较细的知识点没有梳理和记忆，容易忘记，所以在看完《疯狂 Java 讲义》后，决定在读这本书的过程中，将自己觉得重要或者是自己平时并不关注的细节给记录下来。同时，也可以查看我读书所做的[思维导图](http://naotu.baidu.com/file/c2d3c32533ee65a57ea46aecf4dce3cc?token=974de6a59ff1a15c)（读完之前持续更新）。

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

![aliasMechanismResult](https://www.z4a.net/images/2017/08/31/aliasMechanismResult.png)

#### **方法调用中的别名问题**

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

![aliasMechanismFunctionResult](https://www.z4a.net/images/2017/08/31/aliasMechanismFunctionResult.png)

在 **f(x);** 这一步时其实相当于执行了 **y = x;** ,所以，当方法 **f()** 结束后，其 **x.c** 的值也已经改变了。
