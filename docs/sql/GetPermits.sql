-- Not used
    select true as minor, false as major, permit_num, 
    case when coalesce(applicant_name,'')='' Then address else applicant_name end as name, x, y
    -- ,applied_date,permit_group, permit_type, permit_subtype
    FROM simplicity.simplicity_permits_view
    where permit_group = 'Planning'
    and permit_type = 'Development'
    and permit_subtype = 'Level I'
    and applied_date >= NOW() - '30 days'::interval
    union
    select false as minor, true as major, permit_num, 
    case when coalesce(applicant_name,'')='' Then address else applicant_name end as name, x, y
    -- ,applied_date,permit_group, permit_type, permit_subtype
    FROM simplicity.simplicity_permits_view
    where permit_group = 'Planning'
    and (
      (permit_type = 'Subdivision' and permit_subtype = 'Major')
      or
      (permit_type = 'Development' and permit_subtype IN ('Level II','Level III','Conditional Zoning','Conditional Use'))
      )
    and applied_date >= NOW() - '30 days'::interval