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
  ('Virginia', 'Woolf', 2, 2),
  ('Piers', 'Gaveston', 3, 3),
  ('Charles', 'LeRoi', 4, 4),
  ('Katherine', 'Mansfield', 5, 3),
  ('Dora', 'Carrington', 5, 3),
  ('Edward', 'Bellamy', 2, 2),
  ('Montague', 'Summers', 2, 2),
  ('Octavia', 'Butler', 1, 1),
  ('Unica', 'Zurn', 1, 1);