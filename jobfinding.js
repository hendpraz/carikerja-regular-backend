export const findjobs = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      "fulfillmentMessages": [
        {
          "text": {
            "text": [
              "Example jobs from serverless API: 1 2 3"
            ]
          }
        }
      ]
    }),
  };
};