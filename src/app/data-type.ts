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
    quantity: number | undefined,
    productId: number | undefined,
    sellerId: number | undefined
}

export interface cart{
    id:number | undefined,
    name:string,
    price:number,
    color:string,
    category:string,
    description:string,
    image:string,
    quantity: number | undefined,
    productId:number | undefined
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
    userId: number | undefined,
    productId: number | undefined,
    productName: string | undefined;
    productImage: string | undefined,
    totalPrice: number,
    email: string,
    address: string,
    contact: string,
}