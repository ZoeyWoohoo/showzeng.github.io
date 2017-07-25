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

### RecyclerView 数据更新

> 调用 `notifyDataSetChanged()` 数据没有同步更新显示

在写项目的时候，将数据读取操作封装了起来，异步任务请求成功后将数据缓存到本地，再从本地重新读取数据并通知 Adapter 更新数据。但是调试发现界面上的数据并没有更新，而 debug 的结果显示数据源已经变了，那么问题出在哪了？

``` java
private void initData() {
    String topicCache = DataBaseGet.getTopicFromDB().getJson();
    Gson gson = new Gson();
    TopicEntity topicEntity = gson.fromJson(topicCache, TopicEntity.class);
    mRowsList = topicEntity.getRows();
}
```

这里 `topicEntity.getRows()` 返回的是一个 List，将它直接赋值给 Adapter 的数据源 mRowsList。然后异步任务执行成功后，本地缓存的数据已经更新，所以再次调用 `initData()` 并调用 `notifyDataSetChanged()` 通知 Adapter 数据更新。这里就有一个被我忽视的问题，当再次调用 `initData()` 方法时，mRowsList 再次被赋值。而第一次初始化时 mRowsList 是作为一个参数传入 Adapter 的，它持有的是第一次 mRowsList 所持有的对象的引用，所以这里通知 Adapter 更新数据时，它再次将数据载入视图刷新的是第一次所持有的引用，而第二次赋值的新的对象，对 Adapter 没有任何影响。因此，应将 `initData()` 这样改写：

``` java
private void initData() {
    String topicCache = DataBaseGet.getTopicFromDB().getJson();
    Gson gson = new Gson();
    TopicEntity topicEntity = gson.fromJson(topicCache, TopicEntity.class);
    for (TopicEntity.Rows rows: topicEntity.getRows()) {
        mRowsList.add(rows);
    }
}
```

也就是对于 Adapter 数据源的正确写法一般是，定义为空的 ArrayList，可避免一些越界的错误，对数据的更新统一调用 List 的 `add()` 和 `clear()` 方法，如下：


``` java
public class MainActivity extends BaseActivity {

    ...
    private RecyclerView mRecyclerView;
    private MyRecyclerViewAdapter mMyRecyclerViewAdapter;
    private List<xxx> mList = new ArrayList<>();
    ...

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ...

        initData();
        mMyRecyclerViewAdapter = new MyRecyclerViewAdapter(mList);
        mRecyclerView.setAdapter(mMyRecyclerViewAdapter);
        ...

        testDataChange();
    }

    private void initData() {
        ...
        mList.add(xxx);
        ...
    }

    private void testDataChange() {
        ...
        // 清空重新添加新的数据或者直接插入数据，根据情况而定
        mList.clear();
        initData();
        mMyRecyclerViewAdapter.notifyDataSetChanged();
    }
}
```
