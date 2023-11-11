import axios from "axios";

export default axios.create({
    baseURL: 'https://api.rawg.io/api',
    params: {
        key: 'b519e0d0eec44a6da3b277ce7e6a86fd'
    }
});