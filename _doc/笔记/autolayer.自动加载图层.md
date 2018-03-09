
```js
{
    meta:{
        count: 4,
        location:{
            x,y,z
        }
    }
    data:[
        {

        }
    ]
}
```


```json
{
    "meta": {
        "corpyright": "Copyright 2018 mSign.",
        "describe": "关于这个空间的描述信息.随便写什么, 这个字段也许取自创建空间时候所提交的备注或者综合信息.",
        "size": 3,
        "capacity": 10,
        "volume": 222
    },
    "data": {
        "type": "space",
        "id": "空间id",
        "attributes": {
            "sid": "空间id",
            "creator": "创建者id",
            "owner": "所有者id",
            "count_object": 1000
        },
        "relationships": {
            "creator": {
                "data": {
                    "type": "user",
                    "uid": "创建者id"
                },
                "links": {
                    "self": "http://api.msign.tech/v1/spaces/{空间id}/relationships/creator",
                    "related": "http://api.msign.tech/v1/spaces/{空间id}/creator"
                }
            },
            "owner": {
                "data": {
                    "type": "user",
                    "uid": "拥有者id"
                },
                "links": {
                    "self": "http://api.msign.tech/v1/spaces/{空间id}/relationships/owner",
                    "related": "http://api.msign.tech/v1/spaces/{空间id}/owner"
                }
            }
        }
    }
}
```
