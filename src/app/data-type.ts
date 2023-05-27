export interface SignUp{
    fName:string,
    lName:string,
    password:string,
    email:string
}

export interface Login{
    email:string,
    password:string
}

export interface product{
    name:string,
    price:string,
    color:string,
    category:string,
    description:string,
    image:string,
    quantity: undefined | number,
    id:number,
    productId:undefined | number
}

export interface cart{
    name:string,
    price:string,
    color:string,
    category:string,
    description:string,
    image:string,
    quantity: undefined | number,
    id:number | undefined,
    userId:number,
    productId:number
}