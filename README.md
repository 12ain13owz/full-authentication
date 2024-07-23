# Full Authentication with Angular, ExpressJS, Postgres

## Getting started

- create .env file
- generate RSA keys `(Key Size: 2048 bit)`: https://travistidwell.com/jsencrypt/demo/
- generate Secret keys: https://randomkeygen.com/

```
PORT="your_port"
NODE_ENV="your_env"
SECRET_KEY="your_secret_key"
WHITE_LIST="your_whitelist"
DB_URI="your_db_uri"
DB_NAME="your_db_name"
DB_DIALECT="your_db_dialect"
SMTP_HOST="your_smtp_host"
SMTP_PORT="your_smtp_port"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"
ACCESS_TOKEN_PUBLIC_KEY="your_access_token_public_key"
ACCESS_TOKEN_PRIVATE_KEY="your_access_token_private_key"
REFRESH_TOKEN_PUBLIC_KEY="your_refresh_token_public_key"
REFRESH_TOKEN_PRIVATE_KEY="your_refresh_token_private_key"
```

- example .env

```
PORT="3000"
NODE_ENV="development"
SECRET_KEY="JQpzoxGy0YMy8NbubdoH3Avcfk8qm8mO"
WHITE_LIST="http://localhost:4200"
DB_URI="postgres://user_postgres:pass_postgres@localhost:5432"
DB_NAME="tutarial_auth"
DB_DIALECT="postgres"
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_USER="maddison53@ethereal.email"
SMTP_PASS="jn7jnAPss4f63QBp6D"
```

- Install Dependencies

cd <project_name>\backend
cd <project_name>\frontend

```
npm install
```

- Run Application

```
npm run dev
ng serve
```
