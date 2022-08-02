import { NextApiRequest, NextApiResponse } from 'next';
import { IProduct } from '../../../interfaces/products';

type Data= |{
message: string;
}|IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
    case 'GET':
      return getSlug(req, res);
    default:
        return res.status(404).json({message:`Método ${req.method} no permitido`})
}

const getSlug = async( req: NextApiRequest, res: NextApiResponse<Data>)=>{

}