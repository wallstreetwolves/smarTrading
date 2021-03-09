-- DROP TABLE IF EXISTS accounts;

-- CREATE TABLE IF NOT EXISTS accounts (
--   id SERIAL PRIMARY KEY,
--   account_id INT,
--   username varchar(50) NOT NULL,
--   password CHAR(60),
--   email varchar(100) NOT NULL
-- );

DROP TABLE IF EXISTS profiles;

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  firstName CHAR(64),
  lastName CHAR(64),
  username varchar(50) NOT NULL,
  email CHAR(128),
  password CHAR(60),
  balance FLOAT DEFAULT 50000
);

-- UPDATE accounts SET account_id=profiles.id FROM (SELECT * FROM profiles) AS profiles WHERE profiles.username=accounts.username;

-- ALTER TABLE accounts ADD CONSTRAINT fk_profiles FOREIGN KEY (account_id) REFERENCES profiles(id);