# Authentication with Angular, ExpressJS, PostgresSQL

## Getting started

- Create .env file backend/.env.dev
- Generate RSA keys `(Key Size: 2048 bit)`: https://travistidwell.com/jsencrypt/demo/
- Generate Secret keys: https://randomkeygen.com/

```
PORT="your_port"
NODE_ENV="your_env"
SECRET_KEY="your_secret_key"
WHITE_LIST="your_whitelist"
DB_HOST="your_db_host"
DB_PORT="your_db_port"
DB_NAME="your_db_name"
DB_DIALECT="your_db_dialect"
DB_USER="your_db_user"
DB_PASS="your_db_pass"
SMTP_HOST="your_smtp_host"
SMTP_PORT="your_smtp_port"
SMTP_SECURE="your_smtp_secure"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"
ACCESS_TOKEN_PUBLIC_KEY="your_access_token_public_key"
ACCESS_TOKEN_PRIVATE_KEY="your_access_token_private_key"
REFRESH_TOKEN_PUBLIC_KEY="your_refresh_token_public_key"
REFRESH_TOKEN_PRIVATE_KEY="your_refresh_token_private_key"
```

- Example .env

```
PORT="3000"
NODE_ENV="development"
SECRET_KEY="JQpzoxGy0YMy8NbubdoH3Avcfk8qm8mO"
WHITE_LIST="http://localhost:4200"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="tutorial_auth"
DB_DIALECT="postgres"
DB_USER="user_postgres"
DB_PASS="pass_postgres"
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="maddison53@ethereal.email"
SMTP_PASS="jn7jnAPss4f63QBp6D"
```

- Install Dependencies

1. cd <project_name>\backend
2. cd <project_name>\frontend

```
npm install
```

- Create database Postgres (Ex. tutorial_auth)

- Run Application

```
npm run dev
ng serve
```
