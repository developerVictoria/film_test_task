# Project Setup Guide

This is instruction to set up the project using Docker containers for PostgreSQL and Redis. 
Scripts were actively tested on Linux machine, therefore the instruction will include linux commands and advised to be used with such.

## Prerequisites

- Linux operating system (Ubuntu tested)
- Docker installed
- Git installed
- Node installed
- 
## Initial Setup

1. Clone the repository to your local machine

2.In case you use Ubuntu, you might have issue with permisions on the folder if you are not its creator/owner.
In that case to give you all right for the folder:
```bash
sudo chmod -R 777 project-folder-name
```
3.After we enter the project folder:
```bash
cd project-folder-name
```
## PostgreSQL Setup

1.First we need to build the container for postgreSQL. For this we first need to enter folder DB:
```bash
cd DB
```

2.Then we need to build our container:
```bash
sudo docker build -t my-postgres-db ./
```

3.After container is build we need to run it:
```bash
sudo docker run -d my-postgres-db
```

4. Now that we waited minute or so and our container is running, we need to restore dvdrental db in it.
We'll use the restore script placed in the same folder:

   a. Give exec permissionsto the script:
   ```bash
   sudo chmod +x restore.sh
   ```

   b. After you need to get your container id: Use this command and look for the conatiner named my-postgres-db:
   ```bash
   sudo docker ps -a
   ```
   Look for the container named `my-postgres-db`

   c. After we can do this to run the restore script:
   ```bash
   ./restore.sh container_id
   ```

   **Important**: Here we'll not only restoring the dvdrental base, we also getting IP of our container, as depending on the machine it might differ,
so we'll need it later for the set up. 
Without IP it won't work properly the docker depending on the operating system host containers differently(as well as posible presence of local postgreSQL on your machine)



After DB is restored, take the CONTAINER IP that script echo'ed erlier in the restoration process
and go to the next step:

5. Configure the database connection:
   - Open `database.js`
   - Replace the host value with your container's IP address (look for the line with comment)
   - Don't forget to hit save

## Redis Setup

1. Now we need to build the container for local Redis. For this we first need to enter folder Redis:
```bash
cd ./Redis
```

2. then we need to build our container:
```bash
sudo docker build -t redis-local .
```

3. Run the Redis container:
```bash
sudo docker run -d \
  --name redis-local \
  -p 6379:6379 \
  -v redis-data:/data \
  redis-local
```

4. After few moments our Redis is ready for the use, So now we can go back to the root folder:
```bash
cd ./
```

## Project Setup and Running

1. Install dependencies:
```bash
npm i
```

2. Make sure that your containers are running and then:

3. Start the project:
```bash
node index.js
```

## Usage Notes
Now that project is running, we can send requests to the next url.
To query the name that contains multiple words, use an underscore between them:
```
http://localhost:5000/films/film_name
```
