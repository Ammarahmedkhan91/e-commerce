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
    id:number
}