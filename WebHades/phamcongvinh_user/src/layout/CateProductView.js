import React, { useEffect, useState } from 'react'
import { CateService } from '../Api';
import CateProduct from './CateProduct';

function CateProductView() {
    const [data, setData] = useState([]);
    const fetch = () => {



        CateService.getListId()
            .then(response => {
                console.log('Response from API:', response); // In ra phản hồi
                if (response) {
                    setData(response.categorys);

                } else {
                    console.error("Invalid response format:", response);

                }
            })
            .catch(error => {
                console.error("Get related products error:", error);

            });
    };
    useEffect(() => {
        fetch();
    }, []);
    return (
        <div>
            {data.map((data) => {
                return (
                    <div>
                        <h1 className="text-2xl font-bold my-10 mx-5 place-self-center md:place-self-start">Product {data.name}</h1>
                        <CateProduct id={data.id} />
                    </div>

                )
            })}

        </div>
    )
}

export default CateProductView
