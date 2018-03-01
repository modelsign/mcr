数据落地
---

考虑到数据(二进制文件)存储日后的方案升级, 拟将数据文件的存储于模型空间索引过程解耦.

即系统内对模型资源的认知仅仅是一个对象引用. 数据本身可以存储在扁平的oss中.

系统内针对这些`对象引用`建立特殊的数据对象, 实现简单(无视模型自身内部几何)的空间索引功能. 


举例说明, 我们有三个建筑物模型

>坐标采用横轴墨卡托投影, 方便平铺到网格

1. 工厂   位于 Point(1, 1)
2. 医院   位于 Point(1, 10)
3. 学校   位于 Point(20, 20)


拆分成两个对象, 文件资源, 和空间位置

>object-source 表, 保存文件引用

|id|name|source|
|---|---|---|
|0|工厂|//cdn.abc.com/10001|
|1|医院|//cdn.abc.com/10002|
|2|学校|//cdn.abc.com/10003|


>object-location

|id|object|location|space|grid|
|---|---|---|---|---|
|0|object_id|Point(1, 1)|space_id|grid_id|
|1|object_id|Point(1, 10)|space_id|grid_id|
|2|object_id|Point(20, 20)|space_id|grid_id|


location 即模型文件自身坐标系的原点所在世界坐标系中的位置

space 指该条记录是在具体描述哪一个模型空间, `空间`是一个业务概念. 指代一个用户创建出来存放 __模型引用__ 的坐标系.

可见, `object-location`表的记录数量与`object-source`表并不相等. 因为 __一个模型数据源可以在多个空间中被引用__

>space

|id|name|creator|owner|
|---|---|---|---|
|0|虚拟城市地图|user_id|user_id|
|1|水分子结构|user_id|user_id|
|2|膨胀螺丝设计模型|user_id|user_id|
|3|别墅分层户型|user_id|user_id|






落地数据
---
