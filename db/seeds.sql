INSERT INTO department (department_name)
VALUES
    ('Technology'),
    ('Legal'),
    ('HR'),
    ('Finance'),
    ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Senior Software Engineer', 165000, 1),
    ('Recruiter', 75000, 3),
    ('Accountant', 125000, 4),
    ('Associate Counsel, Product', 265000, 2),
    ('Sr. Strategic Growth Manager', 95000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, 1),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 3, NULL),
  ('Charles', 'LeRoi', 4, 1),
  ('Katherine', 'Mansfield', 5, 2),
  ('Dora', 'Carrington', 5, NULL),
  ('Edward', 'Bellamy', 2, 5),
  ('Montague', 'Summers', 2, 5),
  ('Octavia', 'Butler', 1, 5),
  ('Unica', 'Zurn', 1, NULL);