import axios from "axios";

export function getBackend() {
  return axios
    .get(`http://192.168.1.209:4000`)
    .then(function(response) {
      // handle success
      console.log("response : ", response.data.message);
    })
    .catch(function(error) {
      // handle error
      console.log("error : ", error);
    });
}
