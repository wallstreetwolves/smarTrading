DROP TABLE IF EXISTS accounts;

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL
);

DROP TABLE IF EXISTS profiles;

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  account_id INT,
  firstName CHAR(64),
  lastName CHAR(64),
  username varchar(50) NOT NULL,
  email CHAR(128),
  password CHAR(60)
);

INSERT INTO accounts (id, username, password, email) VALUES (1, 'afnandamra', '123456', 'afnan.96@hotmail.com');

INSERT INTO profiles
(id, firstName, lastName, username, email, password)
VALUES (1, 'Afnan', 'Damra', 'afnandamra', 'afnan.96@hotmail.com', '123456');

UPDATE profiles SET account_id=account.id FROM (SELECT * FROM accounts) AS account WHERE profiles.username = account.username;

ALTER TABLE profiles ADD CONSTRAINT fk_profiles FOREIGN KEY (account_id) REFERENCES accounts(id);