

```sql
CREATE DATABASE servidores1 ;
USE servidores1;

CREATE TABLE users ( 
    id INT NOT NULL AUTO_INCREMENT,
    login VARCHAR(100),
    password VARCHAR(250),
    name VARCHAR(30),
    CONSTRAINT PK_USERS_ID PRIMARY KEY(id)
);

INSERT INTO users ( login, password, name ) VALUES
( "jose@test.com", "123", "jose"),
( "marinho@gmail.cm", "234", "marinho");
```