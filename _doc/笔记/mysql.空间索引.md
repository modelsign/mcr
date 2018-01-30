
查询例子
---

```sql
select id, AsText(location) FROM space_0
where MBRContains(GeomFromText('Polygon((0 0,5 0,5 5,0 5,0 0))'),location)
```

# 构造函数

## 点

Point(x,y)

GeomFromText('Point(x y)'')

## 面

注意闭合

GeomFromText('Polygon((x0 y0,x1 y1,x2 y2,x3 y3,x0 y0))'))

# 查询条件

## 包含在区域中

st_contains(polygon,geo)

## 计算两个几何对象的距离的距离

st_distance(geo,geo) 

