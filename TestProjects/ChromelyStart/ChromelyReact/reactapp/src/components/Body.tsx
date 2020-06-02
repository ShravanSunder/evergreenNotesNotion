import React, {useState} from 'react';
import { Button, Paper, Typography } from '@material-ui/core/';
import superagent from 'superagent';

///


export const Body: React.FC = () => {
    const [text, setText] = useState('');

    async function callSearchApi () : Promise<any>  {
        const get = superagent
            .get('http://trak-chromely.com' + '/search/spotify3')
            .set('Accept', 'application/json')
            .withCredentials();
        const response = await get;
    }

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