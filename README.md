# easyline-core
### Running Project with Nodejs
Initial setup:
* Make sure you already have installed NodeJS
* You can run the project running the commands below
```$xslt
npm install
npm run start
```
-------

Remember: If you have an application running on port 3000, you'll need change port setting on api.services.js.

### Running eslint
If you want to run lint:
```$xslt
npm run lint
```

### Running database migrations 
* Create your migrations files and run: 
```
npm run migration
```

###Environment Variables
* DB: database name
* DB_USER: database user
* DB_PASSWORD: database password
* DB_HOST: database host

Linux/MacOS:
```$xslt
export DB={{your_db_name}}
export DB_USER={{your_db_user}}
export DB_PASSWORD={{your_db_password}}
export DB_HOST={{your_db_host}}
```
Windows:
```$xslt
SET DB={{your_db_name}}
SET DB_USER={{your_db_user}}
SET DB_PASSWORD={{your_db_password}}
SET DB_HOST={{your_db_host}}
```
End

Lucas Vitorino.
