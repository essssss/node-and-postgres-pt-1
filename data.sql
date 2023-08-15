\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS companies_industries CASCADE;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  industry text NOT NULL
);

CREATE TABLE companies_industries (
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('ms', 'Microsoft', 'We were the Baddies'),
         ('marathon', 'Marathon Petroleum', 'Pollution!'),
         ('fedex', 'FedEx', 'Shipping'),
         ('tesla', 'Tesla', 'Electric go fast.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, industry)
  VALUES ('fin', 'Finance'),
         ('mktg', 'Martketing'),
         ('tech', 'Technology'),
         ('man', 'Manufacturing'),
         ('rd', 'Research and Development');

INSERT INTO companies_industries (comp_code, ind_code)
  VALUES ('apple', 'mktg'),
         ('apple', 'tech'),
         ('apple', 'man'),
         ('ibm', 'man'),
         ('ibm', 'tech'),
         ('ms', 'tech'),
         ('ms', 'rd'),
         ('marathon', 'man'),
         ('marathon', 'fin'),
         ('fedex', 'fin'),
         ('tesla', 'man'),
         ('tesla', 'rd'),
         ('tesla', 'mktg');