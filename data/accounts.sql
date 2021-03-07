DELETE TABLE IF EXISTS accounts;

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL
);

INSERT INTO accounts (id, username, password, email) VALUES (1, 'afnandamra', '123456', 'afnan.96@hotmail.com');