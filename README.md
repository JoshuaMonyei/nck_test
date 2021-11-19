## CRUD-App

A simple express application that: Connects to a database, Creates a payload and can get, update and delete the data created.

https://zuricrud-app.herokuapp.com/

## API Reference

#### Create a new inventory in the database

```http
  POST /https://zuricrud-app.herokuapp.com/inventorys
```

| Parameter                        | Type     | Description                                        |
| :------------------------------- | :------- | :------------------------------------------------- |
| `req.body{name, price, quantity}` | `string` | **Required**. name, price and quantity of inventory |

#### Get all inventorys in the database

```http
  GET /https://zuricrud-app.herokuapp.com/inventorys
```

| Parameter | Type    | Description                                 |
| :-------- | :------ | :------------------------------------------ |
| `null`    | `query` | Gets a list of inventorys that match filter |

#### Fetch a single inventory attributes.

```http
  GET /https://zuricrud-app.herokuapp.com/:${inventoryId}
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of inventory to fetch |

#### Update values of an inventory already in the database

```http
  PUT /https://zuricrud-app.herokuapp.com/:${inventoryId}
```

| Parameter | Type     | Description                                                                    |
| :-------- | :------- | :----------------------------------------------------------------------------- |
| `id`      | `string` | **Required**. value of name,email and country of inventory you wish to update. |

#### Delete values of an inventory already in the database

```http
  DELETE /https://zuricrud-app.herokuapp.com/:${inventoryId}
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. Id of inventory to Delete |
