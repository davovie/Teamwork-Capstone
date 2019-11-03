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
	"comment" varchar(7000) DEFAULT 'varchar'::character varying,
	PRIMARY KEY (gifid)
);