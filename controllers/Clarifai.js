const setUpClarifai = (imageUrl) => {
    const PAT = 'ea4afa27cda544ab865dbfe511104e32';
    const USER_ID = 'esanchez2898';
    const APP_ID = 'my-first-application-even1a';
    //const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions
}

module.exports = setUpClarifai;