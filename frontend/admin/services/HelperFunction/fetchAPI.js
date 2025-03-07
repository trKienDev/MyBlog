import config3 from '../config.js';

export async function getValueFromId(id, method, value) {
      try {
            const response = await fetch(`${config3.domain}${config3.endpoints[method]}/${id}`) ;
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const object = await response.json();
            if (object.hasOwnProperty(value)) {
                  return object[value]; 
            } else {
                  throw new Error(`Property '${value}' không tồn tại trong object`);
            }
      } catch(error) {
            console.error("error in getValueFromId - fetchAPI.js: ", error);
      }
}