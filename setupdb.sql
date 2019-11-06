CREATE TABLE employee (
	firstname varchar(200) DEFAULT 'varchar'::character varying NOT NULL,
	lastname varchar(200) DEFAULT 'varchar'::character varying NOT NULL,
	email varchar(400) DEFAULT 'varchar'::character varying NOT NULL,
	"password" varchar(2000) DEFAULT 'varchar'::character varying NOT NULL,
	gender varchar(200) DEFAULT 'varchar'::character varying NOT NULL,
	job_role varchar(800) DEFAULT 'varchar'::character varying NOT NULL,
	department varchar(800) DEFAULT 'varchar'::character varying NOT NULL,
	address varchar(5000) DEFAULT 'varchar'::character varying NOT NULL,
	employeeid serial NOT NULL,
	PRIMARY KEY (employeeid)
);

CREATE TABLE gif (
	gifid serial NOT NULL,
	title varchar(200) DEFAULT 'varchar'::character varying,
	image_url varchar(8000) DEFAULT 'varchar'::character varying,
	date_created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	authorid bigint,
	PRIMARY KEY (gifid)
);

ALTER TABLE gif
	ADD FOREIGN KEY (authorid) 
	REFERENCES employee (employeeid);

CREATE TABLE article (
	title varchar(400) DEFAULT 'varchar'::character varying NOT NULL,
	article varchar(10485760) DEFAULT 'varchar'::character varying NOT NULL,
	date_created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	articleid serial NOT NULL,
	authorid bigint,
	PRIMARY KEY (articleid)
);

ALTER TABLE article
	ADD FOREIGN KEY (authorid) 
	REFERENCES employee (employeeid);

CREATE TABLE comment (
	commentid serial NOT NULL,
	"comment" varchar(103000) DEFAULT 'varchar'::character varying,
	authorid bigint,
	articleid bigint,
	gifid bigint,
	date_created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY (commentid)
);

ALTER TABLE comment
	ADD FOREIGN KEY (authorid) 
	REFERENCES employee (employeeid);

ALTER TABLE comment
	ADD FOREIGN KEY (articleid) 
	REFERENCES article (articleid);

ALTER TABLE comment
	ADD FOREIGN KEY (gifid) 
	REFERENCES gif (gifid);