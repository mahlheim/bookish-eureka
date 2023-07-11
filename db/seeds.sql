INSERT INTO department(department_name)
VALUES  ("Key Creative Team"), 
        ("Production Department"), 
        ("Script Department"), 
        ("Location Department"), 
        ("Camera Department"),
        ("Sound Department"),
        ("Grip Department");

INSERT INTO role(title, salary, department_id)
VALUES  ("Producer", 90000, 1), 
        ("Screen Writer", 60000, 1), 
        ("Executive Producer", 100000, 2), 
        ("Script Editor", 30000, 3),
        ("Location Scout", 40000, 4),
        ("Director of Photography", 78000, 5),
        ("Motion Control Technician", 53000, 5),
        ("Boom Operator", 44000, 6),
        ("Key Grip", 89000, 7),
        ("Best Boy", 77000, 7);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ('George', 'Clooney', 1, 3), 
        ('Tim Blake', 'Nelson', 2, 3), 
        ('John', 'Turturro', 3, null), 
        ('John', 'Goodman', 4, 1), 
        ('Holly', 'Hunter', 5, 6),
        ('Joel', 'Coen', 6, null), 
        ('Ethan', 'Coen', 7, 6), 
        ('Ulysses Everett', 'McGill', 8, null), 
        ('Delmar', 'O Donnell', 9, null), 
        ('Judas Iscariot', 'Hogwallop', 10, 9);