import baseUser from './base_user.js';

const getEmployeeInfo = (employeeIds, cache, email, dbConn) => {
  let user = baseUser;
  let employeeIdsLookup = Promise.resolve(employeeIds);
  if (employeeIds === null || employeeIds.length === 0) {
    // We could check that it's ashevillenc.gov first, actually.
    const query = 'select emp_id from internal.ad_info where email_city = $1';
    employeeIdsLookup = dbConn.query(query, [email])
      .then((res) => {
        if (res && res.rows && res.rows.length > 0) {
          return Promise.resolve([res.rows[0].empid]);
        }
        throw new Error(`Unable to find employee record for ${email}`);
      });
  }

  const userMap = {};

  return employeeIdsLookup
    .then((empIds) => {
      const needLookup = [];
      const cacheKeys = empIds.map(id => `employee-${id}`);
      return cache.mget(cacheKeys)
        .then((cachedUsers) => {
          cachedUsers.forEach((u, j) => {
            if (u !== undefined) userMap[u.id] = u;
            else {
              needLookup.push(empIds[j]);
            }
          });
          const query = 'select emp_id, active, position, ft_status, employee, emp_email, sup_id, supervisor, '
          + 'dept_id, department, div_id, division, hire_date, '
          + 'sup_email from internal.pr_employee_info where emp_id = ANY($1)';
          return dbConn.query(query, [needLookup])
            .then((data) => {
              if (data.rows && data.rows.length > 0) {
                data.rows.forEach((e) => {
                  user = Object.assign({}, baseUser, {
                    id: e.emp_id,
                    active: e.active,
                    name: e.employee,
                    email: e.emp_email,
                    position: e.position,
                    ft_status: e.ft_status,
                    department_id: e.dept_id,
                    department: e.department,
                    division_id: e.div_id,
                    division: e.division,
                    supervisor_id: e.sup_id,
                    supervisor_name: e.supervisor,
                    supervisor_email: e.sup_email,
                    hire_date: e.hire_date,
                  });
                  cache.store(`employee-${user.id}`, user); // Should wait to verify, but skip for now.
                  userMap[user.id] = user;
                });
              }
              return Promise.resolve(Object.keys(userMap).map(eid => userMap[eid]));
            })
            .catch((error) => {
              console.log(`Error: ${error}`); // eslint-disable-line no-console
              return Promise.resolve(user);
            });
        });
    });
};

export default getEmployeeInfo;
