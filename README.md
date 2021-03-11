# Cakes

Keep track of all your favourite cakes with this API. You can find a live version running at https://desolate-everglades-71010.herokuapp.com/cakes.

## Getting Started

1. Clone this repository into a folder of your choice
2. Install required packages with `npm install` or `yarn add`
3. Start the server with `npm start` or `yarn start`

By default the server will run locally on port `4000`

## The API

`GET /cakes` will give you a list of all the cakes in the database

`GET /cakes/:id` will give you the details of the particular cake with `id == :id`

`POST /cakes` will store the details of a new cake in the database

`PUT /cakes/:id` will update the definition of the cake with `id == :id`

`DELETE /cakes/:id` will remove the cake with `id == :id` from the database
