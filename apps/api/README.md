<p align="center">
  <img width="200" height="200" alt="Moon" src="https://github.com/user-attachments/assets/e38843c0-22dd-4dbc-985e-eab77277acc4" />
</p>

<h1 align="center">MoonCode API</h1>
<p align="center">The API for the MoonCode app<br/>
<a href="https://mooncode-api.fly.dev">mooncode-api.fly.dev</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.0.1-yellow">  
  <img src="https://img.shields.io/badge/LICENSE-MIT-blue">
</p>

## Description
This project is the API used to power the other main packages in the monorepo: `dashboard` and `vscode-extension`.
It is built on top of [Nestjs](https://nestjs.com/) and powered [trpc](https://trpc.io/).

## Project setup

To run the API, you need to first clone the repository 
``` bash
git clone https://github.com/Friedrich482/mooncode-monorepo.git
```
Then `cd` in the API

```bash
cd apps/api
```
Then install dependencies

```bash
npm install
```
Before continuing you'll need some environment variables: `JWT_TOKEN` and `DATABASE_URL`.

### Environment variables
- `DATABASE_URL`, you can use:

  ```bash
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mooncode"
  ```
  
  [compose.yaml](./compose.yaml)
  
  (Local database set up by docker compose as a docker volume. If you don't have docker installed, follow that link to the installation: [Docker](https://docs.docker.com/get-started/get-docker/))

- `JWT_TOKEN`: you need to generate a SSH Key and get the fingerprint.

  ```bash
  ssh-keygen -t rsa -b 4096
  ```

## Compile and run the project

Compile : 

```bash
npm run build
```
Then start:

```bash
npm run start:prod
```

## Deployment

The API is currently deployed on [fly.io](https://fly.io).

## Dockerisation

To dockerize the application, you need to place yourself at the root of the monorepo, then

```bash
docker build -f apps/api/Dockerfile -t mooncode-api --progress=plain .
```
And to run a container called `mooncode-api-container`: 

```bash
docker run -p 3000:3000 --name mooncode-api-container mooncode-api
```

## License

[MIT](/LICENSE) License &copy; 2025
