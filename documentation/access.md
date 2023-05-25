# /api/access/create 

## body 
{
    name: String,
    course: float,
    min: float,
    max: float,
    access: {
        admin: boolean,
        make: boolean,
        take: booleat
    }
}

## responce

{
    accessToken: String, 
    privateToken: String
}

