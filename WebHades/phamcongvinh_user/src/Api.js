import axios from "axios";

const Api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    // timeout: 1000,
    // headers: { 'X-Custom-Header': 'foobar' }
});

// User authentication and information services
export const login = async (username, password) => {
    try {
        const response = await Api.post('login', {
            username,
            password
        });
        return response;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error("Failed to login. Please check your credentials.");
    }
};

export const getUserInfo = async (id, token) => {
    try {
        const response = await Api.get(`user/show/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.user;
    } catch (error) {
        console.error("Get user info error:", error);
        throw new Error("Failed to retrieve user information.");
    }
};

// Interceptor to handle response globally
Api.interceptors.response.use(
    async function (response) {
        return await response.data;
    },
    function (error) {
        console.error("API error:", error);
        return Promise.reject(error);
    }
);

// Product services
export const ProductService = {
    getList: async () => {
        try {
            const response = await Api.get('product');
            return response;  // Trả về dữ liệu từ response
        } catch (error) {
            console.error("Get product list error:", error);
            throw new Error("Failed to fetch product list.");
        }
    },
    getNew: async (offset = 0) => { // Thêm tham số offset và limit
        try {
            const response = await Api.get(`product/getnew?offset=${offset}`);
            return response;
        } catch (error) {
            console.error("Get new products error:", error);
            throw new Error("Failed to fetch new products.");
        }
    },
    getRelatedProducts: async (categoryId, currentProductId, offset = 0) => {
        try {
            // Gửi offset trong query params
            const response = await Api.get(`product/${categoryId}/related/${currentProductId}?offset=${offset}`
            );
            return response;  // Trả về dữ liệu từ response
        } catch (error) {
            console.error("Get related products error:", error);
            throw new Error("Failed to fetch related products.");
        }
    },
    getProductsByCategoryId: async (categoryId, offset = 0) => {
        try {
            // Gửi offset trong query params
            const response = await Api.get(`product/category/${categoryId}?offset=${offset}`
            );
            return response;  // Trả về dữ liệu từ response
        } catch (error) {
            console.error("Get related products error:", error);
            throw new Error("Failed to fetch related products.");
        }
    }
};

// Category services
export const CateService = {
    getList: async () => {
        try {
            const response = await Api.get('category');
            return response;
        } catch (error) {
            console.error("Get category list error:", error);
            throw new Error("Failed to fetch category list.");
        }
    },
    getListId: async () => {
        try {
            const response = await Api.get('category/listid');
            return response;
        } catch (error) {
            console.error("Get category list error:", error);
            throw new Error("Failed to fetch category list.");
        }
    },
    getId: async (id) => {
        try {
            const response = await Api.get(`product/showIdCate/${id}`);
            return response;
        } catch (error) {
            console.error(`Get products by category ID ${id} error:`, error);
            throw new Error("Failed to fetch products for the selected category.");
        }
    },
    getMultipleIds: async (ids) => {
        try {
            const response = await Api.get('product/showIdCates', {
                params: { ids } // Query parameter for multiple category IDs
            });
            return response;
        } catch (error) {
            console.error("Get multiple categories by IDs error:", error);
            throw new Error("Failed to fetch products for the selected categories.");
        }
    },
};

// Product sales services
export const ProductSaleService = {
    getList: async () => {
        try {
            const response = await Api.get('productsalefe');
            return response;
        } catch (error) {
            console.error("Get product sale list error:", error);
            throw new Error("Failed to fetch product sales list.");
        }
    },
    getNew: async (offset = 0, limit = 4) => { // Thêm tham số offset và limit
        try {
            const response = await Api.get(`product/getnew?offset=${offset}&limit=${limit}`);
            return response;
        } catch (error) {
            console.error("Get new products error:", error);
            throw new Error("Failed to fetch new products.");
        }
    },
    getBestSeal: async () => {
        try {
            const response = await Api.get('orderdetail/bestseal');
            return response;
        } catch (error) {
            console.error("Get best-selling products error:", error);
            throw new Error("Failed to fetch best-selling products.");
        }
    }
};

export const BrandService = {
    getList: async () => {
        try {
            const response = await Api.get('brand');
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch banner list.");
        }
    },
}
export const BannerService = {
    getList: async () => {
        try {
            const response = await Api.get('banner');
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch banner list.");
        }
    },
}
export const MenuService = {
    getList: async () => {
        try {
            const response = await Api.get('menu/indexUser');
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch menu list.");
        }
    },
}

export const StoreLocationsService = {
    getList: async () => {
        try {
            const response = await Api.get('storeLocations');
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch storeLocations list.");
        }
    },
}

export const PoliciesService = {
    getList: async () => {
        try {
            const response = await Api.get('policies');
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch policies list.");
        }
    },
}

export const ContactinfoService = {
    getList: async () => {
        try {
            const response = await Api.get('contactinfo');
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch contactinfo list.");
        }
    },
}
export const UserService = {
    getId: async (id) => {
        try {
            const response = await Api.get(`user/show/${id}`);
            return response;
        } catch (error) {
            console.error(`Get user by  ${id} error:`, error);
            throw new Error("Failed to fetch user for the selected category.");
        }
    },
    register: async (userData) => {
        try {
            const response = await Api.post('register', userData);
            return response;
        } catch (error) {
            console.error("Register error:", error);
            throw new Error("Failed to register. Please check your information.");
        }
    },
}

//http://127.0.0.1:8000/api/order/user/15/products
export const OrderService = {
    createOrder: async (orderData) => {
        try {
            const response = await Api.post('order/add', orderData);
            return response;
        } catch (error) {
            console.error("Create order error:", error);
            throw new Error("Failed to create order.");
        }
    },
    getList: async (id) => {
        try {
            const response = await Api.get(`order/user/${id}/products`);
            return response;
        } catch (error) {
            console.error("Create order error:", error);
            throw new Error("Failed to create order.");
        }
    },
}
export const PostHomeService = {
    getList: async () => {
        try {
            const response = await Api.get('posthome/fontend');
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch contactinfo list.");
        }
    },
}
export const CommentService = {
    comment: async ({ product_id, user_id, conten, image }) => {
        try {
            const formData = new FormData();
            formData.append('product_id', product_id);
            formData.append('user_id', user_id);
            formData.append('conten', conten);
            if (image) {
                formData.append('image', image);
            }

            const response = await Api.post('comment/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error("Comment submission error:", error);
            throw new Error("Failed to submit comment.");
        }
    },
    getList: async (id) => {
        try {
            const response = await Api.get(`comment/${id}`);
            return response;
        } catch (error) {
            console.error("Get banner list error:", error);
            throw new Error("Failed to fetch contactinfo list.");
        }
    },

};




export default Api;
