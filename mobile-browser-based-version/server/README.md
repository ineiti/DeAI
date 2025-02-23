## Servers

### Helper server for federated and decentralized training

This directory contains the helper server providing the APIs used by the decentralized and federated learning available in `epfml/deai`.
For federated learning, the helper server receives all weight updates (but never any training data). For decentralized training, the helper server never receives models or data, but helps keeping a list of available tasks, and participants (clients) available for each task, to help peering via `peerjs`.

### Requirements

The server is running as a single ExpressJS app. It mainly requires [Node](https://nodejs.org/en/), [Express](https://expressjs.com/), [PeerServer](https://github.com/peers/peerjs-server) and [Tensorflow](https://www.tensorflow.org/js). All library requirements are included in the `package.json` file.

### Running the server locally

From this folder, you can run the server on localhost:8080 with `npm run dev`. This runs via the `nodemon` package, so it automatically restarts the process after changes.

To automatically restarts the process after changes, the server also supports the `nodemon` package. It can be installed using

### Testing the server locally

To run sever unit testing run `npm run test`. Make sure you are not running a server at the same time as the test suite will run a server to test on. We use [mocha](https://mochajs.org/), [chai](https://www.chaijs.com/) and [supertest](https://github.com/visionmedia/supertest) for testing; respectively they are libraries: unit tests, assertions, and http testing.

### Writing your own tests

Server tests are saved in the `tests/` folder with root as `server/`. All tests with `.ts` extension written in this folder will be tested. To see an example of how to write your own tests have a look at `tests/example.test.ts`. You can use this as a starting template for your own tests!

### Testing the servers before deploying

The server is deployed inside a docker container, thus before deploying it, we can locally test the container to see if any new dependencies work (The container runs a 20.04 Ubuntu server). See [docker guide](https://docs.docker.com/get-started/) if you have not used docker and or need to install it.

To test the server do the following steps:

```
sudo docker build -t deai-server .
```

This builds the docker image, and then run it:

```
sudo docker run -p 8080:8080 deai-server:latest
```

> **⚠ WARNING: Using VPN while running docker**  
> If you are running a, VPN docker might not properly work, e.g. ``http://localhost:8080/`` will result in ``page not found``.

### Deploying the server to the cloud

#### Google App Engine

Google App Engine (GAE) creates an HTTPS certificate automatically, making this the easiest way to deploy the helper server in the Google Cloud Platform.

Since we need to install some required dependencies we deploy using Docker, we do this by choosing:

```
runtime: custom
```

in the `app.yaml` file.

Deployment files:

- `app.yaml` - GAE app config file.
- `Dockerfile` - Docker [commands](https://docs.docker.com/engine/reference/builder/) we specify.
- `.dockerignore` - Files to ignore while building the image, e.g. `node_module/`.

To change the GAE app configuration, you can modify the file `app.yaml`.

To deploy the app on GAE, you can run the following command, where deai-313515 is the current PROJECT-ID:

```
gcloud app deploy --project=deai-313515 app.yaml --version prod
```

:exclamation: Important!
| :exclamation:  This is very important   |
|-----------------------------------------|
When deploying check that in the google cloud console -> app engine -> versions, that no new instance is created as this will increase the cloud costs.
This should not happen in principle due to the "--version dev" flag, it is however a good idea to check this the first time you run this command.

Some useful resources:

- [Docker sample app](https://docs.docker.com/get-started/02_our_app/)
- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#from)
- [GAE sample app](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/deploying-web-service)


#### Docker

In the docker container we specify the environment and what dependencies to install. Perhaps most importantly, once this is this done, we specify:

1. npm run build
2. npm run start

The first line compiles the ts code into js, and the second one then runs the compiled code.

### tsconfig

We specify compiler options as well as what directories to use for ts in the `tsconfig.json`, we [extend](https://www.typescriptlang.org/tsconfig#extends) this config onto `tsconfig.prod.json` where we specify what we want for the production build.

In the `tsconfig` we add the base esm module that we use as well as including the mocha types. In `tsconfig.prod.json` we further specify which source to use for building, specifically ignoring  the `tests/` folder. 

tl;dr: `tsconfig.json` specifies the general setup for ts (including testing), `tsconfig.prod.json` adds production specific commands to `tsconfig.json`.

## DeAI Helper Server, for decentralized training

### Components

#### PeerJS helper server (for decentralized training)

The PeerServer stores the entire list of connected peers, which the peers need to correctly communicate between one another. It centralizes the peer id generation, which is assigned to peers on connection. The server uses an API key, simply set to "api" for convenience (can be easily changed later on). The list of peers is publicly accessible through:

- `/peerjs`: PeerServer home page
- `/peerjs/api/peers`: list of connected peers (id)

#### ML Tasks

The list of ML training tasks available to DeAI clients are provided by this helper server. Their descriptions as well as their deep learning model architectures must be made available to peers, which is achieved via the following routing paths:

- `/tasks`: JSON file containing meta-data (including task id) on all available DeAI training tasks
- `/tasks/task_id/{model.json, weights.bin}`: Tensorflow neural network model files for the given task id (model architecture & initialization weights)

Tasks are stored in `tasks.json`. The models are declared in `models.js`.

#### Creating a new task

Adding a new task server-side can easily be done by following the next steps:

- add an entry to `tasks.json` with the task's parameters
- add a `createModel` function to `models.js` with the task's model architecture and export it

## DeAI Helper Server, for federated training

### Components

#### Server

The federated learning server keeps track of connected clients and weights from each client and communication round. It provides the following endpoints.

- `GET` requests publicly available without prior connection

  - connect client with ID `id` to task `task`
    ```
    URL: /connect/<task>/<id>
    ```
  - disconnect client with ID `id` from task `task`
    ```
    URL: /disconnect/<task>/<id>
    ```
  - access logs containing all training communication history made with the server (see POST requests below)
    ```
    URL: /logs?id=<id>&task=<task>&round=<round>
    ```

- `POST` requests with required prior connection and body `{ id, timestamp, [data]}`, where the client ID and request timestamp are required for logging
  - client sends their individual weights `weights` for communication round `round` and task `task`.
    ```
    URL: /send_weights/<task>/<round>
    Body: { id: String, timestamp: Date, weights: Buffer  }
    ```
  - client receives averaged weights for communication round `round` and task `task`
    ```
    URL: /receive_weights/<task>/<round>
    Body: { id: String, timestamp: Date }
    ```
  - client sends their individual number of data samples `samples` for communication round `round` and task `task`
    ```
    URL: /send_nbsamples/<task>/<round>
    Body: { id: String, timestamp: Date, samples: Number }
    ```
  - client receives the number of data samples per client ID for communication round `round` and task `task`
    ```
    URL: /receive_data_info/<task>/<round>
    Body: { id: String, timestamp: Date }
    ```

#### ML Tasks

The list of ML training tasks available to DeAI clients are provided by this helper server. Their descriptions as well as their deep learning model architectures must be made available to all clients, which is achieved via the following `GET` request routes.

- JSON file containing meta-data (including task id) on all available FeAI training tasks
  ```
  URL: /tasks
  ```
- Tensorflow neural network model files for the given task `task` (model architecture & initialization weights)
  ```
  URL: /tasks/<task>/{model.json, weights.bin}
  ```

Tasks are stored in `tasks.json`. The models are declared in `models.js`.

#### Creating a new task

Adding a new task server-side can easily be done by following the next steps:

- add an entry to `tasks.json` with the task's parameters
- add a `createModel` function to `models.js` with the task's model architecture and export it
