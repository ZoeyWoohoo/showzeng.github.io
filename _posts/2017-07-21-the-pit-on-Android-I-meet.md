---
layout: post
title:  "Android 开发上遇到的 '坑' (持续更新)"
date:   2017-07-21 09:05:29 +0800
category: Android
excerpt: 本文为记录 Android 开发路上遇到的坑或需要注意的一些细节。
---

### Http 请求

> **对于 IOException 的处理**

在网上，你可能经常会看到这种写法：

``` java
public static Response postMethod(String url, String json) throws IOException {

    RequestBody requestBody = RequestBody.create(JSON, json);
    Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
    Response response = okHttpClient.newCall(request).execute();

    if (!response.isSuccessful()) {
        throw new IOException("unexpected code" + response);
    }

    return response;
}
```

这里对于 IOException 的处理，判断的是 response.isSuccessful()，造成的问题是，只要请求不成功（仅限请求状态是 200），就抛出 IO 异常。而对于后续操作如登录请求，你可能要对相应的状态码做不同的响应，例如：帐号或密码错误请求状态码是 403。所以，这里不应这么简单粗暴地用请求是否成功来判断。

改进写法：

``` java
public static Response postMethod(String url, String json) throws IOException {

    RequestBody requestBody = RequestBody.create(JSON, json);
    Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
    Response response = okHttpClient.newCall(request).execute();

    if (response.code() != 200 && response.code() != 403) {
        throw new IOException("unexpected code" + response);
    }

    return response;
}
```
