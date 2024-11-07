import React from 'react'
import { Link } from 'react-router-dom'

function RelatedProducts({ data }) {
    console.log("daata", data)
    return (
        <div className="grid grid-cols-4 gap-4">
            {data.map((product, index) => (
                <Link
                    key={`${product.id}-${index}`}
                    to="/detail-product"
                    state={{ product }}
                    className="group border-2 p-2 relative block"
                >
                    <div className="relative overflow-hidden">
                        <img
                            className="transition-opacity duration-500 w-full group-hover:opacity-0"
                            src={product.thumbnail}
                            alt={product.product_name}
                        />
                        <img
                            className="transition-opacity duration-500 w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100"
                            src={product.thumbnail}
                            alt={`${product.product_name} On Hover`}
                        />
                    </div>
                    <div className="mt-2 text-center">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex place-content-between px-5">
                            <p className="text-gray-600">{product.product_sale}$</p>
                            <p className="text-gray-600 line-through">{product.pricebuy}$</p>
                        </div>
                    </div>
                </Link>
            ))}

        </div>
    )
}

export default RelatedProducts
