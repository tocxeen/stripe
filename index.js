const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
// app.use(require("body-parser").text({ type: "*/*" }));

// const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");
const stripe = Stripe(
  "sk_test_51MPQedDlHNhHxBzNVLUS6HKnVSD1whrPVbeocwbqGXzrd7T2JuYHTSWJmBvuUgOYog1ei9MTRm0hzC1S4W4BjxNg00qwogTB7h"
);

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
const host = 'localhost'
app.post('/payment-sheet', async (req, res, next) => {
   try {
    
       const data = req.body;
       console.log(data)
        const params = {
          email: data.email,
          name: data.name,
       };
       const customer = await stripe.customers.create(params);
    //    console.log(customer.id);

       const ephemeralKey = await stripe.ephemeralKeys.create(
           { customer: customer.id },
           { apiVersion: '2020-08-27' }
       );
       const paymentIntent = await stripe.paymentIntents.create({
           amount: parseInt(data.amount),
           currency: data.currency,
           customer: customer.id,
           automatic_payment_methods: {
               enabled:true,
           }
       });
       const response = {
           paymentIntent: paymentIntent.client_secret,
           ephemeralKey: ephemeralKey.secret,
           customer: customer.id,
       };

       res.status(200).send(response);
   } catch (error) {
    //    console.log(error);
       next(error);

    
   }
});


app.post("/lookup", async function (request, response) {
    const body = request.body;
    try {
    console.log("inside lookup", request.body);
      
    const paymentIntent = await stripe.paymentIntents.confirm(
      "ipi_1GswaK2eZvKYlo2Co7wmNJhD",
      { payment_method: "pm_card_visa" }
    );
  response.sendStatus(200);
      
  } catch (err) {
    // invalid signature
    //   next(err);
        return err;
        // console.log(err)
        
  }

});

app.listen(port, host, () => {
  console.log("Server on :", port);
});