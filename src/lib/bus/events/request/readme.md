关于请求消息
---

这是一类特殊的消息, 用于发出一个指向控制器某种操作的请求.

请求不一定会被处理.


# 使用场景

当某个模块想要使某控制器完成某动作, 却又不具有该控制器的对象引用时.
可向消息总线抛一个指定类型的消息.
 
控制器实例自己订阅了该类型消息, 可自行决定是否响应.
