
// export const BASE_URL = "http://localhost:4000/";

import socketIOClient from "socket.io-client";

// export const BASE_URL = "https://kaps-api.purposeblacketh.com/";

export const BASE_URL = "https://kaps-server-5bru.onrender.com/";



export const socket = socketIOClient(BASE_URL);



  