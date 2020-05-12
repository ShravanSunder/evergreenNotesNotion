import React, {useState} from 'react';
import { Button, Paper, Typography } from '@material-ui/core/';
import bent from 'bent';
const get = bent('json')
import { messageRouterGet } from '../services/Chromely.Service.js'


///


export const Body: React.FC = () => {
    const [text, setText] = useState('');

    async function callSearchApi () : Promise<any>  {
        const get = bent('http://trak-chromely.com', 'GET', 'json', 200);
        const response = await get('/search/spotify3');
    }
    // const callSearchApi = () => {
    //     messageRouterGet('/search/spotify2', {}, setText('jkjjj'), null)
    // }

    return (
        <Paper>
            <Button onClick={callSearchApi}>Call Search</Button>
            <Typography variant="h1" component="h2">{text}
            </Typography>
        </Paper>
    );
}




// messageRouterGet: (url, parameters, callback, _self) => {
//     var request = {
//         "method": "GET",
//         "url": url,
//         "parameters": parameters,
//         "postData": null
//     };
//     window.cefQuery({
//         request: JSON.stringify(request),
//         onSuccess: (response) => {
//             var jsonData = JSON.parse(response);
//             if (jsonData.ReadyState == 4 && jsonData.Status == 200) {
//                 if (callback) callback(jsonData.Data, _self);
//             } else {
//                 console.log("An error occurs during message routing. With ur:" + url + ". Response received:" + response);
//             }
//         },
//         onFailure: (err, msg) => {
//             console.log(err, msg);
//         }
//     });
// }