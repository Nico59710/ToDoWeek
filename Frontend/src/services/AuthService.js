// gestion des etas globaux
import axios from 'axios'
import { jwtDecode } from "jwt-decode";



function isConnected() {
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
            axios.defaults.headers.Authorization = "Bearer " + token
            return true;
        }
    } else {
        return false;
    }
}

function getRole() {
    if (isConnected()) {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        return decodedToken.role;
    }
    return "";
}

function getMail() {
    if (isConnected()) {
        const token = localStorage.getItem("token");
        const decodeToken = jwtDecode(token)
        return decodeToken.email;
    }
    return "";
}
function getUserId() {
    if (isConnected()) {
        const token = localStorage.getItem("token");
        const decodeToken = jwtDecode(token)
        return decodeToken.user_id;
    }
    return "";
}





export default { isConnected, getRole, getMail, getUserId};
