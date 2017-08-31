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

### Glide

> Crash: `java.lang.IllegalArgumentException: You cannot start a load for a destroyed activity`

先看 log 提示：

``` java
java.lang.IllegalArgumentException: You cannot start a load for a destroyed activity
    at com.bumptech.glide.manager.RequestManagerRetriever.assertNotDestroyed(RequestManagerRetriever.java:284)
    at com.bumptech.glide.manager.RequestManagerRetriever.get(RequestManagerRetriever.java:124)
    at com.bumptech.glide.manager.RequestManagerRetriever.get(RequestManagerRetriever.java:109)
    at com.bumptech.glide.Glide.with(Glide.java:554)
```

在写一个话题页面的时候，对于评论的 RecyclerView 中评论者头像的加载，用的是 Glide 这个库，造成应用 Crash 的原因，log 中也说的很清楚了，因为加载时的网络请求需要一定的时间，我在还未完成加载的瞬间按下了返回键 ( 说来也是巧，我在调试的时候，在进入新页面的瞬间立刻按下返回键才触发了这个隐藏的 bug )，Activity 已经销毁，然后就 Boom 了。

![哦豁.jpg](https://www.z4a.net/images/2017/08/31/ohuo.md.jpg)

这算是一个比较有趣的问题，对应 github 上的 [803 issue](https://github.com/bumptech/glide/issues/803) 。很多开发者问为什么这种小事不直接 log 警告，却给劳资 crash 掉了，作为一条优秀的裤子，这种情况就应由 Glide 内部处理，而不是让我们操碎了心。然后你可以看到一个 Glide 的 issue 守护者给出了自己的见解 ( 为啥叫他 issue 守护者，因为他并不是 Glide 的核心开发者，人家只是觉得有趣，主动来回复 Glide 的 issue，并借此让自己的头脑得到锻炼，你可以在各大 issue 上看到他活跃的身影 ) 。

![肃然起敬.jpg](https://www.z4a.net/images/2017/08/31/suranqijing.md.jpg)

好了，回归正题，这个原因的主要问题是，你的 Activity 已经销毁，视图已经不可见，这时候却还让它进行网络请求并填充视图，是极其不合理也是不应该的，为此，Glide 将其从底层提升至交由开发者处理，并直接将程序 crash 掉，以此提醒开发者去处理这个问题，而不是简单的一个 log ( 多少人是只要程序不崩溃，不出问题就万事大吉 )，这样会留下很多潜在的 bug 隐患。

下面说一下解决方案：

先注意一下 Glide 的用法

``` java
Glide.with(context).load(imageUrl).into(ImageView);
```

关键还在这第一个参数 context，一般也即当前 Activity。也就是说，如果当前 Activity 销毁，然后 Glide 在执行这个方法的时候，就会出错了。找到问题就好办了，直接在这之前判断当前 Activity 是否销毁即可:

``` java
if(!((Activity) context).isFinishing()) {
    Glide.with(context).load(imageUrl).into(ImageView);
}
```

当然，这不是唯一的解决方案，在 issue 中有人提出了多种应对方法，其中一个个人较为赞同的是：

``` java
// DemoActivity.java

public class DemoActivity extends BaseActivity {

    private RequestManager mRequestManager;

    private MyRecyclerViewAdapter mMyRecyclerViewAdapter;

    private List<Data> mDataList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);

        mRequestManager = Glide.with(this);

        mMyRecyclerViewAdapter = new MyRecyclerViewAdapter(this, mRequestManager, mDataList);

        ...

        new Runnable() {
            @Override
            public void run() {
                mRequestManager.load(imageUrl).into(ImageView);
            }
        }.run();

        ...
    }
}

// MyRecyclerViewAdapter.java

public class MyRecyclerViewAdapter extends RecyclerView.Adapter<MyRecyclerViewAdapter.ViewHolder> {


    private Context mContext;
    private RequestManager mRequestManager;
    private List<Data> mDataList = new ArrayList<>();

    public MyCommentRecyclerViewAdapter(Context context, RequestManager requestManager, List<Data> dataList) {
        mContext = context;
        mRequestManager = requestManager;
        mDataList = dataList;
    }

    ...

    @Override
    public void onBindViewHolder(MyCommentRecyclerViewAdapter.ViewHolder holder, int position) {
        ...
        mRequestManager.load(imageUrl).into(ImageView);
        ...
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ...
    }
}

```

对此，issue 守护者最后在 stackoverflow 上做了一个 [总结](https://stackoverflow.com/questions/31964737/glide-image-loading-with-application-context/32887693#32887693) ，他提出了一个 Context 就近原则，就是需要遵循所依附的 Activity 或者是 Fragment 的生命周期，并且说明了他对于直接使用 Application Context 这种简单粗暴的方法的见解。如果你发现本文上述方法没有解决你的问题，不妨在下面这几个链接中详看一番，或者你也可以直接联系我，一起探讨探讨。

* [Glide issue 803](https://github.com/bumptech/glide/issues/803)

* [Glide issue 1097](https://github.com/bumptech/glide/issues/1097)

* [StackOverFlow Glide image loading with application context](https://stackoverflow.com/questions/31964737/glide-image-loading-with-application-context/32887693#32887693)
