BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) values ('jessie', 'jessie@gmail.com', 5, '2018-01-01');
INSERT INTO users (name, email, entries, joined) values ('test', 'test@test.com', 20, '2011-05-16');
INSERT INTO login (hash, email) values ('$2a$10$rOeuCOjcs01fcZqqV5DNuOBOHSDId525nYQzr3h9MWFOjC99jdoOe', 'jessie@gmail.com');
INSERT INTO login (hash, email) values ('$2a$10$wpq.pT/TnqKm2zunl94LFO4LaI6b3IMgc4FiVMinehpPpTVjsUQ.i', 'test@test.com');

COMMIT;