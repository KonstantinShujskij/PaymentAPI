# /api/admin/refill

## body 
{
    id: String,
    value: {
        usdt: float,
        uah: float
    }
}

# responce 
{
    usdt: float, 
    uah: float
}

---

# /api/admin/set-course

## body 
{
    id: String,
    value: float
}

## responce
{
    id: String
    name: String
    course: float
}

---

# /api/admin/get-makers

## body 
{
    id: String
}

## responce 
[
    {
        id: String,
        name: String,
        balance: {
            usdt: float,
            uah: float
        },
        recive: {
            usdt: float,
            uah: float
        }
    }
]

---

# /api/admin/get-orders

## body 
{
    timeStrat: int,
    timeStop: int,
    partner?: String
}

## responce 
[
    {
        id: String,
        status: String,
        value: float,
        card: String,
        course: float,
        currency: string,
        access: String,
        partner: String,
        maker: String,
        taker?: String,
        create: int,
        update: int
    }
]

---

# /api/admin/get-partners

## body 
{  }

## responce 
[
    {
        id: String,
        name: String,
        course: float
    }
]