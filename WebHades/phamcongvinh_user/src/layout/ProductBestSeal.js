import React, { useEffect, useState } from 'react'
import { ProductSaleService } from '../Api';
import { Link } from 'react-router-dom';

function ProductBestSeal() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await ProductSaleService.getBestSeal();
                setProducts(response.orderdetail);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategory();
    }, []);

    console.log("prooduct best seal:", products)
    return (
        <div className=' grid '>
            <h1 className=" text-2xl font-bold my-10 mx-5 place-self-center md:place-self-start">{products.length != 0 ? "Product BestSale" : ""}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {products.map((product) => (
                    <Link
                        key={product.id}
                        to="/detail-product"
                        state={{ product }}
                        className="group border-2 p-2 relative block"
                    >
                        <div className="relative overflow-hidden">
                            <img
                                className="transition-opacity duration-500 w-full group-hover:opacity-0"
                                src={product.thumbnail}
                                alt={product.name}
                            />
                            <img
                                className="transition-opacity duration-500 w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100"
                                src={product.thumbnail}
                                alt={`${product.product_name} On Hover`}
                            />
                        </div>

                        <div className="mt-2 text-center">
                            <h3 className="font-semibold">{product.name}</h3>
                            <div className='flex place-content-between px-5'>
                                <p className="text-gray-600 ">{product.pricebuy}$</p>

                            </div>
                        </div>


                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ProductBestSeal
