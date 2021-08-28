INSERT INTO departments (dept_name)
VALUES('IT'),('Human Resources'),('Security'),('API Team'),('Database Team'),('Product Team'),('Sales'),('Management'),('Customer Service');

INSERT INTO roles (job_title, salary, department_id)
VALUES('Help Desk Tech','45000.00', 1),
('HR Rep','50000.00', 2),
('Security Officer','35000.00', 3),
('API Engineer','60000.00', 4),
('SQL Engineer','65000.00', 5),
('Product Manager','75000.00', 6),
('Sales Rep','55000.00', 7),
('Supervisor','49000.00', 8),
('CS Rep','30000.00', 9);

INSERT INTO employees (first_name, last_name, role_title, manager_id)
VALUES('Jim','Smith', 5, NULL),('Peyton','Manning', 4, 1),('Michael','Hodges', 6, 2),
('Luke','Skywalker', 3, NULL);