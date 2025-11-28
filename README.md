# Fast-feet

Fast-feet is an application made in NodeJs for a fictitious transport company, implementing the possibility of registration and authentication of delivery and customer users, as well as orders and their tracking throughout the delivery process.  
It has academic purposes, and is the last challenge of NodeJs track of Rocketseat.    

[![Using](https://skillicons.dev/icons?i=nodejs,typescript,nest,vitest&perline=4)](https://skillicons.dev)

## Installation

Use the package manager [pnpm](https://pnpm.io/pt/) to install all the packages.

```bash
pnpm install
```
After installing Docker, use the following command to up the Postgres database container. A Redis database will also go up.   
(you can change the username and password in the .yml file)

```bash
docker-compose up -d
```
Then construct the .env database url like this: **postgresql://username:password@localhost:5432/fast-feet?schema=public**

Generate private and public keys for Jwt using the following commands on Windows git bash:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```
```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```
And then search for a base64 encoder, convert them and put in the respective fields in .env.

Create a R2 Bucket Storage on Cloudfare, and get the following informations fot .env at the end of the process:
- CLOUDFLARE_ACCOUNT_ID;
- AWS_BUCKET_NAME;
- AWS_ACCESS_KEY_ID;
- AWS_SECRET_ACCESS_KEY;

***

## Routes

Some of the available routes:

| | |
| --- | --- |
| ``(POST) /session`` | for authenticate |
| ``(POST) /user`` | to register a user |
| ``(GET) /user`` | to list all users |
| ``(POST) /order`` | to create an order |
| ``(PUT) /order/status/:orderId`` | to change the status of an order |
| ``(DELETE) /orders/:orderId`` | to delete an order |
| ``(POST) /recipient`` | to create a customer |


## Usage

To run the application:

```bash
npm run start
```

\*Talvez seja necessário adicionar "type":"module" no package.json, para os testes.

To run unit tests:

```bash
npm run test
```

To run E2E tests:

```bash
npm run test:e2e
```

## License

[MIT](https://choosealicense.com/licenses/mit/)