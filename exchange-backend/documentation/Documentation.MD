# API Documentation

## Add Transaction

**URI:** POST `/transaction`  
**Request Body:**

``` json
{
    "usd_amount": 3,
    "lbp_amount": 29000,
    "usd_to_lbp": 1
}
```

**Response Body:**

``` json
{
    "added_date": "2021-04-06T16:33:31",
    "id": 34,
    "lbp_amount": 29000.0,
    "usd_amount": 3.0,
    "usd_to_lbp": true,
    "user_id": null
}
```

## Get User Transactions

**URI:** GET `/transaction`  
**Request Body:** None  
**Response Body:**

``` json
[
    {
        "added_date": "2021-04-06T16:33:31",
        "id": 34,
        "lbp_amount": 29000.0,
        "usd_amount": 3.0,
        "usd_to_lbp": true,
        "user_id": 5
    },
    {
        "added_date": "2021-04-03T11:26:13",
        "id": 35,
        "lbp_amount": 20000.0,
        "usd_amount": 2.0,
        "usd_to_lbp": false,
        "user_id": 5
    }
]
```

## Get Rates

**URI:** GET `/exchangeRate`  
**Request Body:** None  
**Response Body:**

``` json
{
  "lbp_to_usd": 12500,
  "usd_to_lbp": 12200
}
```

## Get Rates for Graph

**URI:** GET `/exchangeRate/graph?days=10`  
**Request Body:** None  
**Response Body:**

``` json
{
    "buy_rates": [
        [
            13000.0,
            "Tue, 30 Mar 2021 00:00:00 GMT"
        ],
        [
            12400.0,
            "Wed, 31 Mar 2021 00:00:00 GMT"
        ]
    ],
    "sell_rates": [
        [
            11250.0,
            "Tue, 30 Mar 2021 00:00:00 GMT"
        ],
        [
            9666.666666666666,
            "Tue, 06 Apr 2021 00:00:00 GMT"
        ]
    ]
}
```

## Get Rates Insights

**URI:** GET `/exchangeRate/insights?days=10`  
**Request Body:** None  
**Response Body:**

``` json
{
  "biggest_buying_rate": [
    15000,
    "Thu, 18 Mar 2021 00:00:00 GMT"
  ],
  "biggest_selling_rate": [
    14000,
    "Thu, 18 Mar 2021 00:00:00 GMT"
  ],
  "smallest_buying_rate": [
    9500,
    "Fri, 12 Mar 2021 00:00:00 GMT"
  ],
  "smallest_selling_rate": [
    9500,
    "Sun, 07 Mar 2021 00:00:00 GMT"
  ]
}
```

## Get Transactions Insights

**URI:** GET `/transactions/insights?days=10`  
**Request Body:** None  
**Response Body:**

``` json
{
  "buying_transaction_biggest_rate": {
    "added_date": "2021-03-18T17:00:40",
    "id": 18,
    "lbp_amount": 15000,
    "usd_amount": 1,
    "usd_to_lbp": false,
    "user_id": null
  },
  "buying_transaction_smallest_rate": {
    "added_date": "2021-03-12T17:21:49",
    "id": 13,
    "lbp_amount": 18000,
    "usd_amount": 2,
    "usd_to_lbp": false,
    "user_id": null
  },
  "largest_transaction": {
    "added_date": "2021-03-12T17:03:44",
    "id": 3,
    "lbp_amount": 30000,
    "usd_amount": 3,
    "usd_to_lbp": true,
    "user_id": 3
  },
  "selling_transaction_biggest_rate": {
    "added_date": "2021-03-18T17:00:40",
    "id": 17,
    "lbp_amount": 14000,
    "usd_amount": 1,
    "usd_to_lbp": true,
    "user_id": null
  },
  "selling_transaction_smallest_rate": {
    "added_date": "2021-03-20T12:55:19",
    "id": 24,
    "lbp_amount": 12000,
    "usd_amount": 2,
    "usd_to_lbp": true,
    "user_id": null
  }
}
```

## Create User

**URI:** POST `/user`  
**Request Body:**

``` json
{
  "user_name": "Kil",
  "password": "Kun"
}
```

**Response Body:**

``` json
{
    "id": 10,
    "user_name": "Kil"
}
```

## Authenticate User

**URI:** POST `/authentication`  
**Request Body:**

``` json
{
  "user_name": "Kil",
  "password": "Kun"
}
```

**Response Body:**

``` json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9kjrnkjnfko249hfisbm"
}
```

## Get User's Balances

**URI:** GET `/user/balance`  
**Request Body:** None  
**Response Body:**

``` json
{
    "lbp_balance": 10000.0,
    "usd_balance": 1.0
}
```

## Update User's Balances

**URI:** PUT `/user/balance`  
**Request Body:**

``` json
{
    "lbp_amount": 10000,
    "usd_amount": 1,
    "increase": 1
}
```

**Response Body:**

``` json
{
    "lbp_balance": 10000.0,
    "usd_balance": 1.0
}
```

## Add Trade

**URI:** POST `/trades`  
**Request Body:**

``` json
{
    "usd_to_lbp": 1,
    "usd_amount": 1,
    "rate": 13000
}
```

**Response Body:**

``` json
{
    "added_date": "2021-04-25T17:11:47",
    "id": 1,
    "rate": 13000.0,
    "usd_amount": 1.0,
    "usd_to_lbp": true,
    "user_id": 2
}
```

## Get All Trades

**URI:** POST `/trades`  
**Request Body:** None  
**Response Body:**

``` json
[
    {
        "added_date": "2021-04-25T17:11:47",
        "id": 1,
        "rate": 13000.0,
        "usd_amount": 1.0,
        "usd_to_lbp": true,
        "user_id": 2
    }
]
```

## Make Trade

**URI:** POST `/makeTrade`  
**Request Body:**

``` json
{
    "trade_id": 1
}
```

**Response Body:**

``` json
{
    "added_date": "2021-04-25T17:11:47",
    "id": 1,
    "rate": 13000.0,
    "usd_amount": 1.0,
    "usd_to_lbp": true,
    "user_id": 2
}
```

