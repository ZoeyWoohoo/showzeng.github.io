---
layout: post
title:  "用 DialogFragment 模仿国际微博评论框"
date:   2017-08-11 22:38:29 +0800
category: Android
excerpt: 在写家园内部办公系统 US App 话题页面的时候，因自己绞尽脑汁也想不出什么好的设计图，脑海中唯一印象深刻的就是国际微博的 UI 了，索性就模仿着来吧，于是有了本文。
---

## 啥也不说了，先上图

![International Weibo comment box.gif](https://www.z4a.net/images/2017/08/31/pureComment.gif)

![Imitation of international Weibo comment box.gif](https://www.z4a.net/images/2017/08/31/pureCommentImitation.gif)

## 分析

1.从图中，可以看出，微博详情页底下的一个评论条其实并不做输入框使用，而是充当一个 Button 的作用，唤起真正的输入框。

2.真正的输入框，从效果来看，像是 Dialog，这里选用了自定义布局的 DialogFragment。

3.输入框 Dismiss 或者 Cancel 时，若评论并未提交，则将其显示到底部的评论条中，单行显示，溢出省略。

4.再次进入输入框时，若评论条内容不为空，需将文本内容填充到输入框中。

5.评论框中无字符输入时，提交按钮为灰色且不可触发，反之为正常的提交按钮。

## 分析完了那就开工吧

### 1. 底部评论条

这个就比较简单了，一个 LinearLayout 包裹住头像控件和文本控件且置于屏幕底部。这里想要提出的一点：

> Tip 1: 直接选用 TextView 而不是 EditText

在一开始的时候，我的第一直觉是认为那是一个 EditText，所以直接用的这个控件，设置为不可编辑，一切都看似那么的合乎情理。直到调试的时候，我发现在首次进入页面的时候，第一次点击评论条，并不能触发点击事件，需要第二次点击时才有效，而后就不会再出现问题。我试图去找过是什么原因，但未果，也不排除是否是机型或者什么其他原因，但倾向于是控件的事件分发哪里被截断了。总之，如果你能找到原因，还请告知，让我学习学习，感激不尽。

之后转念一想，反正 TextView 也是可以设置 Hint 的，那为啥不直接用 TextView 呢，简单省事。

下面是布局代码：

``` xml
<!-- activity_main.xml -->

<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background_my_material_grey"
    android:orientation="vertical">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="45dp"
        android:layout_alignParentBottom="true"
        android:background="@color/pureWhite"
        android:elevation="8dp">

        <de.hdodenhof.circleimageview.CircleImageView
            android:layout_width="35dp"
            android:layout_height="35dp"
            android:layout_margin="10dp"
            android:layout_gravity="center_vertical"
            android:src="@drawable/img_avatar"/>

        <TextView
            android:id="@+id/tv_comment_fake_button"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:hint="添加评论..."
            android:textColorHint="@color/textHint"
            android:textColor="@color/primary_text"
            android:gravity="center_vertical"
            android:maxLines="1"
            android:ellipsize="end"/>
    </LinearLayout>
</RelativeLayout>

```

### 2. DialogFragment 评论框

评论框布局也是比较简单的，一个无背景的输入框，一个提交按钮，以及左侧几个附加的功能按钮，比如选图，和 @ 功能，这个就直接上布局文件了：

``` xml
<!-- dialog_fragment_comment_layout.xml -->

<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:orientation="vertical"
              android:layout_width="match_parent"
              android:layout_height="130dp"
              android:layout_gravity="bottom"
              android:background="@color/background_my_material_light">

    <EditText
        android:id="@+id/edit_comment"
        android:layout_width="match_parent"
        android:layout_height="75dp"
        android:background="@null"
        android:gravity="top"
        android:layout_margin="10dp"
        android:hint="添加评论..."
        android:textColorHint="@color/textHint"
        android:textSize="17sp"/>

    <ImageView
        android:id="@+id/image_btn_photo"
        android:layout_width="25dp"
        android:layout_height="25dp"
        android:layout_below="@id/edit_comment"
        android:layout_marginStart="10dp"
        android:layout_marginBottom="10dp"
        android:src="@drawable/ic_photo"
        android:tint="@color/iconCoverDark"
        android:tintMode="multiply"/>

    <ImageView
        android:id="@+id/image_btn_at"
        android:layout_width="25dp"
        android:layout_height="25dp"
        android:layout_below="@id/edit_comment"
        android:layout_toEndOf="@id/image_btn_photo"
        android:layout_marginStart="10dp"
        android:padding="2dp"
        android:src="@drawable/ic_at"
        android:tint="@color/iconCoverDark"
        android:tintMode="multiply"/>

    <ImageView
        android:id="@+id/image_btn_comment_send"
        android:layout_width="25dp"
        android:layout_height="25dp"
        android:layout_below="@id/edit_comment"
        android:layout_alignParentEnd="true"
        android:layout_marginEnd="10dp"
        android:layout_marginBottom="10dp"
        android:src="@drawable/ic_send"
        android:tint="@color/iconCover"
        android:tintMode="multiply"/>
</RelativeLayout>
```

### 3. DialogFragment 逻辑代码

关于 DialogFragment 用法，网上搜一下就有很多了。首先必须要实现的是 onCreateView() 或者是 onCreateDialog() 方法，这里比较核心的应该就是布局的位置了，因为 DialogFragment 默认布局是常见的 Dialog 样式，这里需要手动设置：

``` java
// CommentDialogFragment.java

public class CommentDialogFragment extends DialogFragment implements View.OnClickListener{

    private Dialog mDialog;
    private EditText commentEditText;
    private ImageView photoButton;
    private ImageView atButton;
    private ImageView sendButton;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        // 自定义 style BottomDialog
        mDialog = new Dialog(getActivity(), R.style.BottomDialog);

        mDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        mDialog.setContentView(R.layout.dialog_fragment_comment_layout);

        // 外部点击设置为可以取消
        mDialog.setCanceledOnTouchOutside(true);

        Window window = mDialog.getWindow();
        WindowManager.LayoutParams layoutParams = window.getAttributes();

        // 布局属性位于整个窗口底部
        layoutParams.gravity = Gravity.BOTTOM;

        // 布局属性宽度填充满整个窗口宽度，默认是有 margin 值的
        layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
        window.setAttributes(layoutParams);

        commentEditText = (EditText) mDialog.findViewById(R.id.edit_comment);
        photoButton = (ImageView) mDialog.findViewById(R.id.image_btn_photo);
        atButton = (ImageView) mDialog.findViewById(R.id.image_btn_at);
        sendButton = (ImageView) mDialog.findViewById(R.id.image_btn_comment_send);

        photoButton.setOnClickListener(this);
        atButton.setOnClickListener(this);
        sendButton.setOnClickListener(this);

        return mDialog;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.image_btn_photo:
                Toast.makeText(getActivity(), "Pick photo Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_at:
                Toast.makeText(getActivity(), "Pick people you want to at Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_comment_send:
                Toast.makeText(getActivity(), commentEditText.getText().toString(), Toast.LENGTH_SHORT).show();
                dismiss();
                break;
            default:
                break;
        }
    }
}
```

自定义的 BottomDialog style：

``` xml
<!-- styles.xml -->

<resources>

    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        ...
    </style>

    <style name="BottomDialog" parent="@style/AppTheme">
        <item name="android:layout_width">match_parent</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:windowIsFloating">true</item>
    </style>
</resources>
```

### 4. MainActivity 逻辑代码

此时只需要为评论条添加监听器，响应 DialogFragment 的呼出即可：

``` java
// MainActivity.java

public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    private TextView commentFakeButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        commentFakeButton = (TextView) findViewById(R.id.tv_comment_fake_button);
        commentFakeButton.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_comment_fake_button:
                CommentDialogFragment commentDialogFragment = new CommentDialogFragment();
                commentDialogFragment.show(getFragmentManager(), "CommentDialogFragment");
                break;
            default:
                break;
        }
    }
}
```

此时，运行程序，大体上是没问题了，接下来就需要实现它的一些小 Feature，一个是评论文本内容填充，一个是评论框文本输入监听，控制评论提交按钮的状态。

### 5. 评论文本内容填充

这里第一反应可能是普通 Activity 与 Fragment 间的通信，之后在网上看文章时，学习到回调这种用法，也是第一次比较深入地去理解回调这门艺术，不得不说，回调真是个好东西。接下来我们就来看看怎么用回调来实现这一个 Feature。

首先需要定义一个接口：

``` java
// DialogFragmentDataCallback.java

public interface DialogFragmentDataCallback {

    String getCommentText();

    void setCommentText(String commentTextTemp);
}
```

代码很简单，这里比较好的理解方式是，一个类实现这个接口，那么就必须重写这两个方法，而 get 方法，可以看作是提供给外部类调用，用来获取这个类的一些数据，而 set 方法，可看作是外部类用来回调操作此类的一个暴露的方法。那接下来就让 MainActivity 实现这个接口：

``` java
// MainActivity.java

public class MainActivity extends AppCompatActivity implements View.OnClickListener, DialogFragmentDataCallback{

    private TextView commentFakeButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        commentFakeButton = (TextView) findViewById(R.id.tv_comment_fake_button);
        commentFakeButton.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_comment_fake_button:
                CommentDialogFragment commentDialogFragment = new CommentDialogFragment();
                commentDialogFragment.show(getFragmentManager(), "CommentDialogFragment");
                break;
            default:
                break;
        }
    }

    @Override
    public String getCommentText() {
        // 提供给外部类获取本类中数据的方法，这里就是用于获取评论条的文本，将其返回给外部类就可以
        return commentFakeButton.getText().toString();
    }

    @Override
    public void setCommentText(String commentTextTemp) {
        // 提供给外部类用来回调设置评论条文本内容的方法
        commentFakeButton.setText(commentTextTemp);
    }
}
```

接着在 CommentDialogFragment 中实现文本的填充：

``` java
// CommentDialogFragment.java

public class CommentDialogFragment extends DialogFragment implements View.OnClickListener{

    private Dialog mDialog;
    private EditText commentEditText;
    private ImageView photoButton;
    private ImageView atButton;
    private ImageView sendButton;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        mDialog = new Dialog(getActivity(), R.style.BottomDialog);
        mDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        mDialog.setContentView(R.layout.dialog_fragment_comment_layout);
        mDialog.setCanceledOnTouchOutside(true);

        Window window = mDialog.getWindow();
        WindowManager.LayoutParams layoutParams = window.getAttributes();
        layoutParams.gravity = Gravity.BOTTOM;
        layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
        window.setAttributes(layoutParams);

        commentEditText = (EditText) mDialog.findViewById(R.id.edit_comment);
        photoButton = (ImageView) mDialog.findViewById(R.id.image_btn_photo);
        atButton = (ImageView) mDialog.findViewById(R.id.image_btn_at);
        sendButton = (ImageView) mDialog.findViewById(R.id.image_btn_comment_send);

        // 填充文本方法
        fillEditText();

        photoButton.setOnClickListener(this);
        atButton.setOnClickListener(this);
        sendButton.setOnClickListener(this);

        return mDialog;
    }

    private void fillEditText() {

        // 获取 MainActivity 实例并转型为 DialogFragmentDataCallback 接口
        dataCallback = (DialogFragmentDataCallback) getActivity();
        // 回调获取评论条文本内容并填充至输入框中
        commentEditText.setText(dataCallback.getCommentText());
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.image_btn_photo:
                Toast.makeText(getActivity(), "Pick photo Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_at:
                Toast.makeText(getActivity(), "Pick people you want to at Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_comment_send:
                Toast.makeText(getActivity(), commentEditText.getText().toString(), Toast.LENGTH_SHORT).show();

                // 提交成功后 ( 根据具体需求一般为网络请求发送评论 ) 清空评论框， 重写 onDismiss，使评论框文本内容填充回评论条，这里提交后就设为空
                commentEditText.setText("");
                dismiss();
                break;
            default:
                break;
        }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {

        // 重写 onDismiss，将评论框文本填充回评论条
        dataCallback.setCommentText(commentEditText.getText().toString());
        super.onDismiss(dialog);
    }

    @Override
    public void onCancel(DialogInterface dialog) {

        // 重写 onCancel，将评论框文本填充回评论条，一般是点击外部及返回键所触发
        dataCallback.setCommentText(commentEditText.getText().toString());
        super.onCancel(dialog);
    }
}
```

### 6. 评论框文本输入监听，控制评论提交按钮的状态

这个算是本文比较有趣的一部分，也是自己在实现这个项目效果中碰到坑最多的地方了，让我细细说来。首先是 EditText 的输入监听，使用的是 TextWatcher，当输入的文本字符大于 0 时，将 sendButton 禁用，设置颜色为灰色。

> Tip 2: 在刚进入输入框，未执行动作前，TextWatcher 是无法监听此时状态的

因为刚开始进入输入框时，在还未执行输入动作之前，TextWatcher 无法监听此时的状态，所有方法都得不到调用。所以，在填充文本时，就应该要做一个判断，因为 ImageView 充当 Button 默认设置的是可点击的，所以在文本为空时，需要将发送按钮禁用。

> Tip 3: ImageView 充当 Button，clickable 属性设置无效，应使用 enable 属性

在一开始时，我是试图用 clickable 属性来控制这个 ImageView 假 Button 的点击事件，但却发现这个属性完全失效不起作用。不是说 ImageView 默认是不可点击的吗？那我先在 xml 里设置 clickable 属性为 false 也是没用的，后来经大佬提点，才知道是监听器的原因。为 ImageView 设置 OnClickListener 时，会自动将其属性 clickable 设置为 true，这点请看源码：

``` java
// View.java

/**
 * Register a callback to be invoked when this view is clicked. If this view is not
 * clickable, it becomes clickable.
 *
 * @param l The callback that will run
 *
 * @see #setClickable(boolean)
 */
public void setOnClickListener(@Nullable OnClickListener l) {
    if (!isClickable()) {
        setClickable(true);
    }
    getListenerInfo().mOnClickListener = l;
}
```

既然如此，那就在代码中设置其 enable 属性，将其完全禁用：

``` java
// CommentDialogFragment.java

public class CommentDialogFragment extends DialogFragment implements View.OnClickListener{

    private Dialog mDialog;
    private EditText commentEditText;
    private ImageView photoButton;
    private ImageView atButton;
    private ImageView sendButton;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        mDialog = new Dialog(getActivity(), R.style.BottomDialog);
        mDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        mDialog.setContentView(R.layout.dialog_fragment_comment_layout);
        mDialog.setCanceledOnTouchOutside(true);

        Window window = mDialog.getWindow();
        WindowManager.LayoutParams layoutParams = window.getAttributes();
        layoutParams.gravity = Gravity.BOTTOM;
        layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
        window.setAttributes(layoutParams);

        commentEditText = (EditText) mDialog.findViewById(R.id.edit_comment);
        photoButton = (ImageView) mDialog.findViewById(R.id.image_btn_photo);
        atButton = (ImageView) mDialog.findViewById(R.id.image_btn_at);
        sendButton = (ImageView) mDialog.findViewById(R.id.image_btn_comment_send);

        fillEditText();

        // 为 EditText 设置监听器
        commentEditText.addTextChangedListener(mTextWatcher);

        photoButton.setOnClickListener(this);
        atButton.setOnClickListener(this);
        sendButton.setOnClickListener(this);

        return mDialog;
    }

    private void fillEditText() {
        dataCallback = (DialogFragmentDataCallback) getActivity();
        commentEditText.setText(dataCallback.getCommentText());

        // 若评论条文本内容为空，禁用按钮
        if (dataCallback.getCommentText().length() == 0) {
            sendButton.setEnabled(false);
            sendButton.setColorFilter(ContextCompat.getColor(getActivity(), R.color.iconCover));
        }
    }

    // TextWatcher，主要重写 afterTextChanged 方法
    private TextWatcher mTextWatcher = new TextWatcher() {

        private CharSequence temp;

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            temp = s;
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
        }

        @Override
        public void afterTextChanged(Editable s) {
            // 输入动作触发后，将进行监听，若文本被清空，禁用按钮，反之，则恢复正常
            if (temp.length() > 0) {
                sendButton.setEnabled(true);
                sendButton.setClickable(true);
                sendButton.setColorFilter(ContextCompat.getColor(getActivity(), R.color.colorAccent));
            } else {
                sendButton.setEnabled(false);
                sendButton.setColorFilter(ContextCompat.getColor(getActivity(), R.color.iconCover));
            }
        }
    };

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.image_btn_photo:
                Toast.makeText(getActivity(), "Pick photo Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_at:
                Toast.makeText(getActivity(), "Pick people you want to at Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_comment_send:
                Toast.makeText(getActivity(), commentEditText.getText().toString(), Toast.LENGTH_SHORT).show();
                commentEditText.setText("");
                dismiss();
                break;
            default:
                break;
        }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        dataCallback.setCommentText(commentEditText.getText().toString());
        super.onDismiss(dialog);
    }

    @Override
    public void onCancel(DialogInterface dialog) {
        dataCallback.setCommentText(commentEditText.getText().toString());
        super.onCancel(dialog);
    }
}
```

### 7. 在弹出评论框时呼出软键盘

关于软键盘的呼出问题，也是一个比较头疼的问题，自己也碰到了比较多坑，网上的解决方案比较多，也比较多没有用 :) 。文末有推荐几篇比较优秀的文章可供参考。

> Tip 4: 在给 EditText 获取焦点 (requestFocus() 方法) 之前，需设置 setFocusable 和 setFocusableInTouchMode 为 true

高中毕业，买了第一部手机，Meizu MX4，今天我才发现真的是买对了。且不说 Flyme 基于 bug，就 MX4 这款变态的占屏比，真可谓是 Android 开发人员必备的调试机。

![haixiu.jpg](https://www.z4a.net/images/2017/08/31/haixiu.md.jpg)

第一个要提出的点是：在填充评论条文本内容到评论框后，需要调用 EditText 的 setSelection 方法设置光标位置，不然魅族默认没有光标，也不会有软键盘弹出，我不知道是不是只有我的手机会这样，反正用另一部华为手机就没有这个问题。( 这里有点奇怪的是，为什么国际微博评论框弹出时，光标是置于文本头的，感觉这里很不人性化 )

![buxing.jpg](https://www.z4a.net/images/2017/08/31/buxing.md.jpg)

第二个是软键盘的弹出，之前就是怎么都弹不出来，之后在一篇文章中看到说设置延时是很关键的一步，我试过之后，发现确实如此，可是所有文章都未提到为什么一定要设置延时，唯一说到一点的是说软键盘的加载需要一点时间，当然，我仍然不知道这里为何，这个理由完全不是需要延时的原因啊。延时时间是我手动调试过去的，但发现偶尔还是弹不出来，这里实在是不解，而且不同手机又怎么保证延时时间是正确的？如果你知道这个问题的答案，还请告知，让我学习学习，感激不尽。下面是 CommentDialogFragment 完整的代码：

``` java
// CommentDialogFragment.java

public class CommentDialogFragment extends DialogFragment implements View.OnClickListener{

    private Dialog mDialog;
    private EditText commentEditText;
    private ImageView photoButton;
    private ImageView atButton;
    private ImageView sendButton;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        mDialog = new Dialog(getActivity(), R.style.BottomDialog);
        mDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        mDialog.setContentView(R.layout.dialog_fragment_comment_layout);
        mDialog.setCanceledOnTouchOutside(true);

        Window window = mDialog.getWindow();
        WindowManager.LayoutParams layoutParams = window.getAttributes();
        layoutParams.gravity = Gravity.BOTTOM;
        layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
        window.setAttributes(layoutParams);

        commentEditText = (EditText) mDialog.findViewById(R.id.edit_comment);
        photoButton = (ImageView) mDialog.findViewById(R.id.image_btn_photo);
        atButton = (ImageView) mDialog.findViewById(R.id.image_btn_at);
        sendButton = (ImageView) mDialog.findViewById(R.id.image_btn_comment_send);

        fillEditText();

        // 呼出软键盘方法
        setSoftKeyboard();

        commentEditText.addTextChangedListener(mTextWatcher);
        photoButton.setOnClickListener(this);
        atButton.setOnClickListener(this);
        sendButton.setOnClickListener(this);

        return mDialog;
    }

    private void fillEditText() {
        dataCallback = (DialogFragmentDataCallback) getActivity();
        commentEditText.setText(dataCallback.getCommentText());

        // Write this line for meizu 特别的爱，给特别的你
        commentEditText.setSelection(dataCallback.getCommentText().length());

        if (dataCallback.getCommentText().length() == 0) {
            sendButton.setEnabled(false);
            sendButton.setColorFilter(ContextCompat.getColor(getActivity(), R.color.iconCover));
        }
    }

    private void setSoftKeyboard() {

        // 为 EditText 获取焦点
        commentEditText.setFocusable(true);
        commentEditText.setFocusableInTouchMode(true);
        commentEditText.requestFocus();

        // TODO: 17-8-11 为何这里要延时才能弹出软键盘, 延时时长又如何判断？ 目前是手动调试
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                inputMethodManager.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
            }
        }, 110);
    }

    private TextWatcher mTextWatcher = new TextWatcher() {

        private CharSequence temp;

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            temp = s;
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
        }

        @Override
        public void afterTextChanged(Editable s) {
            if (temp.length() > 0) {
                sendButton.setEnabled(true);
                sendButton.setClickable(true);
                sendButton.setColorFilter(ContextCompat.getColor(getActivity(), R.color.colorAccent));
            } else {
                sendButton.setEnabled(false);
                sendButton.setColorFilter(ContextCompat.getColor(getActivity(), R.color.iconCover));
            }
        }
    };

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.image_btn_photo:
                Toast.makeText(getActivity(), "Pick photo Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_at:
                Toast.makeText(getActivity(), "Pick people you want to at Activity", Toast.LENGTH_SHORT).show();
                break;
            case R.id.image_btn_comment_send:
                Toast.makeText(getActivity(), commentEditText.getText().toString(), Toast.LENGTH_SHORT).show();
                commentEditText.setText("");
                dismiss();
                break;
            default:
                break;
        }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        dataCallback.setCommentText(commentEditText.getText().toString());
        super.onDismiss(dialog);
    }

    @Override
    public void onCancel(DialogInterface dialog) {
        dataCallback.setCommentText(commentEditText.getText().toString());
        super.onCancel(dialog);
    }
}
```

## 写在最后

本文项目完整代码已提交到 GitHub 上，如有需要，请自取。[PureComment 项目链接](https://github.com/showzeng/PureComment)

本文到这里差不多就结束了，感谢阅读。关于字数限制和输入字符数量提示，这个在 TextWatcher 里监听就可以实现了，因为自己项目中评论并没有字数限制，所以这里没有写这个部分，不过相信讲到这里，自己去实现也是很简单的啦！可参考下面给出的参考文档。

最后，如果你有更好的实现方法或者什么建议，欢迎联系，一起讨论交流。Thank you and have a nice day!

## 扩展阅读，参考文档

[Android 官方推荐 : DialogFragment 创建对话框](http://blog.csdn.net/lmj623565791/article/details/37815413)

[DialogFragment 实现底部弹窗](http://www.jianshu.com/p/3d045ee00880)

[DialogFragment 生命周期简介](http://www.jianshu.com/p/049082539e1b)

[知乎：回调函数（callback）是什么？](https://www.zhihu.com/question/19801131)

[onTextChanged 参数解释及实现 EditText 字数监听](http://www.picksomething.cn/?p=34)

[Android 软键盘隐藏寻找最优解](http://www.jianshu.com/p/b2401ae0ee92?utm_campaign=haruki&utm_content=note&utm_medium=reader_share&utm_source=weixin)
