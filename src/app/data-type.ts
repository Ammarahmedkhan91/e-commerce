export interface signUp{
    fName:string,
    lName:string,
    password:string,
    email:string
}

export interface login{
    email:string,
    password:string
}

export interface product{
    id:number,
    name:string,
    price:number,
    color:string,
    category:string,
    description:string,
    image:string,
    sellerId: number,
    quantity: undefined | number,
    productId:undefined | number
}

export interface cart{
    id:number | undefined,
    name:string,
    price:number,
    color:string,
    category:string,
    description:string,
    image:string,
    quantity: undefined | number,
    productId:number
    userId:number | undefined,
}

export interface summary {
    price:number,
    discount: number,
    tax: number,
    delivery: number,
    total: number
}

export interface order {
    id: number | undefined,
    email: string,
    address: string,
    contact: string,
    totalPrice: number,
    userId: number | undefined
}