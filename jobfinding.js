export const findjobs = async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);
  const location = data.queryResult.parameters['geo-city'];
  const profession = data.queryResult.parameters.Profession;

  return {
    statusCode: 200,
    body: JSON.stringify({
      "fulfillmentMessages": [
        {
          "text": {
            "text": [
              `Contoh pekerjaan dari serverless API: \n1. Kerja A - CP 08xx \n2. Kerja B - CP 08xx \n3. Kerja B - CP 08xx \n\nFilter diterima: Lokasi-${location}; Profesi-${profession};`
            ]
          }
        }
      ]
    }),
  };
};